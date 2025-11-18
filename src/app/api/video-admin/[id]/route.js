import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import VideoModel from '@/lib/models/VideoModel';
import { deleteFileIfExists, saveImageToLocal } from '@/lib/functions';
import axios from 'axios';
import { ConnectDB } from '@/lib/db/ConnectDB';

export async function DELETE(req, { params }) {
    const { id } = params;

    try {
        await ConnectDB();

        // Find the testimonial by ID
        const video = await VideoModel.findById(id);

        if (!video) {
            return NextResponse.json({ error: 'video not found' }, { status: 404 });
        }

        const publicId = video.image.public_id;
        if (publicId) {
             const deleted = deleteFileIfExists("video", publicId);
             if (!deleted) {
               console.warn("Image file not found or already deleted:", publicId);
             }
           }
        await VideoModel.findByIdAndDelete(id);
        return NextResponse.json({ message: 'video deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting video:', error);
        return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
    }
}

// GET testimonial by ID
export async function GET(req, { params }) {
    const { id } = params; // Extract ID from params

    try {
        await ConnectDB(); // Ensure DB connection
        const video = await VideoModel.findById(id); // Properly await the findById function

        if (!video) {
            return NextResponse.json({ error: 'video not found' }, { status: 404 });
        }

        return NextResponse.json({ video }, { status: 200 });
    } catch (error) {
        console.error('Error fetching video:', error);
        return NextResponse.json({ error: 'Error while fetching video' }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
  const uploadDirectory = path.join(process.cwd(), "public/images");
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
  }

  const { id } = params;

  try {
    await ConnectDB();

    const formData = await req.formData();
    const file = formData.get("image");
    const title = formData.get("title");
    const videoUrl = formData.get("videoUrl");
    const embedUrl = formData.get("embedUrl");

    // Validate file size (1 MB = 1 * 1024 * 1024 bytes)
    if (file && file.size > 1 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 1 MB limit" },
        { status: 400 }
      );
    }

    // Find existing video
    const video = await VideoModel.findById(id);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // 🟢 If embedUrl is provided → only update embedUrl
    if (embedUrl && embedUrl.trim() !== "") {
      video.embedUrl = embedUrl.trim();

      // (Optional) clear other fields if you want embed-only behavior
      // video.title = "";
      // video.videoUrl = "";
      // video.image = { url: "", public_id: "" };

      await video.save();
      return NextResponse.json(
        { message: "✅ Embed URL updated successfully", video },
        { status: 200 }
      );
    }

    // 🔵 If no embedUrl → update title, videoUrl, image
    if (title) video.title = title;
    if (videoUrl) video.videoUrl = videoUrl;

    if (file && file.size > 0) {
      // Delete old image if exists
      const publicId = video.image?.public_id;
      if (publicId) {
        const deleted = deleteFileIfExists("video", publicId);
        if (!deleted) {
          console.warn("Image file not found or already deleted:", publicId);
        }
      }

      // Upload new image
      const uploadData = await saveImageToLocal("video", file);
      video.image = {
        url: uploadData.url,
        public_id: uploadData.filename,
      };
    }

    await video.save();

    return NextResponse.json(
      { message: "✅ Video updated successfully", video },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating video:", error);
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}