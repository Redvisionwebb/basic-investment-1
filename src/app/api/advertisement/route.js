import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ConnectDB } from "@/lib/db/ConnectDB";
import AdvertisementModel from "@/lib/models/AdvertisementModel";
import axios from "axios";
import { saveImageToLocal } from "@/lib/functions";

// // Connect to the database
const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

export async function POST(req) {
  let uploaded=null;
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const link = formData.get("link");
    uploaded = await saveImageToLocal("advertisement", file);

    await AdvertisementModel.create({
      image: {
        url: uploaded.url,
        public_id: uploaded.filename,
      },
      link,
    });
    return NextResponse.json(
      { message: "Data Added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
     if (uploaded?.filename) {
      deleteFileIfExists("advertisement", uploaded.filename);
    }

    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(req, res) {
  try {
    await ConnectDB(); // Ensure DB connection
    const advertisement = await AdvertisementModel.find({}); // Fetch all blogs
    return NextResponse.json(advertisement, { status: 200 });
  } catch (error) {
    console.error("Error fetching advertisement:", error);
    return NextResponse.json(
      { error: "Failed to fetch advertisement" },
      { status: 500 }
    );
  }
}
