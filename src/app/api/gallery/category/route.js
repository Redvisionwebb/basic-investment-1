import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/db/ConnectDB';
import GalleryModel from '@/lib/models/Gallery';


export async function GET() {
  try {
    await ConnectDB();
    const galleries = await GalleryModel.find().populate('category').sort({ createdAt: -1 });;
    return NextResponse.json({ galleries }, { status: 200 });
  } catch (error) {
    console.error('Error fetching all galleries:', error);
    return NextResponse.json({ error: 'Failed to fetch galleries' }, { status: 500 });
  }
}
