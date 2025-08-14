"use client";
import React, { useState } from "react";
import styles from "./TrustedSection.module.css";
import Link from "next/link";
import HomeHeading from "../heading/heading";

const accordionData = [
  {
    title: "First Field Title",
    content: "This is the description for the first field.",
  },
  {
    title: "Second Field Title",
    content: "This is the description for the second field.",
  },
  {
    title: "Third Field Title",
    content: "This is the description for the third field.",
  },
];

export default function TrustedSection() {
  const [activeIndex, setActiveIndex] = useState(0); // Default open first

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className={`${styles.partnerWrapper} section`}>
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side */}
          <div className="flex flex-col gap-4">
             <HomeHeading title={`Your Trusted
              <br /> Financial Partners`} />
            <p className={styles.description}>
              We believe every investor should understand their financial
              journey. That’s why we focus on educating, empowering, and guiding
              with full transparency and integrity — earning the trust of
              hundreds of clients.
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
