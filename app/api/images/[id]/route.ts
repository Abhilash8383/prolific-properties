import { ObjectId } from "mongodb";
import { Readable } from "node:stream";
import { imageBucket } from "@/lib/db";

export async function GET(_req: Request, ctx: RouteContext<"/api/images/[id]">) {
  const { id } = await ctx.params;
  if (!ObjectId.isValid(id)) return new Response("Not found", { status: 404 });

  const bucket = await imageBucket();
  const [file] = await bucket.find({ _id: new ObjectId(id) }).toArray();
  if (!file) return new Response("Not found", { status: 404 });

  const stream = Readable.toWeb(bucket.openDownloadStream(file._id)) as ReadableStream;
  return new Response(stream, {
    headers: {
      "Content-Type": String(file.metadata?.contentType ?? "application/octet-stream"),
      "Content-Length": String(file.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
