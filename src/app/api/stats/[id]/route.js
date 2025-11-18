import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/db/ConnectDB';


import { deleteFileIfExists, saveImageToLocal } from '@/lib/functions';
import axios from 'axios';
import StatsModel from "@/lib/models/StatModel";
export async function GET(req, { params }) {
  const { id } = params;

  try {
    await ConnectDB();
    const stat = await StatsModel.findById(id);

    if (!stat) {
      return NextResponse.json({ error: "Stat not found" }, { status: 404 });
    }

    return NextResponse.json({ stat }, { status: 200 });
  } catch (error) {
    console.error("Error fetching stat:", error);
    return NextResponse.json({ error: "Failed to fetch stat" }, { status: 500 });
  }
}

// DELETE: Delete a stat by ID
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await ConnectDB();
    const stat = await StatsModel.findById(id);

    if (!stat) {
      return NextResponse.json({ error: "Stat not found" }, { status: 404 });
    }

    // Delete image from local storage if exists
    const publicId = stat.image?.public_id;
    if (publicId) {
      const deleted = deleteFileIfExists("stats", publicId);
      if (!deleted) {
        console.warn("Image file not found or already deleted:", publicId);
      }
    }

    await StatsModel.findByIdAndDelete(id);
    return NextResponse.json({ message: "Stat deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting stat:", error);
    return NextResponse.json({ error: "Failed to delete stat" }, { status: 500 });
  }
}

// PUT: Update a stat by ID
export async function PUT(req, { params }) {
  const { id } = params;

  try {
    await ConnectDB();
    const formData = await req.formData();

    const title = formData.get("title") ?? "";       // empty string if null
    const subtitle = formData.get("subtitle") ?? "";
    const description = formData.get("description") ?? "";
    const statsNumber = formData.get("statsNumber") ?? "";
    const image = formData.get("image"); // new file
    const file = image;

    // Validate image size (1 MB max)
    if (file && file.size > 1 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 1 MB limit" }, { status: 400 });
    }

    const stat = await StatsModel.findById(id);
    if (!stat) {
      return NextResponse.json({ error: "Stat not found" }, { status: 404 });
    }

    // Handle new image upload
    if (image && image.size > 0) {
      // Delete old image
      const publicId = stat.image?.public_id;
      if (publicId) {
        const deleted = deleteFileIfExists("stats", publicId);
        if (!deleted) console.warn("Image file not found or already deleted:", publicId);
      }

      const uploadData = await saveImageToLocal("stats", file);
      stat.image = {
        url: uploadData.url,
        public_id: uploadData.filename,
      };
    }

    // **Always update fields, even if empty**
    stat.title = title;
    stat.subtitle = subtitle;
    stat.description = description;
    stat.statsNumber = statsNumber;

    await stat.save();

    return NextResponse.json({ message: "Stat updated successfully", stat }, { status: 200 });
  } catch (error) {
    console.error("Error updating stat:", error);
    return NextResponse.json({ error: "Failed to update stat" }, { status: 500 });
  }
}
