import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";

import AdvertisementModel from "@/lib/models/AdvertisementModel";
import { deleteFileIfExists, saveImageToLocal } from "@/lib/functions";
import axios from "axios";

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await ConnectDB();

    // Find the advertisement by ID
    const advertisement = await AdvertisementModel.findById(id);

    if (!advertisement) {
      return NextResponse.json(
        { error: "advertisement not found" },
        { status: 404 }
      );
    }

    const publicId = advertisement.image.public_id;
    if (publicId) {
      const deleted = deleteFileIfExists("advertisement", publicId);
      if (!deleted) {
        console.warn("Image file not found or already deleted:", publicId);
      }
    }
    await AdvertisementModel.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "advertisement deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    return NextResponse.json(
      { error: "Failed to delete advertisement" },
      { status: 500 }
    );
  }
}

// GET advertisement by ID
export async function GET(req, { params }) {
  const { id } = params; // Extract ID from params

  try {
    await ConnectDB(); // Ensure DB connection
    const advertisement = await AdvertisementModel.findById(id); // Properly await the findById function

    if (!advertisement) {
      return NextResponse.json(
        { error: "advertisement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ advertisement }, { status: 200 });
  } catch (error) {
    console.error("Error fetching advertisement:", error);
    return NextResponse.json(
      { error: "Error while fetching advertisement" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const { id } = params;

  try {
    await ConnectDB();
    const formData = await req.formData();
    const image = formData.get("image");
    const link = formData.get("link");
    const file = formData.get('image');

    // Find the existing advertisement
    const advertisement = await AdvertisementModel.findById(id);
    if (!advertisement) {
      return NextResponse.json(
        { error: "advertisement not found" },
        { status: 404 }
      );
    }
    // Check if an image is being uploaded
    if (image && image.size > 0) {
      // If there's a new image, handle the old image deletion
      const publicId = advertisement.image?.public_id;
      if (publicId) {
        const deleted = deleteFileIfExists("advertisement", publicId);
        if (!deleted) {
          console.warn("Image file not found or already deleted:", publicId);
        }
      }
      const uploadData = await saveImageToLocal('advertisement', file);
      // Update the testimonial with the new image data
      advertisement.image = {
        url: uploadData.url,
        public_id: uploadData.filename,
      };
    }
    // Update the advertisement fields only if new values are provided
    advertisement.link = link || advertisement.link;

    // Save the updated advertisement
    await advertisement.save();

    return NextResponse.json(
      { message: "advertisement updated successfully", advertisement },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating advertisement:", error);
    return NextResponse.json(
      { error: "Failed to update advertisement" },
      { status: 500 }
    );
  }
}
