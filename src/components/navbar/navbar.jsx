"use client"
import styles from './NavBar.module.css';
import { useEffect, useState } from 'react';
import { FaChevronDown, FaBars } from 'react-icons/fa';
import Link from 'next/link';

const serviceItems = [
  { label: 'Wealth Management', href: '#' },
  { label: 'Retirement Planning', href: '#' },
  { label: 'Tax Optimization', href: '#' },
  { label: 'Estate Planning', href: '#' }
];

export default function NavBar({services}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [isDesktopDropdownOpen, setDesktopDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDesktopDropdownClick = () => {
    setDesktopDropdownOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setMobileDropdownOpen(false);
    setDesktopDropdownOpen(false);
  };

  return (
    <nav className={`w-full top-0 left-0 z-50 ${isScrolled ? 'fixed shadow-md bg-white' : 'absolute bg-transparent'} ${styles.navbar}`}>
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-[color:var(--rv-primary)]">LOGO</div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800 text-2xl"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          <FaBars />
        </button>

        {/* Center Menu */}
        <ul className={`hidden md:flex space-x-6 font-medium text-gray-800 items-center`}> 
          <li><Link href="/" onClick={handleLinkClick}>Home</Link></li>
          <li><Link href="/about-us" onClick={handleLinkClick}>About Us</Link></li>
          <li className="relative">
            <div
              className="flex items-center space-x-1 cursor-pointer"
              onClick={handleDesktopDropdownClick}
            >
              <span>Services</span>
              <FaChevronDown className={`text-sm transition-transform ${isDesktopDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            {isDesktopDropdownOpen && (
              <ul className="absolute bg-white shadow-lg mt-2 rounded-md min-w-[200px] z-50">
                {serviceItems.map((item, index) => (
                  <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <Link href={item.href} onClick={handleLinkClick}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li><Link href="/calculators" onClick={handleLinkClick}>Calculators</Link></li>
          <li><Link href="/" onClick={handleLinkClick}>Educational</Link></li>
          <li><Link href="/contact-us" onClick={handleLinkClick}>Contact</Link></li>
        </ul>

        {/* Login Button */}
        <div className="hidden md:flex justify-end">
          <button className={`btn btn-primary`}>Login</button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-6 pb-4 bg-white shadow-md">
          <ul className="space-y-4 font-medium text-gray-800">
            <li><Link href="#" onClick={handleLinkClick}>Home</Link></li>
            <li><Link href="#" onClick={handleLinkClick}>About Us</Link></li>
            <li>
              <div
                className="flex items-center space-x-1 cursor-pointer"
                onClick={() => setMobileDropdownOpen(!isMobileDropdownOpen)}
              >
                <span>Services</span>
                <FaChevronDown className={`text-sm transition-transform ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              {isMobileDropdownOpen && (
                <ul className="pl-4 mt-2 space-y-2">
                  {serviceItems.map((item, index) => (
                    <li key={index} className="hover:text-[color:var(--rv-primary)] cursor-pointer">
                      <Link href={item.href} onClick={handleLinkClick}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li><Link href="#" onClick={handleLinkClick}>Calculators</Link></li>
            <li><Link href="#" onClick={handleLinkClick}>Educational</Link></li>
            <li><Link href="#" onClick={handleLinkClick}>Contact</Link></li>
            <li><Link  href="#" className={`btn btn-primary`}>Login</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
}
