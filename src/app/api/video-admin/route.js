import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ConnectDB } from "@/lib/db/ConnectDB";
import VideoModel from "@/lib/models/VideoModel";
import axios from "axios";
import { saveImageToLocal } from "@/lib/functions";
// // Connect to the database
const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

export async function POST(req) {
  let uploaded = null;
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const title = formData.get("title");
    const videoUrl = formData.get("videoUrl");
    const embedUrl = formData.get("embedUrl");
   uploaded = await saveImageToLocal("video", file);
   

    await VideoModel.create({
      image: {
        url: uploaded.url,
        public_id: uploaded.filename,
      },
      title,
      videoUrl,
      embedUrl,
    });
    return NextResponse.json(
      { message: "Data Added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
     if (uploaded?.filename) {
      deleteFileIfExists("video", uploaded.filename);
    }

    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(req, res) {
  try {
    await ConnectDB(); // Ensure DB connection
    const video = await VideoModel.find({}); // Fetch all
    return NextResponse.json(video, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch Video" },
      { status: 500 }
    );
  }
}
