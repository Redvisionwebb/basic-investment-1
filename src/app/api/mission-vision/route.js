import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";
import MissionVisionModel from "@/lib/models/MissionVissionModel";

// POST: Create or update MissionVision content
export async function POST(req) {
  try {
    await ConnectDB();
    const body = await req.json();

    const { mission, vision, values } = body;

    if (!mission || !vision || !values) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Check if a document exists, then update it; otherwise create new
    const existing = await MissionVisionModel.findOne();

    let result;
    if (existing) {
      result = await MissionVisionModel.findByIdAndUpdate(
        existing._id,
        { mission, vision, values },
        { new: true }
      );
    } else {
      result = await MissionVisionModel.create({ mission, vision, values });
    }

    return NextResponse.json({ message: "Mission & Vision saved successfully.", data: result }, { status: 201 });
  } catch (error) {
    console.error("Error saving mission & vision:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET: Retrieve MissionVision content
export async function GET() {
  try {
    await ConnectDB();
    const result = await MissionVisionModel.findOne().sort({ createdAt: -1 });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching mission & vision:", error);
    return NextResponse.json({ error: "Failed to fetch mission & vision" }, { status: 500 });
  }
}
