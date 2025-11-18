import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";

import TeamModel from "@/lib/models/TeamModel";
import axios from "axios";
import { saveImageToLocal } from "@/lib/functions";


// POST: Create Team Member
export async function POST(req) {
   let uploaded = null;
  try {
    await ConnectDB();
    const formData = await req.formData();

    const name = formData.get("name");
    const designation = formData.get("designation");
    const experience = parseInt(formData.get("experience"), 10);
    const description = formData.get("description");
    const imageFile = formData.get("image");
    const file = formData.get("image");
    const socialMediaRaw = formData.get("socialMedia");

    let socialMedia = [];
    if (socialMediaRaw) {
      try {
        socialMedia = JSON.parse(socialMediaRaw);
      } catch (err) {
        return NextResponse.json({ error: "Invalid socialMedia JSON" }, { status: 400 });
      }
    }

 
        if (file && file.size > 1 * 1024 * 1024) {
                     return NextResponse.json(
                       { error: "File size exceeds 1 MB limit" },
                       { status: 400 }
                     );
                   }
                    if (file) {
                     try {
                            uploaded = await saveImageToLocal("teams", file);
                     } catch (uploadError) {
                       return NextResponse.json(
                         { error: "Image upload failed" },
                         { status: 500 }
                       );
                     }
                   }

    const newMember = await TeamModel.create({
      name,
      designation,
      experience,
      description,
      image: {
        url: uploaded.url,
        public_id: uploaded.filename,
      },
      socialMedia
    });

    return NextResponse.json({ message: "Team member added successfully", data: newMember }, { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);
     if (uploaded?.filename) {
      deleteFileIfExists("teams", uploaded.filename);
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET: Get all team members
export async function GET() {
  try {
    await ConnectDB();
    const teams = await TeamModel.find({}).sort({ createdAt: -1 });;
    return NextResponse.json(teams, { status: 200 });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
  }
}
