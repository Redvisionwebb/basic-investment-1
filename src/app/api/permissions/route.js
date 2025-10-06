// app/api/permissions/route.js
import { ConnectDB } from "@/lib/db/ConnectDB";
import Permissions from "@/lib/models/Permissions";

export async function GET() {
  await ConnectDB();
  const permissions = await Permissions.find({});
  return new Response(JSON.stringify(permissions), { status: 200 });
}

export async function PATCH(req) {
  await ConnectDB();
  const { permission, enabled } = await req.json();
  await Permissions.updateOne({ permission }, { $set: { enabled } }, { upsert: true });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
