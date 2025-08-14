import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/db/ConnectDB';
import AboutUsModel from '@/lib/models/AboutUsModel';
import path from 'path';
import fs from 'fs';
import { deleteFileIfExists, saveImageToLocal } from '@/lib/functions';
import axios from 'axios';



// GET About Us by ID
export async function GET(req, { params }) {
  const { id } = params;
  try {
    await ConnectDB();
    const about = await AboutUsModel.findById(id);
    if (!about) {
      return NextResponse.json({ error: 'About Us not found' }, { status: 404 });
    }
    return NextResponse.json({ about }, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Error fetching About Us data' }, { status: 500 });
  }
}

// PUT: Update About Us
export async function PUT(req, { params }) {
  const { id } = params;

  try {
    await ConnectDB();
    const formData = await req.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const image = formData.get('image');
    const file = formData.get('image');


    const about = await AboutUsModel.findById(id);
    if (!about) {
      return NextResponse.json({ error: 'About Us not found' }, { status: 404 });
    }

    // If image is updated
        if (image && image.size > 0) {
      // If there's a new image, handle the old image deletion
      const publicId = about.image?.public_id;
      if (publicId) {
        const deleted = deleteFileIfExists("aboutus", publicId);
        if (!deleted) {
          console.warn("Image file not found or already deleted:", publicId);
        }
      }
      const uploadData = await saveImageToLocal('aboutus', file);
      // Update the testimonial with the new image data
      about.image = {
        url: uploadData.url,
        public_id: uploadData.filename,
      };
    }
    about.title = title || about.title;
    about.description = description || about.description;

    await about.save();
    return NextResponse.json({ message: 'About Us updated successfully', about }, { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update About Us' }, { status: 500 });
  }
}

// DELETE: Remove About Us by ID
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await ConnectDB();
    const about = await AboutUsModel.findById(id);
    if (!about) {
      return NextResponse.json({ error: 'About Us not found' }, { status: 404 });
    }

    if (about.image?.public_id) {
      const deleted = deleteFileIfExists("aboutus", about.image?.public_id);
            if (!deleted) {
              console.warn("Image file not found or already deleted:", publicId);
            }
    }

    await AboutUsModel.findByIdAndDelete(id);
    return NextResponse.json({ message: 'About Us deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete About Us' }, { status: 500 });
  }
}
