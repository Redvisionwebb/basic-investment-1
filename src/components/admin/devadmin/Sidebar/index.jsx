"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "./SidebarItem";
import useLogoSrc from "@/hooks/useLogoSrc";
import { useSidebar } from "@/context/SidebarContext";
import { RxDashboard } from "react-icons/rx";
import { FaServicestack, FaStar, FaSignInAlt } from "react-icons/fa";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
export const menuGroups = [
  {
    name: "MAIN MENU",
    menuItems: [
      {
        icon: <RxDashboard />,
        label: "Dashboard",
        route: "/devadmin",
        permission: "dashboard",
      },
      {
        icon: <FaServicestack />,
        label: "Services",
        route: "/devadmin/manage-services",
        permission: "manage_services",
      },
      {
        icon: <FaStar />,
        label: "Features",
        route: "/devadmin/manage-features",
        permission: "manage_features",
      },
      {
        icon: <FaSignInAlt />,
        label: "Login Desk",
        route: "/devadmin/manage-login",
        permission: "manage_login",
      },
      {
        icon: <BiLogOut />,
        label: "Logout",
        type: "logout",
        permission: "logout",
      },
    ],
  },
];


const Sidebar = () => {
  const logoSrc = useLogoSrc();
  const [pageName, setPageName] = useState("dashboard");
  const { sidebarOpen, closeSidebar, isMobile } = useSidebar();

  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={closeSidebar}
        ></div>
      )}

      <aside
        className={`
          top-0 left-0 z-50 h-screen bg-gray-100 border-r border-gray-300 shadow-xl
          transform transition-all duration-300 ease-in-out
          ${isMobile
            ? `fixed w-80 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
            : `relative ${sidebarOpen ? "w-80" : "w-0 -ml-0"}`
          }
          flex flex-col
          overflow-hidden
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <Link href="/admin" className="flex-1 h-14">
            <Image
              src={logoSrc}
              alt="Logo"
              width={100}
              height={100}
              className="w-full h-full object-contain"
            />
          </Link>

          {isMobile && (
            <button
              onClick={closeSidebar}
              className="w-8 h-8 flex items-center justify-center bg-[var(--rv-admin-bg-color)] text-white rounded-lg text-2xl cursor-pointer hover:bg-[var(--rv-admin-bg-color)] transition-colors"
            >
              <MdKeyboardDoubleArrowLeft />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {menuGroups?.map((group, gIdx) => (
            <div key={gIdx} className="mb-4">
              <h3 className="text-sm font-medium text-gray-600 uppercase mb-3">
                {group?.name}
              </h3>
              <ul className="space-y-1">
                {group?.menuItems?.map((item, idx) => (
                  <SidebarItem
                    key={idx}
                    item={item}
                    pageName={pageName}
                    setPageName={setPageName}
                    isOpen={openIndex === `${gIdx}-${idx}`}
                    onToggle={() => handleToggle(`${gIdx}-${idx}`)}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
