"use client";
import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { useEffect, useState } from "react";
import styles from "./Footer.module.css";

const Footer = ({ siteData, services, arnData, socialmedialinks }) => {
  //console.log(arnData);
  const arn = arnData;
  const iconMap = {
    Facebook: <FaFacebookF className="text-[var(--rv-primary)]" />,
    Instagram: <FaInstagram className="text-[var(--rv-primary)]" />,
    Youtube: <FaYoutube className="text-[var(--rv-primary)]" />,
    Linkedln: <FaLinkedin className="text-[var(--rv-primary)]" />,
    Twitter: <FaXTwitter className="text-[var(--rv-primary)]" />,
  };
  const quicklinks = [
    {
      title: "About Us",
      link: "/about-us",
    },
    {
      title: "Contact Us",
      link: "/contact-us",
    },
    // {
    //   title: "Blogs",
    //   link: "/blogs",
    // },
    {
      title: "Financial Calculator",
      link: "/tools/calculators",
    },
    {
      title: "Financial Health",
      link: "/tools/financial-health",
    },
    {
      title: "Privacy Policy",
      link: "/footer-page/privacy-policy",
    },
    {
      title: "Commission Disclosures",
      link: "/footer-page/commission-disclosures",
    },
    {
      title: "Code of Conduct",
      link: "/AMFI_Code-of-Conduct1.pdf", // Put the actual path where your PDF is stored
      download: true, // custom flag for download
    },
  ];

  const amfisabilinks = [
    {
      title: "Risk Factors ",
      link: "/footer-page/risk-factors",
    },
    {
      title: "Terms & Conditions ",
      link: "/footer-page/terms-conditions",
    },
    {
      title: "SID/SAI/KIM ",
      link: "https://www.sebi.gov.in/filings/mutual-funds.html",
      target: "_black",
    },
    {
      title: "Code of Conduct ",
      link: "/images/AMFI_Code-of-Conduct.pdf",
      target: "_black",
    },
    {
      title: "Investor Grievance Redressal ",
      link: "/footer-page/investor-grievance-redressal",
    },
    {
      title: "Important links",
      link: "/footer-page/important-links",
    },
    {
      title: "SEBI Circulars ",
      link:
        "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListingAll=yes&search=Mutual+Funds",
      target: "_black",
    },
  ];

  return (
    <footer className="bg-[var(--rv-black)]  bg-blend-overlay border-t-2 md:mt-88 sm:mt-88 pt-[30px]">
      <div className="mx-auto w-full max-w-screen-xl ">
        <div className="grid grid-cols-1 gap-6 py-6 md:grid-cols-2 lg:grid-cols-12 md:px-0 px-4">
          {/* Logo - 5 columns */}
          <div className="lg:col-span-5">
            {/* Logo Box */}
            <div
              className={`${styles.logo} p-4 text-white rounded-[10px]`}
            >
              <h2>YOUR LOGO</h2>
            </div>

            {/* About Text */}
            <p className="mt-2 text-gray-50 py-4">
              {siteData?.websiteName} is a SEBI-registered mutual fund
              distributor providing client-focused financial planning. With
              experienced guidance and a goal-based approach, we help you grow
              and protect your wealth with confidence.
            </p>

            {/* Social Media Icons */}
            <div className="flex flex-row gap-3 mt-2">
              {socialmedialinks
                ?.filter((link) => !link.isHidden)
                .map((link, index) => (
                  <Link key={index} target="_blank" href={link.url}>
                    <div
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-white bg-transparent hover:bg-[var(--rv-primary-light)] transition"
                      title={link.title}
                    >
                      {iconMap[link.title] || <FaFacebookF />}
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          {/* Quick Links - 4 columns */}
          <div className="text-gray-50 lg:col-span-4 md:pl-10">
            <h4 className="mb-5 font-bold text-[var(--rv-primary)]">Quick Links</h4>
            <ul>
              {quicklinks?.map((sub, index) => (
                <li className="mb-3" key={index}>
                  {sub.download ? (
                    <a
                      href={sub.link}
                      download
                      className="hover:text-[var(--rv-primary)]"
                    >
                      <p>{sub.title}</p>
                    </a>
                  ) : (
                    <Link
                      href={sub.link}
                      target="blank"
                      className="hover:text-[var(--rv-primary)]"
                    >
                      <p>{sub.title}</p>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Services - 3 columns */}
          <div className="text-gray-50 lg:col-span-3">
            <h4 className="mb-5 font-bold text-[var(--rv-primary)]">Services</h4>
            <ul>
              {services?.map((sub, index) => (
                <li className="mb-4" key={index}>
                  {!sub.children || sub.children.length === 0 ? (
                    <Link
                      href={`/services/${sub.link}`}
                      target="blank"
                      className="hover:text-[var(--rv-primary)]"
                    >
                      <p>{sub.name}</p>
                    </Link>
                  ) : (
                    <ul>
                      {sub.children.map((child, childIndex) => (
                        <li key={childIndex} className="mb-1">
                          <Link
                            href={child.link}
                            target="blank"
                            className="hover:text-[var(--rv-primary)]"
                          >
                            <p>{child.name}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-x-3 justify-center"></div>
        <div className="text-gray-50 py-3 md:px-1 px-4 text-center">
          <p className="py-1 text-center font-bold text-[var(--rv-primary)]">
            {siteData?.websiteName} is an AMFI Registered Mutual Fund
            Distributor
            {arn?.[0]?.arn && <> | ARN: {String(arn[0].arn)}</>}
            {arn?.[0]?.euins?.length > 0 &&
              arn[0].euins[0]?.registrationDate &&
              arn[0].euins[0]?.expiryDate && (
                <>
                  {" | Current Validity: "}
                  {new Date(
                    String(arn[0].euins[0].registrationDate)
                  ).toLocaleDateString("en-IN")}
                  {" to "}
                  {new Date(
                    String(arn[0].euins[0].expiryDate)
                  ).toLocaleDateString("en-IN")}
                </>
              )}
          </p>

          <div className={styles.footersabiLink}>
            <ul>
              {amfisabilinks?.map((sub, index) => (
                <li key={index}>
                  <Link
                    href={sub?.link}
                    target={`${sub?.target ? sub?.target : "_self"}`}
                  >
                    {sub?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="py-2 text-center">
            Disclaimer: Mutual Fund investments are subject to market risks,
            read all scheme related documents carefully. The NAVs of the schemes
            may go up or down depending upon the factors and forces affecting
            the securities market including the fluctuations in the interest
            rates. The past performance of the mutual funds is not necessarily
            indicative of future performance of the schemes. The Mutual Fund is
            not guaranteeing or assuring any dividend under any of the schemes
            and the same is subject to the availability and adequacy
            distributable surplus.
          </p>
          <p className="py-2 text-center">
            {siteData?.websiteName} makes no warranties or representations,
            express or implied, on products offered through the platform of{" "}
            {siteData?.websiteName}. It accepts no liability for any damages or
            losses, however, caused, in connection with the use of, or on the
            reliance of its product or related services. Terms and conditions of
            the website are applicable. Investments in Securities markets are
            subject to market risks, read all the related documents carefully
            before investing.
          </p>
        </div>
        <div className="text-gray-50 py-3 flex justify-center">
          <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-8 justify-center items-center text-center">
            {/* AMFI Logo and Info */}
            <div className="flex flex-col md:flex-row gap-y-2 md:gap-x-3 items-center">
              <Image
                src={"/images/amfi-logo.jpg"}
                width={100}
                height={100}
                alt="AMFI Logo"
                className="rounded"
              />
              <div>
                <p>ARN - {arn?.[0]?.arn || "N/A"}</p>
                <p>EUIN - {arn?.[0]?.euins?.[0]?.euin || "N/A"}</p>
              </div>
            </div>

            {/* Mutual Fund Logo */}
            <Image
              src={"/images/mutualfund.png"}
              width={250}
              height={100}
              alt="Mutual Fund Logo"
              className="rounded"
            />
          </div>
        </div>

        <div className="text-gray-50 w-full mx-auto max-w-screen-xl p-4 md:flex md:justify-between border-t border-gray-300">
          <p className="sm:text-center">
            © {new Date().getFullYear()}{" "}
            <Link href="/" className="hover:underline">
              {siteData?.websiteName}
            </Link>
            . All Rights Reserved.
          </p>
          <ul className="flex flex-wrap items-center mt-3  sm:mt-0">
            <li>
              <p>
                Designed & Developed by{" "}
                <Link
                  href={"https://www.redvisiontechnologies.com/"}
                  target="_blank"
                >
                  REDVision Global Technologies
                </Link>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
