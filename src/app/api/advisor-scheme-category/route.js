import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const { arnId } = await request.json();

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_DATA_API}/api/advisor-scheme-category?apikey=${process.env.NEXT_PUBLIC_API_KEY}`,
      { arnId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error fetching advisor scheme category:", error.message);

    return NextResponse.json(
      { error: "Failed to fetch advisor scheme category" },
      { status: 500 }
    );
  }
}
