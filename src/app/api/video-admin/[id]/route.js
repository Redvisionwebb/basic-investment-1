import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/db/ConnectDB';
import cloudinary from '@/lib/cloudinary';

import path from 'path';
import fs from 'fs';
import VideoModel from '@/lib/models/VideoModel';
import { deleteFileIfExists, saveImageToLocal } from '@/lib/functions';
import axios from 'axios';

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

        // console.log(video)

        return NextResponse.json({ video }, { status: 200 });
    } catch (error) {
        console.error('Error fetching video:', error);
        return NextResponse.json({ error: 'Error while fetching video' }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    // Set up the directory where the files will be saved
    const uploadDirectory = path.join(process.cwd(), 'public/images');

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDirectory)) {
        fs.mkdirSync(uploadDirectory, { recursive: true });
    };

    const { id } = params;

    try {
        await ConnectDB();
        const formData = await req.formData();
        const image = formData.get('image');
        const file = formData.get('image');
        const title = formData.get('title');
        const videoUrl = formData.get('videoUrl');
        const embedUrl = formData.get('embedUrl');

        // Find the existing testimonial
        const video = await VideoModel.findById(id);
        if (!video) {
            return NextResponse.json({ error: 'video not found' }, { status: 404 });
        }
        // Check if an image is being uploaded
         if (image && image.size > 0) {
      // If there's a new image, handle the old image deletion
      const publicId = video.image?.public_id;
      if (publicId) {
        const deleted = deleteFileIfExists("video", publicId);
        if (!deleted) {
          console.warn("Image file not found or already deleted:", publicId);
        }
      }
     const uploadData = await saveImageToLocal('video', file);
      // Update the testimonial with the new image data
      video.image = {
        url: uploadData.url,
        public_id: uploadData.filename,
      };
    }

        // Update the testimonial fields only if new values are provided
        video.title = title || video.title;
        video.videoUrl = videoUrl || video.videoUrl;
        video.embedUrl = embedUrl || video.embedUrl;

        // console.log(video.embedUrl)

        // Save the updated testimonial
        await video.save();

        return NextResponse.json({ message: 'video updated successfully', video }, { status: 200 });
    } catch (error) {
        console.error('Error updating video:', error);
        return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
    }
}
