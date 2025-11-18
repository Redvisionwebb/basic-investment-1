import { NextResponse } from "next/server";
import axios from "axios";

function formatToDDMMYYYY(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // month is 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export async function POST(request) {
  try {
    const jsonBody = await request.json();

    if (jsonBody.dob) {
      jsonBody.dob = formatToDDMMYYYY(jsonBody.dob);
    }

    const urlEncoded = new URLSearchParams();
    for (const key in jsonBody) {
      urlEncoded.append(key, jsonBody[key]);
    }
    const realApiUrl = "https://wealthelite.in/api/robo-advisory/verify-o-t-p";

    const axiosResponse = await axios.post(realApiUrl, urlEncoded, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return NextResponse.json(axiosResponse.data, {
      status: axiosResponse.status,
    });

  } catch (error) {
    console.error("Proxy error:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data || "Request failed",
      },
      { status: error.response?.status || 500 }
    );
  }
}
