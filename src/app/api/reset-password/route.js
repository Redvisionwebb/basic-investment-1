import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";
import AdminModel from "@/lib/models/AdminModel";

export async function POST(req) {
  const { token, id, newPassword } = await req.json();
  await ConnectDB();

  const admin = await AdminModel.findOne({
    _id: id,
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!admin) {
    return NextResponse.json({ ok: false, error: "Invalid or expired token" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  admin.password = hashed;
  admin.resetPasswordToken = undefined;
  admin.resetPasswordExpires = undefined;
  await admin.save();

  return NextResponse.json({ ok: true });
}
