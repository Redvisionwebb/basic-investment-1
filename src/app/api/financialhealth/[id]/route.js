
import FinancialHealthQuestionModel from "@/lib/models/FinancialHealthQuestionModel";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {

  try {
    const { question, answers } = await req.json();

    if (!question ) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const updated = await FinancialHealthQuestionModel.findByIdAndUpdate(
      params.id,
      { question },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
  }
}