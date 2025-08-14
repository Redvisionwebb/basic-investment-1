import { ConnectDB } from "../db/ConnectDB";
import AboutUsModel from "../models/AboutUsModel";
import AmcsLogoModel from "../models/AmcsLogos";
import ArnModel from "../models/ArnModel";
import BlogsModel from "../models/BlogModel";
import MissionVisionModel from "../models/MissionVissionModel";
import ServicesModel from "../models/ServicesModel";
import SiteSettingsModel from "../models/SiteSetting";
import SocialMediaModel from "../models/SocialMedia";
import TeamModel from "../models/TeamModel";
import TestimonialModel from "../models/TestimonialModel";
import VideoModel from "../models/VideoModel";
import fs from "fs";
import path from "path";

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
  const data = await ServicesModel?.find({}).select("-_id"); // Use find() instead of findOne()
  return data ? data.map((service) => service.toObject()) : [];
}

export async function getTestimonials() {
  await ConnectDB();
  const data = await TestimonialModel?.find({}).select("-_id"); // Use find() instead of findOne()
  return data ? data.map((service) => service.toObject()) : [];
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
  // console.log(slug,"dnajkdnhasjlkdnaslk")
  await ConnectDB();
  const blog = await BlogsModel.findOne({ slug });
  // console.log(blog,"ndjadn")
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
