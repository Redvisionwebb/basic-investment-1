import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/db/ConnectDB';
import HomeBannerModel from '@/lib/models/HomeBanner';
import { deleteFileIfExists, saveImageToLocal } from '@/lib/functions';
import axios from 'axios';
export async function DELETE(req, { params }) {
    const { id } = await params;

    try {
        await ConnectDB();

        // Find the homeBanner by ID
        const homeBanner = await HomeBannerModel.findById(id);

        if (!homeBanner) {
            return NextResponse.json({ error: 'homeBanner not found' }, { status: 404 });
        }

        const publicId = homeBanner.image.public_id;
            if (publicId) {
              const deleted = deleteFileIfExists("homebanner", publicId);
              if (!deleted) {
                console.warn("Image file not found or already deleted:", publicId);
              }
            }
        await HomeBannerModel.findByIdAndDelete(id);
        return NextResponse.json({ message: 'homeBanner deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting homeBanner:', error);
        return NextResponse.json({ error: 'Failed to delete homeBanner' }, { status: 500 });
    }
}

// GET homeBanner by ID
export async function GET(req, { params }) {
    const { id } = await params; // Extract ID from params

    try {
        await ConnectDB(); // Ensure DB connection
        const homeBanner = await HomeBannerModel.findById(id); // Properly await the findById function

        if (!homeBanner) {
            return NextResponse.json({ error: 'homeBanner not found' }, { status: 404 });
        }

        return NextResponse.json({ homeBanner }, { status: 200 });
    } catch (error) {
        console.error('Error fetching homeBanner:', error);
        return NextResponse.json({ error: 'Error while fetching homeBanner' }, { status: 500 });
    }
}

export async function PUT(req, { params }) {

    const { id } = params;

    try {
        await ConnectDB();
        const formData = await req.formData();
        const image = formData.get('image');
        const title = formData.get('title');
        const designation = formData.get('designation');
        const auther_url = formData.get('auther_url');
    const file = formData.get('image');

        // Find the existing homeBanner
        const homeBanner = await HomeBannerModel.findById(id);
        if (!homeBanner) {
            return NextResponse.json({ error: 'homeBanner not found' }, { status: 404 });
        }
        // Check if an image is being uploaded
        // Check if an image is being uploaded
    if (image && image.size > 0) {
      // If there's a new image, handle the old image deletion
      const publicId = homeBanner.image?.public_id;
      if (publicId) {
        const deleted = deleteFileIfExists("homebanner", publicId);
        if (!deleted) {
          console.warn("Image file not found or already deleted:", publicId);
        }
      }
      const uploadData = await saveImageToLocal('homebanner', file);
      homeBanner.image = {
        url: uploadData.url,
        public_id: uploadData.filename,
      };
    }

        // Update the homeBanner fields only if new values are provided
        homeBanner.title = title || homeBanner.title;
        homeBanner.designation = designation || homeBanner.designation;
        homeBanner.auther_url = auther_url || homeBanner.auther_url;


        // Save the updated homeBanner
        await homeBanner.save();

        return NextResponse.json({ message: 'homeBanner updated successfully', homeBanner }, { status: 200 });
    } catch (error) {
        console.error('Error updating homeBanner:', error);
        return NextResponse.json({ error: 'Failed to update homeBanner' }, { status: 500 });
    }
}
