import axios from 'axios';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { ConnectDB } from '@/lib/db/ConnectDB';
import TestimonialModel from '@/lib/models/TestimonialModel';
import { saveImageToLocal } from '@/lib/functions';

await ConnectDB();

export async function POST(req) {
  
  let uploaded = null;
  try {
    const formData = await req.formData();
    const file = formData.get('image');
    const author = formData.get('author');
    const designation = formData.get('designation');
    const content = formData.get('content');

    if (!file || !author || !designation || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    uploaded = await saveImageToLocal("testimonials", file);

    // await fs.unlink(tempFilePath);

    await TestimonialModel.create({
      image: {
        url: uploaded.url,
        public_id: uploaded.filename,
      },
      author,
      designation,
      content,
    });

    return NextResponse.json({ message: 'Testimonial added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Upload Error:', error);
    if (uploaded?.filename) {
      deleteFileIfExists("testimonials", uploaded.filename);
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



export async function GET(req, res) {
    try {
        const testimonial = await TestimonialModel.find({}); // Fetch all blogs
        return NextResponse.json(testimonial, { status: 200 });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}