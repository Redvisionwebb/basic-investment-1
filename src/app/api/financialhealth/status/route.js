// app/api/risk-questions/status/route.ts

import FinancialHealthQuestionModel from "@/lib/models/FinancialHealthQuestionModel";
import { NextResponse } from "next/server";


export async function PUT(req) {
  const { status } = await req.json();
  await FinancialHealthQuestionModel.updateMany({}, { status });
  return NextResponse.json({ success: true });
}
