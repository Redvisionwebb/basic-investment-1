import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";
import AdminModel from "@/lib/models/AdminModel";

export async function POST(req) {
  const { oldPassword } = await req.json();
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  await ConnectDB();

  const admin = await AdminModel.findById(session.user.id).lean();
  if (!admin) return NextResponse.json({ ok: false }, { status: 404 });

  const ok = await bcrypt.compare(oldPassword, admin.password);
  return NextResponse.json({ ok });
}
