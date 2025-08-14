"use client";
import React from "react";
import styles from "./ToolsSection.module.css";
import HomeHeading from "../heading/heading";

const tools = [
  {
    icon: "images/icons/tools.svg",
    title: "Financial Calculators",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.",
  },
  {
    icon: "images/icons/tools.svg",
    title: "Paperless Onboarding",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.",
  },
  {
    icon: "images/icons/tools.svg",
    title: "Pay Premium Online",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.",
  },
  {
    icon: "images/icons/tools.svg",
    title: "Useful Links",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.",
  },
  {
    icon: "images/icons/tools.svg",
    title: "Risk Profile",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.",
  },
  {
    icon: "images/icons/tools.svg",
    title: "Fund Performance",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.",
  },
];

export default function ToolsSection() {
  return (
    <section className={`section ${styles.wrapper}`}>
      <div className="max-w-screen-xl mx-auto px-4">
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
                <img src={tool.icon} alt={tool.title} className={styles.icon} />
                <h3 className={styles.toolTitle}>{tool.title}</h3>
                <p className={styles.toolDesc}>{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
