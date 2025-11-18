import { ConnectDB } from "@/lib/db/ConnectDB";
import RoboModel from "@/lib/models/RoboModel";

// 🧠 GET: Fetch Robo data or create default one if none exists
export async function GET() {
  try {
    await ConnectDB();

    let data = await RoboModel.find();

    if (data.length === 0) {
      const defaultData = await RoboModel.create({
        softwareUser: true,
        roboUser: false,
      });
      console.log("✅ Default Robo data created:", defaultData);
      data = [defaultData];
    } else {
      console.log("🟢 Existing Robo data found:", data);
    }

    return Response.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return Response.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// 🧩 PATCH: Update Robo user or create new only if arnId, arnNumber, and deskType exist
export async function PATCH(req) {
  try {
    await ConnectDB();

    const body = await req.json();
    const { id, softwareUser, roboUser, arnId, arnNumber, deskType } = body;

    if (id) {
      const existingUser = await RoboModel.findById(id);
      if (!existingUser) {
        return Response.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

      // If softwareUser is false → force roboUser to false too
      if (softwareUser === false) {
        existingUser.softwareUser = false;
        existingUser.roboUser = false;
      } else {
        if (typeof softwareUser === "boolean")
          existingUser.softwareUser = softwareUser;
        if (typeof roboUser === "boolean")
          existingUser.roboUser = roboUser;
      }

      // Optionally allow ARN and desk update
      if (arnId) existingUser.arnId = arnId;
      if (arnNumber) existingUser.arnNumber = arnNumber;
      if (deskType) existingUser.deskType = deskType;

      await existingUser.save();

      return Response.json(
        { success: true, message: "User updated successfully", data: existingUser },
        { status: 200 }
      );
    }

    // 🆕 If ID is not provided → create new only if all three ARN fields exist
    if (!arnId || !arnNumber || !deskType) {
      return Response.json(
        {
          success: false,
          error:
            "arnId, arnNumber, and deskType are required to create a new record",
        },
        { status: 400 }
      );
    }

    const newUser = await RoboModel.create({
      arnId,
      arnNumber,
      deskType,
      softwareUser: softwareUser ?? true,
      roboUser: roboUser ?? false,
    });

    return Response.json(
      { success: true, message: "New Robo user created", data: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("PATCH error:", error);
    return Response.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
