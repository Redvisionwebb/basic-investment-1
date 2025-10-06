import { NextResponse } from "next/server";

export async function GET(request) {
    const userAgent = (request.headers.get("user-agent") || "").toLowerCase();

    if (userAgent.includes("iphone") || userAgent.includes("ipad") || userAgent.includes("ipod")) {
        return NextResponse.redirect("https://apps.apple.com/your-ios-app-link", 302);
    } else if (userAgent.includes("android")) {
        return NextResponse.redirect("https://play.google.com/store/apps/details?id=your.android.app", 302);
    } else {
        // Fallback (desktop or unknown device)
        return NextResponse.redirect("/", 302);
    }
}