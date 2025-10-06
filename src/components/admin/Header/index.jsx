"use client";

import React, { useEffect, useState } from "react";
import DropdownUser from "./DropdownUser";
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { useSidebar } from "@/context/SidebarContext";

const Header = () => {
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [siteData, setSiteData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/site-settings`);
      const data = await res.json();
      setSiteData(data[0]);
    };
    fetchData();
  }, []);

  return (
    <header className="sticky top-0 w-full flex items-center justify-between bg-gray-100 border-b border-gray-300 py-4 px-4 transition-all">
      <div className="flex items-center gap-5">
        {/* Arrow toggle button */}
        <div
          onClick={toggleSidebar}
          className="w-8 h-8 flex items-center justify-center bg-[var(--rv-admin-bg-color)] text-white rounded-lg text-2xl cursor-pointer hover:bg-[var(--rv-admin-bg-color)] transition-colors"
        >
          {sidebarOpen ? <MdKeyboardDoubleArrowLeft /> : <MdKeyboardDoubleArrowRight />}
        </div>
        <h2 className="font-bold text-lg">Dashboard</h2>
      </div>
      <DropdownUser />
    </header>
  );
};

export default Header;
