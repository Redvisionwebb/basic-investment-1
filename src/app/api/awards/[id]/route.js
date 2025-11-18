import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";
import { deleteFileIfExists, saveImageToLocal } from "@/lib/functions";
import AwardModel from "@/lib/models/AwardsModel";

// DELETE award by ID
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await ConnectDB();

    const award = await AwardModel.findById(id);
    if (!award) {
      return NextResponse.json({ error: "Award not found" }, { status: 404 });
    }

    // Delete local image if exists
    const publicId = award.image?.public_id;
    if (publicId) {
      const deleted = deleteFileIfExists("awards", publicId);
      if (!deleted) {
        console.warn("Image not found or already deleted:", publicId);
      }
    }

    // Delete from DB
    await AwardModel.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Award deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting award:", error);
    return NextResponse.json(
      { error: "Failed to delete award" },
      { status: 500 }
    );
  }
}

// GET award by ID
export async function GET(req, { params }) {
  const { id } = params;

  try {
    await ConnectDB();
    const award = await AwardModel.findById(id);

    if (!award) {
      return NextResponse.json({ error: "Award not found" }, { status: 404 });
    }

    return NextResponse.json({ award }, { status: 200 });
  } catch (error) {
    console.error("Error fetching award:", error);
    return NextResponse.json(
      { error: "Error while fetching award" },
      { status: 500 }
    );
  }
}

// UPDATE award by ID
export async function PUT(req, { params }) {
  const { id } = params;

  try {
    await ConnectDB();

    const formData = await req.formData();
    const file = formData.get("image");
    const name = formData.get("name");
    const presentedBy = formData.get("presentedBy");
    const date = formData.get("date");
          // Validate file size (1 MB = 1 * 1024 * 1024 bytes)
        if (file && file.size > 1 * 1024 * 1024) {
          return NextResponse.json(
            { error: "File size exceeds 1 MB limit" },
            { status: 400 }
          );
        }

    const award = await AwardModel.findById(id);
    if (!award) {
      return NextResponse.json({ error: "Award not found" }, { status: 404 });
    }

    // If new image uploaded, delete old one and save new
    if (file && file.size > 0) {
      const oldPublicId = award.image?.public_id;
      if (oldPublicId) {
        const deleted = deleteFileIfExists("awards", oldPublicId);
        if (!deleted) {
          console.warn("Old image not found or already deleted:", oldPublicId);
        }
      }

      const uploadData = await saveImageToLocal("awards", file);
      award.image = {
        url: uploadData.url,
        public_id: uploadData.filename,
      };
    }

    // Update other fields
    award.name = name || award.name;
    award.presentedBy = presentedBy || award.presentedBy;
    award.date = date || award.date;

    await award.save();

    return NextResponse.json(
      { message: "Award updated successfully", award },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating award:", error);
    return NextResponse.json(
      { error: "Failed to update award" },
      { status: 500 }
    );
  }
}
