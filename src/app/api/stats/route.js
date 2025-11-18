import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";
import axios from "axios";
import { saveImageToLocal } from "@/lib/functions";
import StatsModel from "@/lib/models/StatModel";



// POST: Create Team Member
export async function POST(req) {
  let uploaded = null;
  try {
    await ConnectDB();
    const formData = await req.formData();

    const title = formData.get("title");
    const subtitle = formData.get("subtitle");
    const description = formData.get("description");
    const statsNumber = formData.get("statsNumber");
    const file = formData.get("image");

 

    if (file && file.size > 1 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 1 MB limit" }, { status: 400 });
    }

    if (file) {
      try {
        uploaded = await saveImageToLocal("stats", file);
      } catch (err) {
        return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
      }
    }

    const newStat = await StatsModel.create({
      title,
      subtitle,
      description,
      statsNumber,
      image: uploaded
        ? { url: uploaded.url, public_id: uploaded.filename }
        : null,
    });

    return NextResponse.json({ message: "Stat added successfully", data: newStat }, { status: 201 });
  } catch (error) {
    console.error("Error creating stat:", error);
    if (uploaded?.filename) deleteFileIfExists("stats", uploaded.filename);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET: Get all stats
export async function GET() {
  try {
    await ConnectDB();
    const stats = await StatsModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

