"use client";
import React from "react";
import styles from "./ToolsSection.module.css";
import HomeHeading from "../heading/heading";
import { FaCalculator } from "react-icons/fa6";
import Link from "next/link";

const tools = [
  {
    icon: <FaCalculator />,
    title: "Smart Calculators",
    description: "Estimate potential returns, plan for your goals, and see how your money can grow over time.",
    link: "/tools/calculators"
  },
  {
    icon: <FaCalculator />,
    title: "Digital Onboarding",
    description: "Open your account online in minutes — completely paperless and hassle-free.",
    link: "/login"
  },
  {
    icon: <FaCalculator />,
    title: "Online Payments",
    description: "Pay mutual fund or insurance premiums securely and quickly, anytime",
    link: "/tools/pay-premium-online"
  },
  {
    icon: <FaCalculator />,
    title: "Quick Resources ",
    description: "Access all important forms, updates, and resources in one place for convenience.",
    link: "/tools/useful-links"
  },
  // {
  //   icon: <FaCalculator />,
  //   title: "Know Your Risk",
  //   description: "Check your risk comfort level with simple assessments to stay aligned with your investment approach.",
  //   link: "financial-health"
  // },
  {
  icon: <FaCalculator />,
  title: "Financial Health",
  description: "Evaluate your overall financial well-being with smart tools designed to guide better money decisions.",
  link: "/tools/financial-health"
}
,
  {
    icon: <FaCalculator />,
    title: "Fund Tracking",
    description: "Monitor mutual fund performance over time with clear, easy-to-read reports and insights.",
    link: "/performance/fund-performance"
  },
];


export default function ToolsSection() {
  return (
    <section className={` ${styles.wrapper} px-4`}>
      <div className="max-w-screen-xl mx-auto ">
        <div className={`${styles.toolswrapper}`}>

          {/* Top Header */}
          <div className="grid md:grid-cols-[40%_60%] gap-4 items-center">
            <HomeHeading title={`Investing <br /> Made Easy`} />
            <p className="text-black">
              Investing doesn’t have to be complicated. Our tools help you see your portfolio clearly, track investments in real time, and invest easily and confidently.
            </p>
          </div>

          {/* Grid of Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-10">
            {tools.map((tool, index) => (
              <div key={index} className={styles.toolCard}>
                {tool.link ? (
                  <Link 
                   href={`${tool?.link}`}
                  >
                    <p className="text-3xl text-[var(--rv-primary)]">{tool.icon}</p>
                    <h3 className={styles.toolTitle}>{tool.title}</h3>
                  </Link>
                ) : (
                  <div>
                    <p className="text-3xl text-[var(--rv-primary)]">{tool.icon}</p>
                    <h3 className={styles.toolTitle}>{tool.title}</h3>
                  </div>
                )}
                <p className={styles.toolDesc}>{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
