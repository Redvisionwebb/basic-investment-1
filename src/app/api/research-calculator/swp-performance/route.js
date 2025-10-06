import axios from "axios";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      startDate,
      endDate,
      fundPcode,
      investmentDate,
      initialAmount,
      withdrawalAmount,
    } = body;

    // Simple validation
    if (
      !startDate ||
      !endDate ||
      !fundPcode ||
      !investmentDate ||
      !initialAmount ||
      !withdrawalAmount
    ) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
      });
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/research-calculator/swp-performance`;

    const response = await axios.post(apiUrl, {
      startDate,
      endDate,
      fundPcode,
      investmentDate,
      initialAmount,
      withdrawalAmount,
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("SWP Performance API Error:", error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch SWP performance" }), {
      status: 500,
    });
  }
}
