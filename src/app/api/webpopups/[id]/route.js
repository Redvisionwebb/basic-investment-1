import { NextResponse } from "next/server";
import PopupsModel from "@/lib/models/PopupsModel";
import { ConnectDB } from "@/lib/db/ConnectDB";
import { deleteFileIfExists, saveImageToLocal } from "@/lib/functions";
import axios from "axios";

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await ConnectDB();

    // Find the popup by ID
    const popup = await PopupsModel.findById(id);

    if (!popup) {
      return NextResponse.json({ error: "popup not found" }, { status: 404 });
    }

    const publicId = popup.image.public_id;
    if (publicId) {
      const deleted = deleteFileIfExists("popups", publicId);
      if (!deleted) {
        console.warn("Image file not found or already deleted:", publicId);
      }
    }
    await PopupsModel.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "popup deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting popup:", error);
    return NextResponse.json(
      { error: "Failed to delete popup" },
      { status: 500 }
    );
  }
}

// GET popup by ID
export async function GET(req, { params }) {
  const { id } = params; // Extract ID from params

  try {
    await ConnectDB(); // Ensure DB connection
    const popup = await PopupsModel.findById(id); // Properly await the findById function

    if (!popup) {
      return NextResponse.json({ error: "popup not found" }, { status: 404 });
    }

    return NextResponse.json({ popup }, { status: 200 });
  } catch (error) {
    console.error("Error fetching popup:", error);
    return NextResponse.json(
      { error: "Error while fetching popup" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const { id } = params; // Extract popup ID from params
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const title = formData.get("title");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const uploadData = await saveImageToLocal('popups', file);

    await PopupsModel.findByIdAndUpdate(id, {
      image: {
        url: uploadData.url,
        public_id: uploadData.filename,
      },
      title,
    });
    return NextResponse.json(
      { message: "Data Aded successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error updating popup:", error);
    return NextResponse.json(
      { error: "Failed to update popup" },
      { status: 500 }
    );
  }
}
