import axios from "axios";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      startDate,
      endDate,
      fundPcode,
      valuationAsOnDate,
      amount,
    } = body;

    // Optional: Basic validation
    if (!startDate || !endDate || !fundPcode || !valuationAsOnDate || !amount) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
      });
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/research-calculator/sip-performance`;

    const response = await axios.post(apiUrl, {
      startDate,
      endDate,
      fundPcode,
      valuationAsOnDate,
      amount,
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("SIP Performance Proxy Error:", error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch SIP performance" }), {
      status: 500,
    });
  }
}
