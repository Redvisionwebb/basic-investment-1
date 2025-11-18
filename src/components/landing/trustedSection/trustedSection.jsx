"use client";
import React, { useState } from "react";
import styles from "./TrustedSection.module.css";
import Link from "next/link";
import HomeHeading from "../heading/heading";

const accordionData = [
  {
    title: "Easy Investment Access",
    content: "Invest in mutual funds through SIPs or lump sum quickly and securely through our platform.",
  },
  {
    title: "Transparent Processes",
    content: "Stay informed with clear updates, statements, and reports about your investments.",
  },
  {
    title: "Track Your Progress",
    content: "Monitor your investments easily and see how your portfolio grows over time.",
  },
];

export default function TrustedSection() {
  const [activeIndex, setActiveIndex] = useState(0); // Default open first

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className={`${styles.partnerWrapper}  px-4`}>
      <div className="max-w-screen-xl mx-auto section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side */}
          <div className="flex flex-col gap-4">
             <HomeHeading title={`Your Trusted
              <br /> Financial Partners`} />
            <p className={styles.description}>
              Investing doesn’t have to be complicated. By keeping everything simple, transparent, and reliable, we help clients feel confident and comfortable in their financial journey.
            </p>

            <div className={styles.accordion}>
              {accordionData.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <div
                    key={index}
                    className={`${styles.accordionItem} ${
                      isActive ? styles.active : ""
                    }`}
                    onClick={() => toggleAccordion(index)}
                  >
                    <div className={styles.accordionHeader}>
                      <span className={styles.dot}></span>
                      <h3>{item.title}</h3>
                    </div>
                    {isActive && (
                      <div className={styles.accordionContent}>
                        <p>{item.content}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={styles.btnWrapper}>
              <Link href="/login" className="btn btn-primary">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex justify-center items-center flex justify-center h-full">
            <img
              src="/images/partner.jpg"
              alt="Trusted Illustration"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
