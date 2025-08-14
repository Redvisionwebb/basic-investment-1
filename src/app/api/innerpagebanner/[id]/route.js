import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/db/ConnectDB';
import cloudinary from '@/lib/cloudinary';
import path from 'path';
import fs from 'fs';
import InnerBannerPageModel from '@/lib/models/InnerPageBanner';
import { deleteFileIfExists, saveImageToLocal } from '@/lib/functions';
import axios from 'axios';

export async function DELETE(req, { params }) {
    const { id } = params;

    try {
        await ConnectDB();

        // Find the innerpagebanner by ID
        const innerpagebanner = await InnerBannerPageModel.findById(id);
        if (!innerpagebanner) {
            return NextResponse.json({ error: 'inner page banner not found' }, { status: 404 });
        }

        const publicId = innerpagebanner.image.public_id;
          if (publicId) {
              const deleted = deleteFileIfExists("innerpagebanner", publicId);
              if (!deleted) {
                console.warn("Image file not found or already deleted:", publicId);
              }
            }
        await InnerBannerPageModel.findByIdAndDelete(id);
        return NextResponse.json({ message: 'inner page banner deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting inner page banner:', error);
        return NextResponse.json({ error: 'Failed to delete inner page banner' }, { status: 500 });
    }
}

// GET innerpagebanner by ID
export async function GET(req, { params }) {
    const { id } = params; // Extract ID from params

    try {
        await ConnectDB(); // Ensure DB connection
        const innerpagebanner = await InnerBannerPageModel.findById(id); // Properly await the findById function

        if (!innerpagebanner) {
            return NextResponse.json({ error: 'inner page banner not found' }, { status: 404 });
        }

        return NextResponse.json({ innerpagebanner }, { status: 200 });
    } catch (error) {
        console.error('Error fetching inner page banner:', error);
        return NextResponse.json({ error: 'Error while fetching inner page banner' }, { status: 500 });
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

        // Find the existing innerpagebanner
        const innerpagebanner = await InnerBannerPageModel.findById(id);

        if (!innerpagebanner) {
            return NextResponse.json({ error: 'inner page banner not found' }, { status: 404 });
        }
        // Check if an image is being uploaded
         if (image && image.size > 0) {
      // If there's a new image, handle the old image deletion
      const publicId = innerpagebanner.image?.public_id;
      if (publicId) {
        const deleted = deleteFileIfExists("innerpagebanner", publicId);
        if (!deleted) {
          console.warn("Image file not found or already deleted:", publicId);
        }
      }
      const uploadData = await saveImageToLocal('innerpagebanner', file);
      // Update the innerpagebanner with the new image data
      innerpagebanner.image = {
        url: uploadData.url,
        public_id: uploadData.filename,
      };
    }

        // Update the innerpagebanner fields only if new values are provided
        innerpagebanner.title = title || innerpagebanner.innerpagebanner;
        // Save the updated innerpagebanner
        await innerpagebanner.save();

        return NextResponse.json({ message: 'inner page banner updated successfully', innerpagebanner }, { status: 200 });
    } catch (error) {
        console.error('Error updating inner page banner:', error);
        return NextResponse.json({ error: 'Failed to update inner page banner' }, { status: 500 });
    }
}
