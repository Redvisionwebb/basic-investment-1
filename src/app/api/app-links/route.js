import { getSiteData } from "@/lib/functions";
import { NextResponse } from "next/server";
 
export async function GET(req) {
    const siteData = await getSiteData();
    const userAgent = (req.headers.get("user-agent") || "").toLowerCase();
    if (userAgent.includes("iphone") || userAgent.includes("ipad") || userAgent.includes("ipod")) {
        return NextResponse.redirect(siteData?.appsappleurl);
    } else if (userAgent.includes("android")) {
        return NextResponse.redirect(siteData?.appsplaystoreurl);
    } else {
        const url = new URL("/", req.url);
        return NextResponse.redirect(url.toString());
    }
}