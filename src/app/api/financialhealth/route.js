import { ConnectDB } from "@/lib/db/ConnectDB"
import FinancialHealthQuestionModel from "@/lib/models/FinancialHealthQuestionModel";
import FinancialHealthUsersModel from "@/lib/models/FinancialHealthUsersModel";
import axios from "axios";
import { NextResponse } from "next/server";

const LoadDB = async () => {
    await ConnectDB();
}

LoadDB()

export async function POST(request) {
    const data = await request.json();
    try {
        await FinancialHealthUsersModel.create({
            username: data.user.username,
            mobile: data.user.mobile,
            email: data.user.email,
            message: data.user.message,
            score: data.score,
            healthprofile: data.healthprofile,
            result: data.answers.map((item) => ({
                question: item.question,
                mark: item.selectedAnswerMarks
            }))
        })
        // await transporter.sendMail(mailOptions);
        return NextResponse.json({ msg: "Created" }, { status: 201 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ msg: "Error sending message." }, {
            status: 500
        })
    }
}

export async function GET(request) {
  try {
    const questions = await FinancialHealthQuestionModel.find({});

    const hasActiveStatus = questions.some((q) => q.status === true);

    if (hasActiveStatus) {
      return NextResponse.json(questions, { status: 200 });
    }

    // If none have status true, fetch from external API
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/risk-questions?apikey=${process.env.NEXT_PUBLIC_API_KEY}`
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching risk questions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();

  try {
    const { question} = await req.json();

    if (!question) {
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