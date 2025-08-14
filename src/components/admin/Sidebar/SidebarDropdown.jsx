import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarDropdown = ({ item }) => {
  const pathname = usePathname();

  return (
    <ul className="my-2 flex flex-col gap-1.5 pl-4">
      {item.map((menuItem, index) => (
        <li key={index}>
          {/* Parent Link */}
          <Link
            href={menuItem.route}
            className={`relative flex rounded-[7px] px-3.5 py-2 font-medium duration-300 ease-in-out ${
              pathname === menuItem.route
                ? "bg-primary/[.07] text-primary"
                : "text-dark-4 hover:text-[var(--primary)]"
            }`}
          >
            {menuItem.label}
            {menuItem.pro && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md bg-primary px-1.5 py-px text-[10px] font-medium leading-[17px] text-white">
                Pro
              </span>
            )}
          </Link>

          {/* Render children if present */}
          {menuItem.children && (
            <ul className="mt-1.5 ml-4 flex flex-col gap-1.5 pl-4 border-l border-gray-200">
              {menuItem.children.map((child, childIndex) => (
                <li key={childIndex}>
                  <Link
                    href={child.route}
                    className={`relative flex rounded-[7px] px-3.5 py-2 text-sm font-medium duration-300 ease-in-out ${
                      pathname === child.route
                        ? "bg-primary/[.07] text-primary"
                        : "text-dark-4 hover:text-[var(--primary)]"
                    }`}
                  >
                    {child.label}
                    {child.pro && (
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md bg-primary px-1.5 py-px text-[10px] font-medium leading-[17px] text-white">
                        Pro
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default SidebarDropdown;
