import { NextResponse } from 'next/server';
import BlogsModel from '@/lib/models/BlogModel';
import { ConnectDB } from '@/lib/db/ConnectDB';

export async function GET(req, res) {
    try {
        await ConnectDB(); // Ensure DB connection
        const blogs = await BlogsModel.find({}).select('-content'); // Fetch all blogs
        return NextResponse.json(blogs, { status: 200 });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}