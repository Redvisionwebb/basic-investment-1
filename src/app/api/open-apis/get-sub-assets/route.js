// app/api/get-sub-assets/route.js

import axios from "axios";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const subAssetClass = searchParams.get("subAssetClass");

    if (!subAssetClass) {
      return new Response(JSON.stringify({ error: "Missing subAssetClass" }), {
        status: 400,
      });
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/get-sub-assets?subAssetClass=${encodeURIComponent(
      subAssetClass
    )}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`;

    const response = await axios.get(apiUrl);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("Error fetching sub-assets:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to fetch sub-assets" }),
      { status: 500 }
    );
  }
}
