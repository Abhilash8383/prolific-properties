// Run with: node --env-file=.env.local scripts/migrate-property-fields.mjs --target=local [--apply]
//       or: node --env-file=.env scripts/migrate-property-fields.mjs --target=production [--apply]
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import mongodb from "mongodb";

const { MongoClient } = mongodb;
const { EJSON } = mongodb.BSON;

const target = process.argv.find((arg) => arg.startsWith("--target="))?.split("=")[1];
const apply = process.argv.includes("--apply");
if (!process.env.MONGODB_URI || !["local", "production"].includes(target)) {
  throw new Error("Set MONGODB_URI and pass --target=local or --target=production");
}

const uri = new URL(process.env.MONGODB_URI);
const isLocal = ["localhost", "127.0.0.1", "::1"].includes(uri.hostname);
if ((target === "local") !== isLocal) throw new Error(`The URI does not match the ${target} target`);
if (target === "production" && uri.protocol !== "mongodb+srv:") throw new Error("Production migration requires a MongoDB Atlas SRV URI");

// The Atlas URI in .env has no database path. Both environments use this database.
const databaseName = "prolific_properties";
const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });

try {
  await client.connect();
  const collection = client.db(databaseName).collection("properties");
  const documents = await collection.find({}, { projection: { price: 1, units: 1 } }).toArray();
  if (!documents.length) throw new Error(`No properties found in ${target}/${databaseName}; check the target database`);
  const invalid = documents.filter((doc) =>
    (typeof doc.price !== "number" && typeof doc.price !== "string") ||
    (doc.units !== undefined && doc.units !== null && (!Number.isSafeInteger(doc.units) || doc.units < 0)),
  );
  if (invalid.length) throw new Error(`${invalid.length} properties have unexpected price or units values; inspect them before migrating`);

  const numericPrices = documents.filter((doc) => typeof doc.price === "number").length;
  const missingUnits = documents.filter((doc) => doc.units === undefined).length;
  console.log(`${target}/${databaseName}: ${documents.length} properties, ${numericPrices} numeric prices, ${missingUnits} missing unit counts`);
  if (!apply || (!numericPrices && !missingUnits)) {
    console.log(apply ? "Already migrated." : "Dry run only. Pass --apply to migrate.");
    process.exitCode = 0;
  } else {
    const backupDirectory = path.resolve(".preview/migrations");
    await mkdir(backupDirectory, { recursive: true, mode: 0o700 });
    const backupPath = path.join(backupDirectory, `${target}-property-fields-${new Date().toISOString().replaceAll(":", "-")}.ejson`);
    await writeFile(backupPath, EJSON.stringify(documents, { relaxed: false }), { mode: 0o600, flag: "wx" });
    console.log(`Backup written to ${backupPath}`);

    const prices = await collection.updateMany({ price: { $type: "number" } }, [{ $set: { price: { $toString: "$price" } } }]);
    const units = await collection.updateMany({ units: { $exists: false } }, { $set: { units: null } });
    const remainingPrices = await collection.countDocuments({ price: { $type: "number" } });
    const remainingUnits = await collection.countDocuments({ units: { $exists: false } });
    if (remainingPrices || remainingUnits) throw new Error(`Migration incomplete: ${remainingPrices} numeric prices, ${remainingUnits} missing unit counts`);
    console.log(`Migrated ${prices.modifiedCount} prices and ${units.modifiedCount} unit counts; verified complete.`);
  }
} finally {
  await client.close();
}
