import { NextResponse } from 'next/server';
import BlogsModel from '@/lib/models/BlogModel';
import { ConnectDB } from '@/lib/db/ConnectDB';

// GET Blog by ID
export async function GET(req, { params }) {
    const { slug } = params; // Extract ID from params

    try {
        await ConnectDB(); // Ensure DB connection
        const blog = await BlogsModel.find({ slug: slug }); // Properly await the findById function

        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json(blog, { status: 200 });
    } catch (error) {
        console.error('Error fetching blog:', error);
        return NextResponse.json({ error: 'Error while fetching blog' }, { status: 500 });
    }
}