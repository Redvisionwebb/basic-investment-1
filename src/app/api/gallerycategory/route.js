import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/db/ConnectDB';
import GalleryCategoryModel from '@/lib/models/GalleryCategoryModel';


export async function POST(req) {
  try {
    await ConnectDB();

    const { categorytitle } = await req.json();
    if (!categorytitle || categorytitle.trim() === "") {
      return NextResponse.json(
        { error: "Category title is required" },
        { status: 400 }
      );
    }

    // ✅ Check if already 10 categories exist
    const count = await GalleryCategoryModel.countDocuments();
    if (count >= 10) {
      return NextResponse.json(
        { error: "You can only create up to 10 categories." },
        { status: 400 }
      );
    }

    // ✅ Check if title already exists
    const existing = await GalleryCategoryModel.findOne({ title: categorytitle });
    if (existing) {
      return NextResponse.json(
        { error: "A category with this title already exists." },
        { status: 400 }
      );
    }

    const newCategory = new GalleryCategoryModel({ title: categorytitle });
    await newCategory.save();

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error adding gallery category:", error);
    return NextResponse.json(
      { error: "Failed to add gallery category" },
      { status: 500 }
    );
  }
}

export async function GET(req, res) {
    try {
        await ConnectDB(); // Ensure DB connection
        const category = await GalleryCategoryModel.find({}); // Fetch all blogs
        return NextResponse.json(category, { status: 200 });
    } catch (error) {
        console.error('Error fetching Category:', error);
        return NextResponse.json({ error: 'Failed to fetch Category' }, { status: 500 });
    }
}