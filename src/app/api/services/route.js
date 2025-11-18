import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_DATA_API}/api/services`);
        return NextResponse.json(response.data, { status: 201 });
    } catch (error) {
        console.error("Error fetching services data:", error.message);

        return NextResponse.json({ error: "Failed to fetch services data" }, { status: 500 });
    }
}