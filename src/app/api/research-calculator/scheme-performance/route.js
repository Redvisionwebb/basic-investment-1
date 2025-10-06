import axios from "axios";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      fundPcode,
      investedAmount,
      startDate,
      endDate,
      sensex,
      ppf,
      eventFlag,
    } = body;

    // Validate required fields
    if (!fundPcode || !investedAmount || !startDate || !endDate) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
      });
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/research-calculator/scheme-performance`;

    const response = await axios.post(apiUrl, {
      fundPcode,
      investedAmount,
      startDate,
      endDate,
      sensex,
      ppf,
      eventFlag,
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("Error in scheme-performance proxy:", error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch performance data" }), {
      status: 500,
    });
  }
}
