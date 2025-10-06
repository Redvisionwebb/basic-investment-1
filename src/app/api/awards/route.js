import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/db/ConnectDB';

import { saveImageToLocal, deleteFileIfExists } from '@/lib/functions';
import AwardModel from '@/lib/models/AwardsModel';

await ConnectDB();

export async function POST(req) {
  let uploaded = null;

  try {
    const formData = await req.formData();
    const file = formData.get('image');
    const name = formData.get('name');
    const presentedBy = formData.get('presentedBy');
    const date = formData.get('date');

    if (!file || !name || !presentedBy || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    uploaded = await saveImageToLocal('awards', file);

    await AwardModel.create({
      name,
      presentedBy,
      date,
      image: {
        url: uploaded.url,
        public_id: uploaded.filename,
      },
    });

    return NextResponse.json({ message: 'Award added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Upload Error:', error);
    if (uploaded?.filename) {
      deleteFileIfExists('awards', uploaded.filename);
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const awards = await AwardModel.find({}).sort({ date: -1 }); // Most recent first
    return NextResponse.json(awards, { status: 200 });
  } catch (error) {
    console.error('Error fetching awards:', error);
    return NextResponse.json({ error: 'Failed to fetch awards' }, { status: 500 });
  }
}
