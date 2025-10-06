
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth";
import { ConnectDB } from "@/lib/db/ConnectDB";
import AdminModel from "@/lib/models/AdminModel";
import bcryptjs from "bcryptjs";

export async function POST(req) {
  try {
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { ok: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    // ✅ Pass req to getServerSession in App Router
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await ConnectDB();

    const admin = await AdminModel.findById(session.user.id);

    if (!admin) {
      return NextResponse.json(
        { ok: false, error: "Admin not found" },
        { status: 404 }
      );
    }

    const ok = await bcryptjs.compare(oldPassword, admin.password || "");

    if (!ok) {
      return NextResponse.json(
        { ok: false, error: "Old password incorrect" },
        { status: 400 }
      );
    }

    admin.password = await bcryptjs.hash(newPassword, 10);
    await admin.save();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("❌ change-password error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
