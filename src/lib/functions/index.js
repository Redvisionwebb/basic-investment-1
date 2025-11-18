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
import AdminModel from "../models/AdminModel";
import bcrypt from "bcryptjs";
import AdminServiceModel from "../models/AdminServiceModel";
import BotLeadsModel from "../models/Botlead";
import RiskUsersModel from "../models/RiskUsersModel";
import LeadsModel from "../models/LeadsModel";
import FinancialHealthUsersModel from "../models/FinancialHealthUsersModel";
import RoboModel from "../models/RoboModel";
import LoginGroupModel from "../models/LoginModel";
import fs from "fs";
import path from "path";
import StatsModel from "../models/StatModel";
import AnalyticsModel from "../models/AnalyticsModel";


const toPlain = (data) => JSON.parse(JSON.stringify(data || null));

export async function getSiteData() {
  try {
    await ConnectDB();
    const data = await SiteSettingsModel.findOne().lean();
    return toPlain(data || {});
  } catch (error) {
    return toPlain({});
  }
}

export async function getMissionVission() {
  try {
    await ConnectDB();
    const data = await MissionVisionModel.findOne().lean();
    return toPlain(data || {});
  } catch (error) {
    return toPlain({});
  }
}

export async function getAboutusteams() {
  try {
    await ConnectDB();
    const data = await TeamModel.find().lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getSocialMedia() {
  try {
    await ConnectDB();
    const data = await SocialMediaModel.find().lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getArn() {
  try {
    await ConnectDB();
    const data = await ArnModel.find().lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getServiceData() {
  try {
    await ConnectDB();
    const data = await AdminServiceModel.find().lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getServiceDataBySlug(slug) {
  try {
    await ConnectDB();
    const data = await AdminServiceModel.findOne({ name: slug }).lean();
    return toPlain(data || {});
  } catch (error) {
    return toPlain({});
  }
}

export async function getTestimonials() {
  try {
    await ConnectDB();
    const data = await TestimonialModel.find().sort({ createdAt: -1 }).lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getAwards() {
  try {
    await ConnectDB();
    const data = await AwardModel.find().sort({ createdAt: -1 }).lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getTeams() {
  try {
    await ConnectDB();
    const data = await TeamModel.find().sort({ createdAt: -1 }).lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getAboutus() {
  try {
    await ConnectDB();
    const data = await AboutUsModel.find().lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getAllStats() {
  try {
    await ConnectDB();
    const data = await StatsModel.find().lean();
    return toPlain(data || []);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return toPlain([]);
  }
}

export async function getLatestBlogs() {
  try {
    await ConnectDB();
    const blogs = await BlogsModel.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .select("-category")
      .lean();
    return toPlain(blogs || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getAddisLogos() {
  try {
    await ConnectDB();
    const logos = await AmcsLogoModel.find({ addisstatus: true }).lean();
    return toPlain(logos || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getBlogs() {
  try {
    await ConnectDB();
    const data = await BlogsModel.find()
      .sort({ createdAt: -1 })
      .select("-category")
      .lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getActiveServicesCount() {
  try {
    await ConnectDB();
    const count = await AdminServiceModel.countDocuments({ status: true });
    return count || 0;
  } catch (error) {
    return 0;
  }
}

export async function getBlogsCount() {
  try {
    await ConnectDB();
    const count = await BlogsModel.countDocuments();
    return count || 0;
  } catch (error) {
    return 0;
  }
}

export async function getTestimonialsCount() {
  try {
    await ConnectDB();
    const count = await TestimonialModel.countDocuments();
    return count || 0;
  } catch (error) {
    return 0;
  }
}

export async function getFaqsCount() {
  try {
    await ConnectDB();
    const count = await FaqModel.countDocuments();
    return count || 0;
  } catch (error) {
    return 0;
  }
}

export async function getAwardsCount() {
  try {
    await ConnectDB();
    const count = await AwardModel.countDocuments();
    return count || 0;
  } catch (error) {
    return 0;
  }
}

export async function getStatsData() {
  try {
    await ConnectDB();
    const stats = await StatsModel.find({}).sort({ createdAt: -1 });
    return stats;
  } catch (error) {
    return [];
  }
}

export async function getAllLeadsCount() {
  try {
    await ConnectDB();
    const [bot, risk, leads, health] = await Promise.all([
      BotLeadsModel.countDocuments(),
      RiskUsersModel.countDocuments(),
      LeadsModel.countDocuments(),
      FinancialHealthUsersModel.countDocuments(),
    ]);
    return bot + risk + leads + health;
  } catch (error) {
    return 0;
  }
}

export async function getVidios() {
  try {
    await ConnectDB();
    const data = await VideoModel.find().sort({ createdAt: -1 }).lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getActiveLogindesk() {
  try {
    await ConnectDB();
    const groups = await LoginGroupModel.find({ "loginitems.isstatus": true }).select('-_id').lean();
    const filteredGroups = groups
      .map((group) => ({
        _id: group._id,
        name: group.name,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        loginitems: group.loginitems.filter((item) => item.isstatus === true),
      }))
      .filter((group) => group.loginitems.length > 0);
    return filteredGroups;
  } catch (error) {
    return [];
  }
}

export async function getRoboUser() {
  try {
    await ConnectDB();
    const roboUser = await RoboModel.findOne({
      roboUser: true,
      softwareUser: true,
    })
      .sort({ createdAt: -1 })
      .lean();
    return toPlain(roboUser || null);
  } catch (error) {
    return null;
  }
}

export async function getAnalytics() {
  try {
    await ConnectDB();

    // Fetch the latest Analytics document (you only have one)
    const analyticsData = await AnalyticsModel.findOne()
      .sort({ createdAt: -1 })
      .lean();

    return toPlain(analyticsData || null); // return plain object or null if none
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return null;
  }
}

export async function getBlogBySlug(slug) {
  try {
    await ConnectDB();
    const blog = await BlogsModel.findOne({ slug }).select("-category").lean();
    return toPlain(blog || {});
  } catch (error) {
    return toPlain({});
  }
}

export function slugify(text) {
  try {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  } catch (error) {
    console.error("slugify error:", error.message);
    return "";
  }
}

export async function saveImageToLocal(section, file) {
  try {
    const uploadDir = path.join(process.cwd(), process.env.UPLOAD_URL, section);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filepath, buffer);
    return { filename, url: `/api/uploads?section=${section}&filename=${filename}` };
  } catch (error) {
    console.error("saveImageToLocal error:", error.message);
    return null;
  }
}

export function deleteFileIfExists(section, filename) {
  try {
    const filePath = path.join(process.cwd(), process.env.UPLOAD_URL, section, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("deleteFileIfExists error:", error.message);
    return false;
  }
}

export async function getFaqs() {
  try {
    await ConnectDB();
    const data = await FaqModel.find().lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function loginUser({ username, password }) {
  try {
    if (!username || !password) return null;
    const user = await AdminModel.findOne({ username }).lean();
    if (!user) return null;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;
    return { id: String(user._id), name: user.username, role: user.role || "normaladmin" };
  } catch (error) {
    console.error("loginUser error:", error.message);
    return null;
  }
}

export async function DevLogin({ username, password }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DATA_API}/api/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      id: data.id || data._id,
      name: data.username || data.name,
      role: data.role || "devadmin",
    };
  } catch (error) {
    console.error("DevLogin error:", error.message);
    return null;
  }
}
