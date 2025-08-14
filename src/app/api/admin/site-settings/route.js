import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/db/ConnectDB';
import SiteSettingsModel from '@/lib/models/SiteSetting';
import { deleteFileIfExists, saveImageToLocal } from '@/lib/functions';

export async function POST(req) {
  
    await ConnectDB();
    try {
        const {
            id, name,websiteName,email,alternateEmail,alternateMobile,mobile,whatsAppNo,address,iframe,mapurl,websiteDomain,image,callbackurl,siteurl,appsplaystoreurl,appsappleurl,description
        } = await req.json();

        // console.log(whatsAppNo)
        let updatedImage = image;
        
        // console.log(title, email, arn, address, mapurl, euin, mobile, mobile2, logo, description, twitter, facebook, instagram, linkedin, youtube)
        const data = await SiteSettingsModel.find({});

           if (image && image.size > 0) {
                    // If there's a new image, handle the old image deletion
                    const publicId = data.image?.public_id;
                     if (publicId) {
                            const deleted = deleteFileIfExists("admin", publicId);
                            if (!deleted) {
                              console.warn("Image file not found or already deleted:", publicId);
                            }
                          }
                    // Generate a unique filename
                    const uploadData = await saveImageToLocal('admin', file);
        
                    // Update the testimonial with the new image data
                    updatedImage = {
                        url: uploadData.secure_url,
                        public_id: uploadData.public_id,
                    };
                }
        if (data.length !== 0) {
            
            await SiteSettingsModel.findByIdAndUpdate(
                { _id: id },
                {
                    name,
                    websiteName,
                    email,
                    alternateEmail,
                    mobile,
                    whatsAppNo,
                    address,
                    iframe,
                    mapurl,
                    websiteDomain,
                    image: updatedImage,
                    alternateMobile,
                    callbackurl,
                    siteurl,
                    appsappleurl,
                    appsplaystoreurl,
                    description
                }
            );
        } else {
            await SiteSettingsModel.create( {
                name,
                websiteName,
                email,
                alternateEmail,
                whatsAppNo,
                mobile,
                address,
                iframe,
                mapurl,
                websiteDomain,
                image: updatedImage,
                alternateMobile,
                callbackurl,
                siteurl,
                appsappleurl,
                appsplaystoreurl,
                description
            });
        }
        return NextResponse.json({ message: 'Data uploaded successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await ConnectDB(); // Ensure DB connection
        const data = await SiteSettingsModel.find({}); // Fetch all blogs
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}