"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";

const SidebarDropdown = ({ items }) => {
  const pathname = usePathname();
  const [openIndex, setOpenIndex] = useState(null); // track kaunsa open hai

  return (
    <ul className="flex flex-col gap-1">
      {items?.map((menuItem, index) => (
        <DropdownItem
          key={index}
          menuItem={menuItem}
          pathname={pathname}
          isOpen={openIndex === index}
          onToggle={() =>
            setOpenIndex(openIndex === index ? null : index)
          }
        />
      ))}
    </ul>
  );
};

const DropdownItem = ({ menuItem, pathname, isOpen, onToggle }) => {
  const isActive = pathname === menuItem.route;

  const handleClick = (e) => {
    if (menuItem.children) {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <li>
      <Link
        href={menuItem.route || "#"}
        onClick={handleClick}
        className={`relative flex items-center justify-between rounded-md px-3 py-2 font-medium duration-300 ease-in-out 
          ${isActive ? "bg-[var(--rv-admin-bg-color)] text-white" : "hover:bg-[var(--rv-admin-bg-color)] hover:text-white"}
        `}
      >
        <span>{menuItem.label}</span>

        {menuItem.children && (
          <IoIosArrowDown
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </Link>

      {menuItem.children && isOpen && (
        <div className="ml-2 mt-1 pl-2 ">
          <SidebarDropdown items={menuItem.children} />
        </div>
      )}
    </li>
  );
};

export default SidebarDropdown;
