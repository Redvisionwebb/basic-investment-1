"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { Mail, Phone, Globe, MapPin } from "lucide-react";
import { MdAddchart } from "react-icons/md";
import { BiMessageAdd } from "react-icons/bi";
import { FaAward, FaQuestion } from "react-icons/fa";
import { GrServices } from "react-icons/gr";
import { SiGoogleads } from "react-icons/si";
import Link from "next/link";

const stats = [
  { name: "Total Services", icon: <GrServices color="var(--rv-admin-bg-color)" />, value: "10", route: "/admin/services" },
  { name: "Total Posts", icon: <MdAddchart color="var(--rv-admin-bg-color)" />, value: "5", route: "/admin/manage-posts/manage" },
  { name: "Testimonials", icon: <BiMessageAdd color="var(--rv-admin-bg-color)" />, value: "3", route: "/admin/manage-testimonials/manage" },
  { name: "FAQs", icon: <FaQuestion color="var(--rv-admin-bg-color)" />, value: "6", route: "/admin/faqs" },
  { name: "Awards", icon: <FaAward color="var(--rv-admin-bg-color)" />, value: "6", route: "/admin/manage-awards/manage" },
  { name: "New Leads", icon: <SiGoogleads color="var(--rv-admin-bg-color)" />, value: "205", route: "/admin/manage-leads/manage" },
];

const quickActions = [
  { title: "Create New Post", route: "/admin/manage-posts/add-post", desc: "Add a new blog post or article", icon: <MdAddchart color="var(--rv-admin-bg-color)" /> },
  { title: "Add Testimonial", route: "/admin/manage-testimonials/add-testimonial", desc: "Feature customer feedback", icon: <BiMessageAdd color="var(--rv-admin-bg-color)" /> },
  { title: "Add Award", route: "/admin/manage-awards/add-awards", desc: "Showcase achievements", icon: <FaAward color="var(--rv-admin-bg-color)" /> },
];

const Dashboard = ({ session }) => {
  const router = useRouter();
  const pathname = usePathname(); // ✅ current path
  const user = session;
  const [profile, setProfile] = useState(null);

  if (!user) {
    router.push("/signin");
  }

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/site-settings`
      );
      if (response.status === 200) {
        setProfile(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, Administrator</h1>
        <p className="text-gray-500">
          Here’s what’s happening with your platform today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <Link key={idx} href={stat.route}>
            <div className="bg-white p-4 rounded-xl shadow border border-gray-200 flex gap-5 items-center justify-between cursor-pointer hover:shadow-md transition">
              <div className="flex flex-col gap-2">
                <div className="text-gray-500 text-lg">{stat.name}</div>
                <div className="text-4xl font-bold">{stat.value}</div>
              </div>
              <div className="font-medium text-4xl">{stat.icon}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Profile */}
      {profile && (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold mb-4">Profile</h2>
          <div className="flex flex-col gap-3 text-sm text-gray-700">
            <div>
              <p className="text-lg font-bold">{profile.name}</p>
              <p className="text-gray-500">{profile.websiteName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={20} color="var(--rv-admin-bg-color)" />
              {profile.email}
            </div>
            <div className="flex items-center gap-2">
              <Phone size={20} color="var(--rv-admin-bg-color)" />
              {profile.mobile}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={20} color="var(--rv-admin-bg-color)" />
              {profile.address}
            </div>
            <div className="flex items-center gap-2">
              <Globe size={20} color="var(--rv-admin-bg-color)" />
              <Link
                href={profile.siteurl}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                {profile.siteurl}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Show Quick Actions only when NOT in /devadmin */}
      {pathname.startsWith("/admin") && !pathname.startsWith("/devadmin") && (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, i) => (
              <Link
                href={action.route}
                key={i}
                className="p-4 border border-gray-400 rounded-lg text-center flex items-center justify-center flex-col gap-2 shadow cursor-pointer transition"
              >
                <div className="font-medium text-3xl">{action.icon}</div>
                <div className="font-medium">{action.title}</div>
                <p className="text-sm text-gray-500">{action.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
