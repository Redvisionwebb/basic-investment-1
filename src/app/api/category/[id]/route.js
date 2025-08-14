import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/db/ConnectDB';
import CategoryModel from '@/lib/models/CategoryModel';

export async function DELETE(req, { params }) {
    const { id } = params
    try {
        await ConnectDB(); // Ensure DB connection
        const category = await CategoryModel.findByIdAndDelete(id);

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Category deleted successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error deleting blog:', error);
        return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
    }
}

// GET Blog by ID
export async function GET(req, { params }) {
    const { id } = params; // Extract ID from params

    try {
        await ConnectDB(); // Ensure DB connection
        const blog = await BlogsModel.findById(id); // Properly await the findById function

        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json({ blog }, { status: 200 });
    } catch (error) {
        console.error('Error fetching blog:', error);
        return NextResponse.json({ error: 'Error while fetching blog' }, { status: 500 });
    }
}

// PUT Blog by ID
export async function PUT(req, { params }) {
    const { id } = params;
    const { categorytitle } = await req.json();

    try {
        await ConnectDB();
        const updatedBlog = await CategoryModel.findByIdAndUpdate(
            id,
            { title: categorytitle },
        );

        if (!updatedBlog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json({ blog: updatedBlog }, { status: 201 });
    } catch (error) {
        console.error('Error updating blog:', error);
        return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
    }
}