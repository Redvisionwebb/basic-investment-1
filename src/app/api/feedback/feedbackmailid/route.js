
// app/api/proxy-feedbackmail/route.js
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Call the original feedbackmailid API
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_DATA_API}/api/feedback/feedbackmailid`
    );

    // Return the API response
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error calling feedbackmailid:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch feedback mail" },
      { status: 500 }
    );
  }
}
