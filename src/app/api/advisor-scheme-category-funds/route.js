import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const { arnId, category, schemeCategory } = await request.json();

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_DATA_API}/api/advisor-scheme-category-funds?apikey=${process.env.NEXT_PUBLIC_API_KEY}`,
      {
        arnId,
        category,
        schemeCategory,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error fetching scheme category funds:", error.message);

    return NextResponse.json(
      { error: "Failed to fetch advisor scheme category funds" },
      { status: 500 }
    );
  }
}
