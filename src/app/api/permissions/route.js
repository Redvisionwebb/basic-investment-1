// app/api/permissions/route.js
import { ConnectDB } from "@/lib/db/ConnectDB";
import Permissions from "@/lib/models/Permissions";
import RoboModel from "@/lib/models/RoboModel";

export async function GET() {
  try {
    await ConnectDB();

    // Get Robo user
    const robo = await RoboModel.findOne().lean();

    // Fetch all permissions
    let permissions = await Permissions.find({}).lean();

    // If no permissions exist, return empty array
    if (!permissions) permissions = [];

    // Map permissions and force risk_questions = false if softwareUser is true
    const formattedPermissions = permissions.map(p => {
      if (p.permission === "risk_questions" && robo?.softwareUser) {
        return { permission: p.permission, enabled: false, __v: p.__v };
      }
      return { permission: p.permission, enabled: p.enabled, __v: p.__v };
    });

    return new Response(JSON.stringify(formattedPermissions), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: "Failed" }), { status: 500 });
  }
}
export async function PATCH(req) {
  try {
    await ConnectDB();
    const { permission, enabled } = await req.json();

    const robo = await RoboModel.findOne();

    // Force disable risk_questions if softwareUser is true
    let newEnabled = enabled;
    if (permission === "risk_questions" && robo?.softwareUser) {
      newEnabled = false;
    }

    await Permissions.updateOne(
      { permission },
      { $set: { enabled: newEnabled } },
      { upsert: true }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: "Failed" }), { status: 500 });
  }
}
