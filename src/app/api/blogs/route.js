import { NextResponse } from "next/server";
import BlogsModel from "@/lib/models/BlogModel";
import { ConnectDB } from "@/lib/db/ConnectDB";
import { saveImageToLocal, slugify } from "@/lib/functions";
import axios from "axios";

// // Connect to the database
const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

export async function POST(req) {
  let uploaded=null;
  try {
    const formData = await req.formData();
    const file = formData.get("image"); // Adjust according to your input name
    const posttitle = formData.get("posttitle");
    const metatitle = formData.get("metatitle");
    const description = formData.get("description");
    const content = formData.get("content");
    const category = formData.get("category");
    const keywords = formData.get("keywords");
     uploaded = await saveImageToLocal("blogs", file);

    await BlogsModel.create({
      image: {
        url: uploaded.url,
        public_id: uploaded.filename,
      },
      slug: slugify(posttitle),
      posttitle,
      metatitle,
      description,
      content,
      keywords,
      category,
    });
    return NextResponse.json(
      { message: "Data uploaded successfully" },
      { status: 201 }
    );
  } catch (error) {
    // console.log(error)
     if (uploaded?.filename) {
      deleteFileIfExists("blogs", uploaded.filename);
    }

    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(req, res) {
  try {
    await ConnectDB(); // Ensure DB connection
    const blogs = await BlogsModel.find({}); // Fetch all blogs
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
