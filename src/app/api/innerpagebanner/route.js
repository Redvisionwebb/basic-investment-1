import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";

import InnerBannerPageModel from "@/lib/models/InnerPageBanner";
import axios from "axios";
import { saveImageToLocal } from "@/lib/functions";
// // Connect to the database
const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

export async function POST(req) {
   let uploaded = null;
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const title = formData.get("title");
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    uploaded = await saveImageToLocal("innerpagebanner", file);

    await InnerBannerPageModel.create({
      image: {
        url: uploaded.url,
        public_id: uploaded.filename,
      },
      title,
    });
    return NextResponse.json(
      { message: "Data Added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
     if (uploaded?.filename) {
      deleteFileIfExists("innerpagebanner", uploaded.filename);
    }

    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(req, res) {
  try {
    await ConnectDB(); // Ensure DB connection
    const innerpagebanner = await InnerBannerPageModel.find({}); // Fetch all blogs
    return NextResponse.json(innerpagebanner, { status: 200 });
  } catch (error) {
    console.error("Error fetching inner page banner:", error);
    return NextResponse.json(
      { error: "Failed to fetch inner page banner" },
      { status: 500 }
    );
  }
}
