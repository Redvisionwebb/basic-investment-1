"use client";

import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import useLogoSrc from "@/hooks/useLogoSrc";

export default function NavBar({ services }) {
  const pathname = usePathname();
  const logoSrc = useLogoSrc();

  const tools = [
    { name: "Financial Calculator", link: "calculators" },
    { name: "Financial Health", link: "financial-health" },
    { name: "Pay Premium Online", link: "pay-premium-online" },
    { name: "Useful Links", link: "useful-links" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [mobileDropdown, setMobileDropdown] = useState({
    services: false,
    tools: false,
  });

  const dropdownRef = useRef(null);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMobileDropdown({ services: false, tools: false });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setMobileDropdown({ services: false, tools: false });
  };

  const toSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");

  const isActive = (path) => pathname === path;

  return (
    <nav
      className={`w-full z-50 transition-all duration-300 px-6 py-3 ${
        isScrolled ? "fixed shadow-md bg-white top-0" : "absolute bg-transparent top-6"
      }`}
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">

        {/* LOGO */}
        <Link href="/">
          <Image src={logoSrc} width={120} height={120} alt="logo" />
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-gray-800 text-2xl"
          onClick={() => setMobileMenuOpen((s) => !s)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex space-x-6 font-medium text-gray-800 items-center">

          <li className={isActive("/") ? "text-[var(--rv-primary)] font-semibold" : ""}>
            <Link href="/">Home</Link>
          </li>

          <li className={isActive("/about-us") ? "text-[var(--rv-primary)] font-semibold" : ""}>
            <Link href="/about-us">About Us</Link>
          </li>

          {/* SERVICES DROPDOWN */}
          <li className="relative group">
            <button className="flex items-center space-x-1">
              <span>Services</span>
              <FaChevronDown className="text-sm" />
            </button>

            <div className="absolute left-0 mt-2 min-w-[220px] bg-white shadow-lg rounded-lg opacity-0 invisible translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-[60]">
              <ul>
                {services.map((item, index) => (
                  <li key={index} className="px-5 py-2 hover:bg-gray-100">
                    <Link href={`/services/${toSlug(item.name)}`}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>

          {/* TOOLS DROPDOWN */}
          <li className="relative group">
            <button className="flex items-center space-x-1">
              <span>Tools</span>
              <FaChevronDown className="text-sm" />
            </button>

            <div className="absolute left-0 mt-2 min-w-[220px] bg-white shadow-lg rounded-lg opacity-0 invisible translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-[60]">
              <ul>
                {tools.map((item, index) => (
                  <li key={index} className="px-5 py-2 hover:bg-gray-100">
                    <Link href={`/tools/${item.link}`}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>

          <li className={isActive("/contact-us") ? "text-[var(--rv-primary)] font-semibold" : ""}>
            <Link href="/contact-us">Contact Us</Link>
          </li>
        </ul>

        {/* DESKTOP LOGIN BUTTON */}
        <div className="hidden md:flex justify-end">
          <Link href="/login">
            <button className="px-5 py-2 bg-[color:var(--rv-primary)] text-white rounded-lg">
              Login
            </button>
          </Link>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        ref={dropdownRef}
        className={`md:hidden bg-white overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <ul className="px-2 py-4 space-y-4 font-medium">

          <li>
            <Link href="/" onClick={handleLinkClick} className={isActive("/") ? "text-[var(--rv-primary)]" : ""}>
              Home
            </Link>
          </li>

          <li>
            <Link href="/about-us" onClick={handleLinkClick} className={isActive("/about-us") ? "text-[var(--rv-primary)]" : ""}>
              About Us
            </Link>
          </li>

          {/* MOBILE SERVICES DROPDOWN */}
          <li>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setMobileDropdown((s) => ({ ...s, services: !s.services }))}
            >
              <span>Services</span>
              <FaChevronDown className={`${mobileDropdown.services && "rotate-180"} transition`} />
            </div>

            <div className={`${mobileDropdown.services ? "max-h-60" : "max-h-0"} overflow-hidden transition-all`}>
              <ul className="pl-4 pt-2 space-y-2">
                {services.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={`/services/${toSlug(item.name)}`}
                      onClick={handleLinkClick}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>

          {/* MOBILE TOOLS DROPDOWN */}
          <li>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setMobileDropdown((s) => ({ ...s, tools: !s.tools }))}
            >
              <span>Tools</span>
              <FaChevronDown className={`${mobileDropdown.tools && "rotate-180"} transition`} />
            </div>

            <div className={`${mobileDropdown.tools ? "max-h-60" : "max-h-0"} overflow-hidden transition-all`}>
              <ul className="pl-4 pt-2 space-y-2">
                {tools.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={`/tools/${item.link}`}
                      onClick={handleLinkClick}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>

          <li>
            <Link href="/contact-us" onClick={handleLinkClick} className={isActive("/contact-us") ? "text-[var(--rv-primary)]" : ""}>
              Contact Us
            </Link>
          </li>

          <li>
            <Link href="/login" onClick={handleLinkClick}>
              <div className="text-center px-5 py-2 bg-[color:var(--rv-primary)] text-white rounded-lg">
                Login
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
