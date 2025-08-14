import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/db/ConnectDB';

import Gallery from '@/lib/models/Gallery';
import { deleteFileIfExists, saveImageToLocal } from '@/lib/functions';
import axios from 'axios';

export async function DELETE(req, { params }) {
    const { id } = params;

    try {
        await ConnectDB();

        // Find the gallery by ID
        const gallery = await Gallery.findById(id);

        if (!gallery) {
            return NextResponse.json({ error: 'gallery not found' }, { status: 404 });
        }

        const publicId = gallery.image.public_id;
        if (publicId) {
              const deleted = deleteFileIfExists("gallery", publicId);
              if (!deleted) {
                console.warn("Image file not found or already deleted:", publicId);
              }
            }
        await Gallery.findByIdAndDelete(id);
        return NextResponse.json({ message: 'gallery deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting gallery:', error);
        return NextResponse.json({ error: 'Failed to delete gallery' }, { status: 500 });
    }
}

// GET gallery by ID
export async function GET(req, { params }) {
    const { id } = params; // Extract ID from params

    try {
        await ConnectDB(); // Ensure DB connection
        const gallery = await Gallery.findById(id); // Properly await the findById function

        if (!gallery) {
            return NextResponse.json({ error: 'gallery not found' }, { status: 404 });
        }

        return NextResponse.json({ gallery }, { status: 200 });
    } catch (error) {
        console.error('Error fetching gallery:', error);
        return NextResponse.json({ error: 'Error while fetching gallery' }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const { id } = params;

    try {
        await ConnectDB();
        const formData = await req.formData();
        const image = formData.get('image');
    const file = formData.get('image');


        // Find the existing gallery
        const gallery = await Gallery.findById(id);
        if (!gallery) {
            return NextResponse.json({ error: 'gallery not found' }, { status: 404 });
        }
        // Check if an image is being uploaded
        if (image && image.size > 0) {
      // If there's a new image, handle the old image deletion
      const publicId = gallery.image?.public_id;
      if (publicId) {
        const deleted = deleteFileIfExists("gallery", publicId);
        if (!deleted) {
          console.warn("Image file not found or already deleted:", publicId);
        }
      }
      const uploadData = await saveImageToLocal('gallery', file);
      // Update the gallery with the new image data
      gallery.image = {
        url: uploadData.url,
        public_id: uploadData.filename,
      };
    }

        // Save the updated gallery
        await gallery.save();

        return NextResponse.json({ message: 'Gallery updated successfully', gallery }, { status: 200 });
    } catch (error) {
        console.error('Error updating Gallery:', error);
        return NextResponse.json({ error: 'Failed to update Gallery' }, { status: 500 });
    }
}
