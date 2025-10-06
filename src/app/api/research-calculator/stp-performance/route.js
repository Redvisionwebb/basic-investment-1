import axios from "axios";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      startDate,
      endDate,
      fromFundPcode,
      toFundPcode,
      lumpsumInvestedDate,
      initialAmount,
      transferAmount,
    } = body;

    // Basic validation
    if (
      !startDate ||
      !endDate ||
      !fromFundPcode ||
      !toFundPcode ||
      !lumpsumInvestedDate ||
      !initialAmount ||
      !transferAmount
    ) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
      });
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/research-calculator/stp-performance`;

    const response = await axios.post(apiUrl, {
      startDate,
      endDate,
      fromFundPcode,
      toFundPcode,
      lumpsumInvestedDate,
      initialAmount,
      transferAmount,
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("STP Performance Proxy Error:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to fetch STP performance" }),
      { status: 500 }
    );
  }
}
