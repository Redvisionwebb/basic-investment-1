import { ConnectDB } from "../db/ConnectDB";
import AboutUsModel from "../models/AboutUsModel";
import AmcsLogoModel from "../models/AmcsLogos";
import ArnModel from "../models/ArnModel";
import AwardModel from "../models/AwardsModel";
import BlogsModel from "../models/BlogModel";
import FaqModel from "../models/FaqsModel";
import MissionVisionModel from "../models/MissionVissionModel";
import SiteSettingsModel from "../models/SiteSetting";
import SocialMediaModel from "../models/SocialMedia";
import TeamModel from "../models/TeamModel";
import TestimonialModel from "../models/TestimonialModel";
import VideoModel from "../models/VideoModel";
import fs from "fs";
import path from "path";
import AdminModel from "../models/AdminModel";
import bcrypt from "bcryptjs";
import AdminServiceModel from "../models/AdminServiceModel";

export async function getSiteData() {
  await ConnectDB();
  const data = await SiteSettingsModel?.findOne({}).select("-_id");
  return data ? data.toObject() : {};
}

export async function getMissionVission() {
  await ConnectDB();
  const data = await MissionVisionModel?.findOne({}).select("-_id");
  return data ? data.toObject() : {};
}
export async function getAboutusteams() {
  await ConnectDB();
  const data = await TeamModel?.find({}).select('-_id');  // Use find() instead of findOne()
  return data ? data.map(service => service.toObject()) : [];
};

export async function getSocialMedia() {
  await ConnectDB();
  const data = await SocialMediaModel?.find({}).select("-_id");
  return data ? data.map((service) => service.toObject()) : [];
}

export async function getArn() {
  await ConnectDB();
  const data = await ArnModel?.find({}).select("-_id");
  return data ? data.map((service) => service.toObject()) : [];
}

export async function getServiceData() {
  await ConnectDB();
  const data = await AdminServiceModel.find({}).lean(); // plain JS objects, not Mongoose docs
  return data ? JSON.parse(JSON.stringify(data)) : [];
};

export async function getServiceDataBySlug(slug) {
  await ConnectDB();
  const data = await AdminServiceModel.findOne({ name: slug }).lean();
  console.log(data);
   // plain JS objects, not Mongoose docs
  return data ? JSON.parse(JSON.stringify(data)) : [];
};

export async function getTestimonials() {
  await ConnectDB();
  const data = await TestimonialModel?.find({}).select("-_id"); // Use find() instead of findOne()
  return data ? data.map((service) => service.toObject()) : [];
}

export async function getAwards() {
  await ConnectDB();
  const data = await AwardModel.find({}).select("-_id"); // Fetch all awards without _id
  return data ? data.map((award) => award.toObject()) : [];
}

export async function getTeams() {
  await ConnectDB();
  const data = await TeamModel?.find({}).select("-_id"); // Use find() instead of findOne()
  return data ? data.map((service) => service.toObject()) : [];
}

export async function getAboutus() {
  await ConnectDB();
  const data = await AboutUsModel?.find({}).select("-_id"); // Use find() instead of findOne()
  return data ? data.map((service) => service.toObject()) : [];
}
export async function getLatestBlogs() {
  await ConnectDB();

  const blogs = await BlogsModel.find({})
    .sort({ createdAt: -1 }) // Sort by newest first
    .limit(3) // Get only the latest 3
    .select("-_id"); // Exclude the MongoDB _id if not needed

  return blogs ? blogs.map((blog) => blog.toObject()) : [];
}

export async function getAddisLogos() {
  await ConnectDB();
  const logos = await AmcsLogoModel.find({ addisstatus: true });
  return logos.map((logo) => logo.toObject());
}

export async function getBlogs() {
  await ConnectDB();
  const data = await BlogsModel?.find({}).select("-_id"); // Use find() instead of findOne()
  return data ? data.map((service) => service.toObject()) : [];
}

export async function getVidios() {
  await ConnectDB();
  const data = await VideoModel?.find({}).select("-_id"); // Use find() instead of findOne()
  return data ? data.map((service) => service.toObject()) : [];
}

export async function getBlogBySlug(slug) {
  await ConnectDB();
  const blog = await BlogsModel.findOne({ slug });
  return blog ? blog.toObject() : null;
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens
}

export async function saveImageToLocal(section, file) {
  const uploadDir = path.join(process.cwd(), process.env.UPLOAD_URL, section);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const filename = `${Date.now()}-${file.name}`;
  const filepath = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filepath, buffer);

  return {
    filename,
    url: `/api/uploads?section=${section}&filename=${filename}`,
  };
}

export function deleteFileIfExists(section, filename) {
  const filePath = path.join(
    process.cwd(),
    process.env.UPLOAD_URL,
    section,
    filename
  );
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

export async function getFaqs() {
  await ConnectDB();
  const data = await FaqModel?.find({}).select('-_id');
  return data ? data.map(faq => faq.toObject()) : [];
}

export async function loginUser({ username, password }) {
  console.log("Logging in user:", username, password);
  if (!username || !password) return null;
  await ConnectDB();
  const user = await AdminModel.findOne({ username }).lean();
  console.log("Found user:", user);
  if (!user) return null;
  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log("Password valid:", isPasswordValid);
  if (!isPasswordValid) return null;

  return {
    id: String(user._id),
    name: user.username,
    role: user.role || "normaladmin",
  };
}

export async function DevLogin({ username, password }) {
  console.log("Logging in user:", username, password);
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DATA_API}/api/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    console.log("end");

    if (!res.ok) return null;
    console.log("Response OK:", res.ok);

    const data = await res.json();
    console.log("Response Data:", data);
    return {
      id: data.id || data._id,
      name: data.username || data.name,
      role: data.role || "devadmin",
    };
  } catch (err) {
    console.error("Dev login failed:", err);
    return null;
  }
}

