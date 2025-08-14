import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const formData = await req.json();
        const res = await axios.post("https://superadmin-roan.vercel.app/api/login/submit-forget-password", formData,
            {
                headers: {
                    "Content-Type": "application/json",  // Set the content type to multipart/form-data
                }
            }
        );
        // console.log(res?.data)
        return NextResponse.json(res.data, { status: 201 });
    }
    catch (error) {
        // console.log(error)
        return NextResponse.json({ error: error }, { status: 500 });
    }

}