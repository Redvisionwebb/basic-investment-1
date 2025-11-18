import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";

import { saveImageToLocal, deleteFileIfExists } from "@/lib/functions";
import GalleryModel from "@/lib/models/Gallery";
import GalleryCategoryModel from "@/lib/models/GalleryCategoryModel";


// ✅ Connect to the database
const LoadDB = async () => {
  await ConnectDB();
};
LoadDB();

// ✅ POST — Upload image with validation
export async function POST(req) {
  let uploaded = null;
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const category = formData.get("category");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > 1 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 1 MB limit" },
        { status: 400 }
      );
    }

    // ✅ Check image count for category
    const existingCount = await GalleryModel.countDocuments({ category });
    if (existingCount >= 10) {
      return NextResponse.json(
        {
          error:
            "Limit reached. You can upload a maximum of 10 images per category.",
        },
        { status: 400 }
      );
    }

    // ✅ Save image
    try {
      uploaded = await saveImageToLocal("gallery", file);
    } catch (uploadError) {
      return NextResponse.json(
        { error: "Image upload failed" },
        { status: 500 }
      );
    }

    await GalleryModel.create({
      image: {
        url: uploaded.url,
        public_id: uploaded.filename,
      },
      category,
    });

    return NextResponse.json(
      { message: "Image uploaded successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (uploaded?.filename) deleteFileIfExists("gallery", uploaded.filename);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}

// ✅ GET — Get all gallery images
export async function GET() {
  try {
    await ConnectDB();
    const gallery = await GalleryModel.find({}).populate("category").sort({ createdAt: -1 });;
    return NextResponse.json(gallery, { status: 200 });
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery images" },
      { status: 500 }
    );
  }
}
