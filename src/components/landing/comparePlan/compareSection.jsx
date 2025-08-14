"use client";
import React from "react";
import styles from "./ComparePlansSection.module.css";
import HomeHeading from "../heading/heading";

const comparisons = [
  {
    left: "Do-it-yourself – fund selection, tracking, rebalancing",
    right: "Expert guidance from MFDs at every step.",
    icon: "/icons/guidance.svg",
  },
  {
    left: "Lower expense ratio (no commission).",
    right: "Slightly higher cost (includes MFD fee).",
    icon: "/icons/expense.svg",
  },
  {
    left: "Requires time, research, and effort.",
    right: "MFDs handle KYC, paperwork, tracking.",
    icon: "/icons/effort.svg",
  },
  {
    left: "No tailored advice.",
    right: "Investments aligned to your goals and risk profile.",
    icon: "/icons/advice.svg",
  },
  {
    left: "Easy to panic or exit early.",
    right: "MFDs ensure long-term discipline.",
    icon: "/icons/discipline.svg",
  },
  {
    left: "~40% of retail investors use Direct plans.",
    right: "~60% prefer Regular plans for handholding.",
    icon: "/icons/stats.svg",
  },
];

export default function ComparePlansSection() {
  return (
    <section className={`${styles.comparesection} section`}>
      <div className="max-w-screen-xl mx-auto px-4">
        <HomeHeading title={`Invest Smart: Direct vs Regular Plans`} center="true" />
        
        <div className={styles.gridHeader}>
          <div className={styles.columnHeading}>Without MFD</div>
          <div className={styles.columnHeading}>With MFD</div>
        </div>

        <div className={styles.comparisonGrid}>
          {comparisons.map((item, index) => (
            <div className={styles.row} key={index}>
              <div className={styles.cellLeft}>{item.left}</div>
              <div className={styles.iconWrapper}>
                <div className={styles.iconCircle}>
                  <img src="/images/plan/plan.svg" alt="icon" />
                </div>
              </div>
              <div className={styles.cellRight}>{item.right}</div>
            </div>
          ))}
        </div>

        <div className={styles.bottomBox}>
          <h3>Why Choose Regular Plans via an MFD?</h3>
          <p>
            Most Indian investors still trust MFDs because investments aren’t just about choosing funds — they’re about{" "}
            <strong>understanding goals, managing risks, and staying on track.</strong>
          </p>
          <button className="btn btn-primary mt-4">Get Started</button>
        </div>
      </div>
    </section>
  );
}
