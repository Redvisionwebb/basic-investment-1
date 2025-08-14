import { ConnectDB } from "@/lib/db/ConnectDB"
import LeadsModel from "@/lib/models/LeadsModel"
import RiskQuestionModel from "@/lib/models/RiskQuestionModel";
import RiskUsersModel from "@/lib/models/RiskUsersModel";
import { NextResponse } from "next/server";

const LoadDB = async () => {
    await ConnectDB();
}

LoadDB()

export async function POST(request) {
    const data = await request.json();
    try {
        // Basic validation
        await RiskUsersModel.create({
            username: data.user.username,
            mobile: data.user.mobile,
            email: data.user.email,
            message: data.user.message,
            score: data.score,
            riskprofile: data.riskprofile,
            result: data.answers.map((item) => ({
                question: item.question,
                answer: item.selectedAnswerText,
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
    const questions = await RiskQuestionModel.find({});
    return NextResponse.json(questions, { status: 200 })
}