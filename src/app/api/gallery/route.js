import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";
import Gallery from "@/lib/models/Gallery";
import axios from "axios";
import { saveImageToLocal } from "@/lib/functions";
// Upload image to Cloudinary

// // Connect to the database
const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

export async function POST(req) {
  let uploaded=null;
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
     uploaded = await saveImageToLocal("gallery", file);

    await Gallery.create({
      image: {
        url: uploaded.url,
        public_id: uploaded.filename,
      },
    });
    return NextResponse.json(
      { message: "Data Added successfully" },
      { status: 201 }
    );
  } catch (error) {
    // console.log(error)
     if (uploaded?.filename) {
      deleteFileIfExists("gallery", uploaded.filename);
    }

    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(req, res) {
  try {
    await ConnectDB(); // Ensure DB connection
    const testimonial = await Gallery.find({}); // Fetch all blogs
    return NextResponse.json(testimonial, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
