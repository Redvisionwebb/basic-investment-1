import { ConnectDB } from "@/lib/db/ConnectDB";
import ArnModel from "@/lib/models/ArnModel";
import { NextResponse } from "next/server";


// GET: Fetch all ARN data
export async function GET() {
  try {
    await ConnectDB();
    const data = await ArnModel.find({});
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Create a new ARN
export async function POST(req) {
  try {
    await ConnectDB();
    const { arn, euins } = await req.json();

    const newArn = await ArnModel.create({ arn, euins });

    return NextResponse.json({
      success: true,
      message: 'ARN created successfully',
      data: newArn,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    }, { status: 500 });
  }
}


export async function DELETE(req) {
    try {
      await ConnectDB();
      const { id } = await req.json();
  
      if (!id) {
        return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
      }
  
      const deletedArn = await ArnModel.findByIdAndDelete(id);
  
      if (!deletedArn) {
        return NextResponse.json({ success: false, message: 'ARN not found' }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, message: 'ARN deleted successfully' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }