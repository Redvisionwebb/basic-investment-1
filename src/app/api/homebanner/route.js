import { NextResponse } from 'next/server';

import { ConnectDB } from '@/lib/db/ConnectDB';
import HomeBannerModel from '@/lib/models/HomeBanner';
import axios from 'axios';
import { saveImageToLocal } from '@/lib/functions';

// // Connect to the database
const LoadDB = async () => {
    await ConnectDB();
};

LoadDB();


export async function POST(req) {
  let uploaded = null;
  try {
    const formData = await req.formData();
    const file = formData.get('image');
    const title = formData.get('title');
    const designation = formData.get('designation');
    const auther_url = formData.get('auther_url');

    await ConnectDB();

    // ✅ Check existing banners
    const bannerCount = await HomeBannerModel.countDocuments();
    if (bannerCount >= 5) {
      return NextResponse.json(
        { error: "Cannot add more than 5 home banners." },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > 1 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 1 MB limit" },
        { status: 400 }
      );
    }

    if (file) {
      try {
        uploaded = await saveImageToLocal("homebanner", file);
      } catch (uploadError) {
        return NextResponse.json(
          { error: "Image upload failed" },
          { status: 500 }
        );
      }
    }

    await HomeBannerModel.create({
      image: {
        url: uploaded.url,
        public_id: uploaded.filename,
      },
      title,
      designation,
      auther_url
    });

    return NextResponse.json({ message: 'Data Added successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    if (uploaded?.filename) {
      deleteFileIfExists("homebanner", uploaded.filename);
    }
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}


export async function GET(req, res) {
    try {
        await ConnectDB(); // Ensure DB connection
        const homeBanner = await HomeBannerModel.find({}).sort({ createdAt: -1 });; // Fetch all blogs
        return NextResponse.json(homeBanner, { status: 200 });
    } catch (error) {
        console.error('Error fetching homeBanner:', error);
        return NextResponse.json({ error: 'Failed to fetch homeBanner' }, { status: 500 });
    }
}