"use client";
import React from "react";
import styles from "./ToolsSection.module.css";
import HomeHeading from "../heading/heading";
import { FaCalculator } from "react-icons/fa6";
import Link from "next/link";

const tools = [
  {
    icon: <FaCalculator />,
    title: "Financial Calculators",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.",
    link: "calculators"
  },
  {
    icon: <FaCalculator />,
    title: "Risk Profile",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.",
    link: "risk-profile"
  },
  {
    icon: <FaCalculator />,
    title: "Pay Premium Online",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.",
    link: "pay-premium-online"
  },
  {
    icon: <FaCalculator />,
    title: "Useful Links",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.",
    link: "useful-links"
  },
  {
    icon: <FaCalculator />,
    title: "Financial Health",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.",
    link: "financial-health"
  },
  {
    icon: <FaCalculator />,
    title: "Fund Performance",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.",
    link: "fund-performance"
  },
];


export default function ToolsSection() {
  return (
    <section className={` ${styles.wrapper} px-4`}>
      <div className="max-w-screen-xl mx-auto ">
        <div className={`${styles.toolswrapper}`}>

          {/* Top Header */}
          <div className="grid md:grid-cols-[40%_60%] gap-4 items-center">
            <HomeHeading title={`Investing <br /> Made Simple`} />
            <p className="text-black">
              Investing made easy with smart and simple tools that break down complexity, give you real-time visibility into your portfolio, and let you invest with confidence.
            </p>
          </div>

          {/* Grid of Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-10">
            {tools.map((tool, index) => (
              <div key={index} className={styles.toolCard}>
                {tool.link ? (
                  <Link 
                   href={`/tools/${tool.link}`}
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
