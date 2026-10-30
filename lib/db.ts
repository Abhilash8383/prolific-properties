import "server-only";
import { GridFSBucket, MongoClient, type Document, type WithId } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");

const g = globalThis as unknown as { _mongo?: Promise<MongoClient> };
function client() {
  g._mongo ??= new MongoClient(uri!).connect().catch((error) => {
    g._mongo = undefined;
    throw error;
  });
  return g._mongo;
}

export async function db() {
  return (await client()).db("prolific_properties");
}

export async function collection<T extends Document = Document>(name: string) {
  return (await db()).collection<T>(name);
}

export async function imageBucket() {
  return new GridFSBucket(await db(), { bucketName: "images" });
}

// Cached functions and client components need plain objects, not ObjectIds or Dates.
export function serialize<T>(doc: WithId<Document>): T {
  const { _id, ...rest } = doc;
  const out: Record<string, unknown> = { id: _id.toString() };
  for (const [k, v] of Object.entries(rest)) out[k] = v instanceof Date ? v.toISOString() : v;
  return out as T;
}
