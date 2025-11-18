import { ConnectDB } from "@/lib/db/ConnectDB";
import AnalyticsModel from "@/lib/models/AnalyticsModel";
import { NextResponse } from "next/server";

// 🧩 CONNECT DB FIRST
await ConnectDB();

/* ===============================
   📍 GET — Fetch Analytics Data
================================ */
export async function GET() {
  try {
    await ConnectDB();

    const analytics = await AnalyticsModel.findOne().lean();
    if (!analytics) {
      return NextResponse.json({ message: "No analytics data found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, analytics });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/* ===============================
   📍 POST — Create Analytics Record
================================ */
export async function POST(req) {
  try {
    await ConnectDB();

    const body = await req.json();
    const { googleAnalyticsId, microsoftClarityId } = body;

    // Prevent duplicates — keep only one record
    const existing = await AnalyticsModel.findOne();
    if (existing) {
      return NextResponse.json(
        { message: "Analytics settings already exist. Use PUT to update." },
        { status: 400 }
      );
    }

    const newAnalytics = new AnalyticsModel({ googleAnalyticsId, microsoftClarityId });
    await newAnalytics.save();

    return NextResponse.json({
      success: true,
      message: "Analytics settings created successfully.",
      analytics: newAnalytics,
    });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/* ===============================
   📍 PUT — Update Analytics Settings
================================ */
export async function PUT(req) {
    await ConnectDB();

  try {
    const body = await req.json();
    const { googleAnalyticsId, microsoftClarityId } = body;

    const analytics = await AnalyticsModel.findOne();
    if (!analytics) {
      return NextResponse.json({ message: "No analytics record found." }, { status: 404 });
    }

    analytics.googleAnalyticsId = googleAnalyticsId || analytics.googleAnalyticsId;
    analytics.microsoftClarityId = microsoftClarityId || analytics.microsoftClarityId;

    await analytics.save();

    return NextResponse.json({
      success: true,
      message: "Analytics settings updated successfully.",
      analytics,
    });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/* ===============================
   📍 DELETE — Remove Analytics Settings
================================ */
export async function DELETE() {
    await ConnectDB();

  try {
    const analytics = await AnalyticsModel.findOne();
    if (!analytics) {
      return NextResponse.json({ message: "No analytics record to delete." }, { status: 404 });
    }

    await AnalyticsModel.deleteOne({ _id: analytics._id });

    return NextResponse.json({
      success: true,
      message: "Analytics settings deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
