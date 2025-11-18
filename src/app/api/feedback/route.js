// app/api/feedback/route.js
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Extract all required query parameters
    const designSatisfaction = searchParams.get("designSatisfaction");
    const onTimeDelivery = searchParams.get("onTimeDelivery");
    const coordinationSatisfaction = searchParams.get("coordinationSatisfaction");
    const additionalFeedback = searchParams.get("additionalFeedback");
    const emojiRating = searchParams.get("emojiRating");
    const email = searchParams.get("email");
    const title = searchParams.get("title");

    // Validate required parameters
    if (!email || !title) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Call external feedback API
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_DATA_API}/api/feedback`,
      {
        params: {
          designSatisfaction,
          onTimeDelivery,
          coordinationSatisfaction,
          additionalFeedback,
          emojiRating,
          email,
          title,
        },
      }
    );

    // Return the response
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error sending feedback:", error.message);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
