"use client";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";

const serviceItems = [
  { label: "Wealth Management", href: "#" },
  { label: "Retirement Planning", href: "#" },
  { label: "Tax Optimization", href: "#" },
  { label: "Estate Planning", href: "#" },
];

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [isDesktopDropdownOpen, setDesktopDropdownOpen] = useState(false);

  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  // Sticky navbar background change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target)
      ) {
        setDesktopDropdownOpen(false);
      }
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setMobileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setMobileDropdownOpen(false);
    setDesktopDropdownOpen(false);
  };

  return (
    <nav
      className={`w-full top-0 left-0 z-50 transition-all duration-300 ${
        isScrolled ? "fixed shadow-md bg-white" : "absolute bg-transparent"
      }`}
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="text-2xl lg:text-3xl font-bold text-[color:var(--rv-primary)]">
          LOGO
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-800 text-2xl"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 font-medium text-gray-800 items-center">
          <li>
            <Link href="/" onClick={handleLinkClick}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/about-us" onClick={handleLinkClick}>
              About Us
            </Link>
          </li>
          <li className="relative" ref={desktopDropdownRef}>
            <div
              className="flex items-center space-x-1 cursor-pointer"
              onClick={() => setDesktopDropdownOpen((prev) => !prev)}
            >
              <span>Services</span>
              <FaChevronDown
                className={`text-sm transition-transform duration-300 ${
                  isDesktopDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Desktop Dropdown */}
            <div
              className={`absolute mt-3 min-w-[220px] bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 origin-top ${
                isDesktopDropdownOpen
                  ? "opacity-100 scale-y-100"
                  : "opacity-0 scale-y-0 pointer-events-none"
              }`}
            >
              <ul>
                {serviceItems.map((item, index) => (
                  <li
                    key={index}
                    className="px-5 py-3 hover:bg-gray-100 transition-colors"
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li>
            <Link href="/calculators" onClick={handleLinkClick}>
              Calculators
            </Link>
          </li>
          <li>
            <Link href="/contact-us" onClick={handleLinkClick}>
              Contact
            </Link>
          </li>
        </ul>

        {/* Login Button */}
        <div className="hidden md:flex justify-end">
          <Link href="/login">
            <button className="px-5 py-2 bg-[color:var(--rv-primary)] text-white rounded-lg hover:bg-opacity-90 transition">
              Login
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white shadow-md overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <ul className="px-6 pb-4 space-y-4 font-medium text-gray-800">
          <li>
            <Link href="/" onClick={handleLinkClick}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/about-us" onClick={handleLinkClick}>
              About Us
            </Link>
          </li>

          {/* Mobile Dropdown */}
          <li ref={mobileDropdownRef}>
            <div
              className="flex items-center space-x-1 cursor-pointer"
              onClick={() => setMobileDropdownOpen(!isMobileDropdownOpen)}
            >
              <span>Services</span>
              <FaChevronDown
                className={`text-sm transition-transform duration-300 ${
                  isMobileDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                isMobileDropdownOpen ? "max-h-60 mt-2" : "max-h-0"
              }`}
            >
              <ul className="pl-4 space-y-2">
                {serviceItems.map((item, index) => (
                  <li
                    key={index}
                    className="hover:text-[color:var(--rv-primary)] cursor-pointer"
                  >
                    <Link href={item.href} onClick={handleLinkClick}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>

          <li>
            <Link href="/calculators" onClick={handleLinkClick}>
              Calculators
            </Link>
          </li>
          <li>
            <Link href="/contact-us" onClick={handleLinkClick}>
              Contact
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className="block text-center px-5 py-2 bg-[color:var(--rv-primary)] text-white rounded-lg hover:bg-opacity-90 transition"
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
