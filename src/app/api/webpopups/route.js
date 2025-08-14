import { NextResponse } from 'next/server';

import { ConnectDB } from '@/lib/db/ConnectDB';

import PopupsModel from '@/lib/models/PopupsModel';
import axios from 'axios';
import { deleteFileIfExists } from '@/lib/functions';

// // Connect to the database
const LoadDB = async () => {
    await ConnectDB();
};

LoadDB();


export async function POST(req) {
    let uploaded = null;
    try {
        const formData = await req.formData();
        // const id = formData.get('id');
        const file = formData.get('image');
        const title = formData.get('title');
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }


    uploaded = await saveImageToLocal("webpopups", file);
        await PopupsModel.create(
            {
               image: {
        url: uploaded.url,
        public_id: uploaded.filename,
      },
                title
            })
        return NextResponse.json({ message: 'Data Added successfully' }, { status: 201 });
    }
    catch (error) {
        console.log(error)
        if (uploaded?.filename) {
      deleteFileIfExists("webpopups", uploaded.filename);
    }
        return NextResponse.json({ error: error }, { status: 500 });
    }

}

export async function GET(req, res) {
    try {
        await ConnectDB(); // Ensure DB connection
        const testimonial = await PopupsModel.find({}); // Fetch all blogs
        return NextResponse.json(testimonial, { status: 200 });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}