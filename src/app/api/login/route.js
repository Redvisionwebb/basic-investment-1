import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const formData = await req.json();
        formData.callbackUrl = `${process.env.NEXTAUTH_URL}/login`; // Add callbackUrl
        console.log(formData);  
        
        const res = await axios.post("https://superadmin-roan.vercel.app/api/login/arn-login", formData, {
            headers: {
                "Content-Type": "application/json",  // Set the content type to JSON
            }
        });
        
        return NextResponse.json(res.data, { status: 201 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
