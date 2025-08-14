import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/db/ConnectDB';

import TeamModel from '@/lib/models/TeamModel';
import { deleteFileIfExists, saveImageToLocal } from '@/lib/functions';
import axios from 'axios';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    await ConnectDB();
    const teamMember = await TeamModel.findById(id);
    if (!teamMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json({ teamMember }, { status: 200 });
  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json({ error: 'Failed to fetch team member' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await ConnectDB();
    const teamMember = await TeamModel.findById(id);

    if (!teamMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    const publicId = teamMember.image?.public_id;
     if (publicId) {
         const deleted = deleteFileIfExists("teams", publicId);
         if (!deleted) {
           console.warn("Image file not found or already deleted:", publicId);
         }
       }
    await TeamModel.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Team member deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  try {
    await ConnectDB();

    const formData = await req.formData();
    const image = formData.get('image');
    const file = formData.get('image');
    const name = formData.get('name');
    const designation = formData.get('designation');
    const experience = formData.get('experience');
    const description = formData.get('description');
    const socialMedia = formData.get('socialMedia'); // JSON stringified array

    const teamMember = await TeamModel.findById(id);
    if (!teamMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    // Handle new image upload
    if (image && image.size > 0) {
      // If there's a new image, handle the old image deletion
      const publicId = teamMember.image?.public_id;
      if (publicId) {
        const deleted = deleteFileIfExists("teams", publicId);
        if (!deleted) {
          console.warn("Image file not found or already deleted:", publicId);
        }
      }
      const uploadData = await saveImageToLocal('teams', file);

      // Update the teamMember with the new image data
      teamMember.image = {
        url: uploadData.url,
        public_id: uploadData.filename,
      };
    }

    // Update other fields
    teamMember.name = name || teamMember.name;
    teamMember.designation = designation || teamMember.designation;
    teamMember.experience = experience || teamMember.experience;
    teamMember.description = description || teamMember.description;

    if (socialMedia) {
      teamMember.socialMedia = JSON.parse(socialMedia);
    }

    await teamMember.save();

    return NextResponse.json({ message: 'Team member updated successfully', teamMember }, { status: 200 });
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
  }
}
