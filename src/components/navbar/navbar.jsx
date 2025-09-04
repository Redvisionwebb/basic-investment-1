"use client";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";

export default function NavBar({ services = [] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  const mobileDropdownRef = useRef(null);

  // Sticky navbar background change
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
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
  };

  return (
    <nav
      className={`w-full top-0 left-0 z-50 transition-all duration-300 px-6 py-3 ${
        isScrolled ? "fixed shadow-md bg-white" : "absolute bg-transparent"
      }`}
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl lg:text-3xl font-bold text-[color:var(--rv-primary)]">
          LOGO
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-800 text-2xl"
          onClick={() => setMobileMenuOpen((s) => !s)}
          aria-label="Toggle menu"
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

          {/* Desktop dropdown (CSS-only hover) */}
          <li className="relative group">
            <button
              type="button"
              className="flex items-center space-x-1 cursor-pointer outline-none"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span>Services</span>
              <FaChevronDown className="text-sm transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" />
            </button>

            {/* Hover buffer to prevent flicker between trigger and menu */}
            <div className="absolute left-0 top-full h-2 w-full"></div>

            <div
              className="
                absolute left-0 mt-2 min-w-[220px] bg-white shadow-lg rounded-lg
                opacity-0 invisible translate-y-2 transition-all duration-200
                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0
                pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto
                z-[60]
              "
              role="menu"
            >
              <ul>
                {services.map((item, index) => (
                  <li
                    key={index}
                    className="px-5 py-2 hover:bg-gray-100 transition-colors"
                  >
                    <Link href={`/services/${item.link}`} onClick={handleLinkClick}>
                      {item.name}
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

          {/* Mobile Dropdown (click) */}
          <li ref={mobileDropdownRef}>
            <div
              className="flex items-center space-x-1 cursor-pointer"
              onClick={() => setMobileDropdownOpen((s) => !s)}
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
                {services.map((item, index) => (
                  <li
                    key={index}
                    className="hover:text-[color:var(--rv-primary)] cursor-pointer"
                  >
                    <Link href={`/services/${item.link}`} onClick={handleLinkClick}>
                      {item.name}
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
              onClick={handleLinkClick}
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
