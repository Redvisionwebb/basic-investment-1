"use client";
import React from "react";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import { usePathname } from "next/navigation";
import SidebarDropdown from "./SidebarDropdown";
import { signOut } from "next-auth/react";

const SidebarItem = ({ item, isOpen, onToggle }) => {
  const pathname = usePathname();
  const isActive = pathname === item.route;

  // 🔹 Logout case handle
  if (item.type === "logout") {
    return (
      <li>
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className={`flex items-center justify-between gap-3 px-3 py-2 rounded-md font-medium transition-all duration-300 
            hover:bg-[#2367f8] hover:text-white text-left w-full
          `}
        >
          <div className="flex items-center gap-2">
            {item?.icon}
            {item?.label}
          </div>
        </button>
      </li>
    );
  }

  // 🔹 Normal menu + dropdown
  return (
    <li>
      <Link
        href={item?.route || "#"}
        onClick={(e) => {
          if (item?.children) {
            e.preventDefault();
            onToggle();
          }
        }}
        className={`flex items-center justify-between gap-3 px-3 py-2 rounded-md font-medium transition-all duration-300
          ${isActive ? "bg-[#2367f8] text-white" : "hover:bg-[#2367f8] hover:text-white"}
        `}
      >
        <div className="flex items-center gap-2">
          {item?.icon}
          {item?.label}
        </div>

        {item?.children && (
          <IoIosArrowDown
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </Link>

      {item?.children && isOpen && (
        <div className="ml-2 mt-1 pl-3">
          <SidebarDropdown items={item?.children} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
