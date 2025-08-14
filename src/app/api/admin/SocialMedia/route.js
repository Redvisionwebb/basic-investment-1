import { ConnectDB } from "@/lib/db/ConnectDB";
import SocialMediaModel from "@/lib/models/SocialMedia";
import { NextResponse } from "next/server";

// DB Connect
await ConnectDB();

// ✅ POST (Create or Update)
export async function POST(req) {
  try {
    const body = await req.json();
    const { id, title, url } = body;
    // console.log(id,title,url)

    if (id) {
      // Update if ID exists
      await SocialMediaModel.findByIdAndUpdate(id, { title, url });
      return NextResponse.json({ success: true, message: 'Updated successfully' }, { status: 200 });
    }else {
      // Create if no ID
      await SocialMediaModel.create({ title, url });
      return NextResponse.json({ success: true, message: 'Created successfully' }, { status: 201 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ✅ PATCH (Toggle show/hide)
export async function PATCH(req) {
  try {
    const { id, isHidden } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    await SocialMediaModel.findByIdAndUpdate(id, { isHidden });
    return NextResponse.json({ success: true, message: 'Visibility updated' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ✅ DELETE
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    await SocialMediaModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ✅ GET (Fetch all)
export async function GET() {
  try {
    const data = await SocialMediaModel.find().sort({ createdAt: -1 });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
