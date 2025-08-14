import { ConnectDB } from "@/lib/db/ConnectDB";
import BotLeadsModel from "@/lib/models/Botlead";
import { NextResponse } from "next/server";

const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

export async function POST(request) {
  const { name, mobile, email, address, services } = await request.json();

  try {
    if (!name || !mobile || !email) {
      return NextResponse.json(
        { message: "Required fields missing." },
        { status: 400 }
      );
    }

    await BotLeadsModel.create({
      username: name,
      mobile,
      email,
      address,
      message: services?.join(", ") || "", // saving services as message
    });

    return NextResponse.json({ msg: "Created" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Error saving lead." }, { status: 500 });
  }
}

export async function GET(request) {
  const leads = await BotLeadsModel.find({});
  return NextResponse.json({ leads }, { status: 200 });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await BotLeadsModel.findByIdAndDelete(id);
  return NextResponse.json({ msg: "Lead deleted" }, { status: 200 });
}

export async function PUT(request) {
  const id = request.nextUrl.searchParams.get("id");
  await BotLeadsModel.findByIdAndUpdate(id, { $set: { isComplete: true } });
  return NextResponse.json({ msg: "Lead Updated" }, { status: 200 });
}
