import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/db/ConnectDB';
import CategoryModel from '@/lib/models/CategoryModel';

export async function POST(req) {
    await ConnectDB();
    try {
        const { categorytitle } = await req.json()
        await CategoryModel.create({
            title: categorytitle
        })
        return NextResponse.json({ message: 'Data uploaded successfully' }, { status: 201 });
    }
    catch (error) {
        // console.log(error)
        return NextResponse.json({ error: error }, { status: 500 });
    }

}

export async function GET(req, res) {
    try {
        await ConnectDB(); // Ensure DB connection
        const category = await CategoryModel.find({}); // Fetch all blogs
        return NextResponse.json(category, { status: 200 });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}