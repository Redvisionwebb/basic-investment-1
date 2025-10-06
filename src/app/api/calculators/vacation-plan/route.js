import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const planHolidayInYears = searchParams.get("planHolidayInYears");
    const currentExpense = searchParams.get("currentExpense");
    const expectedReturn = searchParams.get("expectedReturn");
    const inflationRate = searchParams.get("inflationRate");

    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/vacation-plan`;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    const fullUrl = `${apiUrl}?planHolidayInYears=${encodeURIComponent(
      planHolidayInYears
    )}&currentExpense=${encodeURIComponent(
      currentExpense
    )}&expectedReturn=${encodeURIComponent(
      expectedReturn
    )}&inflationRate=${encodeURIComponent(inflationRate)}&apikey=${apiKey}`;

    const response = await axios.get(fullUrl);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Vacation Plan Calculator API Error:", error?.message);
    return new Response(
      JSON.stringify({ error: "Failed to fetch vacation plan data" }),
      { status: 500 }
    );
  }
}
