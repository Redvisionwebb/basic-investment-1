import { ConnectDB } from "@/lib/db/ConnectDB";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
    await ConnectDB();
    try {
        const formdata = await req.json();
        const res = await axios.post(`${process.env.NEXT_PUBLIC_DATA_API}/api/compare-funds/?apikey=${process.env.NEXT_PUBLIC_API_KEY}`, formdata);
        return NextResponse.json(res.data, { status: 201 });
    }
    catch (error) {
        // console.log(error)
        return NextResponse.json({ error: error }, { status: 500 });
    }
}