import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";
import AboutUsModel from "@/lib/models/AboutUsModel";
import axios from "axios";
import { saveImageToLocal } from "@/lib/functions";

export async function POST(req) {
  try {
    await ConnectDB();

    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const file = formData.get("image");

    let uploaded = await saveImageToLocal("aboutus", file);
    const existing = await AboutUsModel.findOne();

    if (existing) {
      // Update
      existing.title = title;
      existing.description = description;
      if (image) existing.image = image;
      await existing.save();
      return NextResponse.json(
        { message: "Updated successfully" },
        { status: 200 }
      );
    } else {
      // Create new
      await AboutUsModel.create({ title, description, image:{
        url:uploaded.url,
        public_id: uploaded.filename
      } });
      return NextResponse.json(
        { message: "Created successfully" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// GET: Fetch About Us content
export async function GET() {
  try {
    await ConnectDB();
    const data = await AboutUsModel.find().sort({ createdAt: -1 });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch About Us" },
      { status: 500 }
    );
  }
}
