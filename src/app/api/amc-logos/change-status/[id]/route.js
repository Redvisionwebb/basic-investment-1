import { NextResponse } from 'next/server';
import AmcsLogoModel from '@/lib/models/AmcsLogos';
import { ConnectDB } from '@/lib/db/ConnectDB';


// PUT Blog by ID
export async function PUT(req, { params }) {
  const { id } = params;
  const { addisstatus, adminlogourl } = await req.json();

  try {
    await ConnectDB();

    const amc = await AmcsLogoModel.findByIdAndUpdate(
      id,
      { addisstatus, adminlogourl }, // update both if sent
      { new: true } // return updated doc
    );

    if (!amc) {
      return NextResponse.json({ error: "AMC not found" }, { status: 404 });
    }

    return NextResponse.json(amc, { status: 200 });
  } catch (error) {
    console.error("Error updating AMC:", error);
    return NextResponse.json({ error: "Failed to update AMC" }, { status: 500 });
  }
}