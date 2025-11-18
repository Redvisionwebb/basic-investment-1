import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/db/ConnectDB';
import GalleryModel from '@/lib/models/Gallery';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    await ConnectDB();
    const galleries = await GalleryModel.find({ category: id }).populate('category').sort({ createdAt: -1 });;

    return NextResponse.json({ galleries }, { status: 200 });
  } catch (error) {
    console.error('Error fetching galleries by category:', error);
    return NextResponse.json({ error: 'Failed to fetch galleries by category' }, { status: 500 });
  }
}
