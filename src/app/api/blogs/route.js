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
  let uploaded = null;
  try {
    // Check current blog count
    const totalBlogs = await BlogsModel.countDocuments();
    if (totalBlogs >= 50) {
      return NextResponse.json(
        { error: "Cannot add more than 50 blogs" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("image");
    const posttitle = formData.get("posttitle");
    const metatitle = formData.get("metatitle");
    const description = formData.get("description");
    const content = formData.get("content");
    const category = formData.get("category");
    const keywords = formData.get("keywords");

    if (file && file.size > 1 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 1 MB limit" },
        { status: 400 }
      );
    }

    if (file) {
      try {
        uploaded = await saveImageToLocal("blogs", file);
      } catch (uploadError) {
        return NextResponse.json(
          { error: "Image upload failed" },
          { status: 500 }
        );
      }
    }

    await BlogsModel.create({
      image: uploaded
        ? { url: uploaded.url, public_id: uploaded.filename }
        : null,
      slug: slugify(posttitle),
      posttitle,
      metatitle,
      description,
      content,
      keywords,
      category,
    });

    return NextResponse.json({ message: "Data uploaded successfully" }, { status: 201 });
  } catch (error) {
    if (uploaded?.filename) deleteFileIfExists("blogs", uploaded.filename);
    return NextResponse.json({ error }, { status: 500 });
  }
}


export async function GET(req, res) {
  try {
    await ConnectDB(); // Ensure DB connection
    const blogs = await BlogsModel.find({}).sort({ createdAt: -1 }); // Fetch all blogs
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
