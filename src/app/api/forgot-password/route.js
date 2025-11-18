import crypto from "crypto";
import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";
import AdminModel from "@/lib/models/AdminModel";
import SiteSettingsModel from "@/lib/models/SiteSetting";
import nodemailer from "nodemailer";

export async function POST(req) {
  const { identifier } = await req.json(); // username or email
  await ConnectDB();
 
  let admin = null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(identifier)) {
    admin = await AdminModel.findOne({ email: identifier }).lean();
  } else {
    admin = await AdminModel.findOne({ username: identifier }).lean();
  }


  if (!admin) {
    return NextResponse.json({ ok: true, });
  }

  // Generate token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 1000 * 60 * 60; // 1 hour

  // Save token & expiry
  await AdminModel.updateOne(
    { _id: admin._id },
    {
      resetPasswordToken: token,
      resetPasswordExpires: new Date(expires),
    }
  );

  // find email in SiteSettings (one document)
  const site = await SiteSettingsModel.findOne().lean();
  
  const emailToSend = site?.email;
  if (!emailToSend) {
    return NextResponse.json({ ok: false, error: "No email configured" });
  }

  const resetUrl = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/reset-password?token=${token}&id=${admin._id}`;

  // ✉️ Nodemailer transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NEXT_PUBLIC_SMTP_MAIL,
      pass: process.env.NEXT_PUBLIC_SMTP_PASS,
    },
  });

  // Mail options
  // const mailOptions = {
  //   from: `"${site?.websiteName || "Admin"}" <${process.env.NEXT_PUBLIC_SMTP_MAIL}>`,
  //   to: emailToSend,
  //   subject: "Password Reset Request",
  //   html: `
  // <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f4f4f4; border-radius: 10px;">
  //   <div style="text-align: center; margin-bottom: 30px;">
  //     <h2 style="color: #2367f8;">${site?.websiteName || "Admin"} Password Reset</h2>
  //   </div>

  //   <p style="font-size: 16px; color: #333;">Hello <strong>${admin.username}</strong>,</p>
  //   <p style="font-size: 16px; color: #333;">
  //     We received a request to reset your password. Click the button below to reset it. This link is valid for 1 hour.
  //   </p>

  //   <div style="text-align: center; margin: 30px 0;">
  //     <!-- Reset Password Button -->
  //     <a href="${resetUrl}" 
  //        style="display: inline-block; text-decoration: none; background: #2367f8; color: white; padding: 12px 25px; border-radius: 8px; font-weight: bold; margin-bottom: 10px;">
  //        Reset Password
  //     </a>
  //     <br/>

  //     <!-- Copy Link Button -->
  //     <a href="#" 
  //        onclick="navigator.clipboard.writeText('${resetUrl}'); alert('Link copied!'); return false;"
  //        style="display: inline-block; text-decoration: none; background: #00cc99; color: white; padding: 12px 25px; border-radius: 8px; font-weight: bold;">
  //        Copy Link
  //     </a>
  //   </div>

  //   <p style="font-size: 14px; color: #555;">
  //     If you did not request a password reset, you can safely ignore this email.
  //   </p>

  //   <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

  //   <p style="text-align: center; font-size: 14px; color: #777;">
  //     – ${site?.websiteName || "Admin"} Team
  //   </p>
  // </div>
  // `,
  // };

  const mailOptions = {
    from: `"${site?.websiteName || "Admin"}" <${process.env.NEXT_PUBLIC_SMTP_MAIL}>`,
    to: emailToSend,
    subject: "Password Reset Request",
    html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 10px; border: 1px solid #eee;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #2367f8; margin: 0;">${site?.websiteName || "Admin"} Password Reset</h2>
    </div>

    <p style="font-size: 16px; color: #333;">Hello <strong>${admin.username}</strong>,</p>
    <p style="font-size: 16px; color: #333;">
      We received a request to reset your password. Click the button below to reset it. This link is valid for 1 hour.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <!-- Reset Password Button -->
      <a href="${resetUrl}" 
         style="display: inline-block; text-decoration: none; background: #2367f8; color: white; padding: 12px 25px; border-radius: 8px; font-weight: bold; margin-bottom: 15px;">
         Reset Password
      </a>
      <br/>

    </div>

    <p style="font-size: 14px; color: #555;">
      If the buttons don’t work, copy & paste this link in your browser:
    </p>
    <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 6px; font-size: 13px; color: #333;">
      ${resetUrl}
    </p>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

    <p style="text-align: center; font-size: 14px; color: #777;">
      – ${site?.websiteName || "Admin"} Team
    </p>
  </div>
  `,
  };



  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Email send failed:", err);
    return NextResponse.json({ ok: false, email: site?.email, error: "Email send failed" });
  }

  // Prepare masked email
  const showEmail = (e) => {
    const [local] = e.split("@");
    const first = local[0];
    const last = local[local.length - 1];
    return `${first}*****${last}@${e.split("@")[1]}`;
  };

  return NextResponse.json({ ok: true, maskedEmail: showEmail(emailToSend) });
}
