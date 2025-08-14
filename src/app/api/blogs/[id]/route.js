import { NextResponse } from "next/server";
import BlogsModel from "@/lib/models/BlogModel";
import { ConnectDB } from "@/lib/db/ConnectDB";
import { deleteFileIfExists, saveImageToLocal, slugify } from "@/lib/functions";
import axios from "axios";

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await ConnectDB();

    // Find the blog by ID
    const blog = await BlogsModel.findById(id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const publicId = blog.image.public_id;
    if (publicId) {
      const deleted = deleteFileIfExists("blogs", publicId);
      if (!deleted) {
        console.warn("Image file not found or already deleted:", publicId);
      }
    }
    await BlogsModel.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}

// GET Blog by ID
export async function GET(req, { params }) {
  const { id } = params; // Extract ID from params

  try {
    await ConnectDB(); // Ensure DB connection
    const blog = await BlogsModel.findById(id); // Properly await the findById function

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ blog }, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Error while fetching blog" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const { id } = params; // Extract blog ID from params
  const data = await req.formData(); // Retrieve FormData from request
  try {
    await ConnectDB(); // Ensure DB connection

    const file = data.get("image");

    // Find the blog by ID
    const blog = await BlogsModel.findById(id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Check if there's a new image to upload/update
    let newImageUrl = blog.image.url; // Keep the current image URL by default
    let newPublicId = blog.image.public_id; // Keep the current Cloudinary public_id by default
    const image = data.get("image"); // Get the new image from form data
    // Handle image only if it's provided and not 'null'
    if (image && image.size > 0) {
      // If there's a new image, handle the old image deletion
      const publicId = newPublicId;
      if (publicId) {
        const deleted = deleteFileIfExists("blogs", publicId);
        if (!deleted) {
          console.warn("Image file not found or already deleted:", publicId);
        }
      }
     const uploadData = await saveImageToLocal('blogs', file);
      newImageUrl = uploadData.url;
      newPublicId = uploadData.filename;
    }

    // Update the blog with the new data
    const updatedBlog = await BlogsModel.findByIdAndUpdate(
      id,
      {
        image: {
          url: newImageUrl,
          public_id: newPublicId,
        },
        posttitle: data.get("posttitle"), // Access form fields correctly
        slug: slugify(data.get("posttitle")),
        metatitle: data.get("metatitle"),
        description: data.get("description"),
        content: data.get("content"),
        keywords: data.get("keywords"),
        category: data.get("category"),
      },
      { new: true } // Return the updated document
    );

    return NextResponse.json({ blog: updatedBlog }, { status: 200 });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}
