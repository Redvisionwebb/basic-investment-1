import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const currentHouseCost = searchParams.get("currentHouseCost");
    const planHouseInYears = searchParams.get("planHouseInYears");
    const expectedReturn = searchParams.get("expectedReturn");
    const inflationRate = searchParams.get("inflationRate");

    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/house-calculator`;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    const url = `${apiUrl}?currentHouseCost=${encodeURIComponent(currentHouseCost)}&planHouseInYears=${encodeURIComponent(planHouseInYears)}&expectedReturn=${encodeURIComponent(expectedReturn)}&inflationRate=${encodeURIComponent(inflationRate)}&apikey=${apiKey}`;

    const response = await axios.get(url);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("House Calculator API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch house calculator data" }),
      { status: 500 }
    );
  }
}
