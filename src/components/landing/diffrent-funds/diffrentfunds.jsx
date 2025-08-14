"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./DiffrentFunds.module.css";
import Link from "next/link";
import {
  Banknote,
  Vault,
  Gem,
  LineChart,
} from "lucide-react"; // Lucide fallback icons
import HomeHeading from "../heading/heading";

// Utility functions (unchanged)
const calculateCompoundInterest = (monthly, years, rate) => {
  if (monthly === 0 || rate === 0 || years === 0) return 0;
  const r = rate / 100 / 12;
  const n = years * 12;
  return Math.round(monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r)));
};

const calculateSavingReturn = (monthlyAmount, rate, years) => {
  if (monthlyAmount === 0 || rate === 0 || years === 0) {
    return { investment: 0, interest: 0, final: 0 };
  }

  const months = years * 12;
  let totalInterest = 0;

  for (let i = 0; i < months; i++) {
    const remainingMonths = months - i;
    const interest = monthlyAmount * rate * (remainingMonths / 12);
    totalInterest += interest;
  }

  const totalInvestment = monthlyAmount * months;
  const finalAmount = totalInvestment + totalInterest;

  return {
    investment: totalInvestment,
    interest: totalInterest,
    final: finalAmount,
  };
};

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

const updateSliderBackground = (input) => {
  const el = input?.target || input;
  if (!el) return;
  const min = parseFloat(el.min) || 0;
  const max = parseFloat(el.max) || 100;
  const val = ((parseFloat(el.value) - min) / (max - min)) * 100;
  el.style.background = `linear-gradient(to right, var(--rv-primary) 0%, var(--rv-primary) ${val}%, #d1d5db ${val}%, #d1d5db 100%)`;
};

const DiffrentFunds = () => {
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(10);

  const monthlyRef = useRef(null);
  const yearsRef = useRef(null);

  useEffect(() => {
    if (monthlyRef.current) updateSliderBackground(monthlyRef.current);
    if (yearsRef.current) updateSliderBackground(yearsRef.current);
  }, [monthly, years]);

  const funds = [
    {
      name: "Saving Account",
      rate: 3,
      type: "simple",
      icon: "/icons/saving.png",
      fallbackIcon: <Banknote size={20} />,
    },
    {
      name: "Fixed Deposit",
      rate: 6,
      type: "compound",
      icon: "/icons/fd.png",
      fallbackIcon: <Vault size={20} />,
    },
    {
      name: "Gold",
      rate: 9,
      type: "compound",
      icon: "/icons/gold.png",
      fallbackIcon: <Gem size={20} />,
    },
    {
      name: "Mutual Fund",
      rate: 15,
      type: "compound",
      icon: "/icons/mutualfund.png",
      fallbackIcon: <LineChart size={20} />,
    },
  ];

  const calculateFundReturn = (monthly, years, rate, type) => {
    return type === "simple"
      ? calculateSavingReturn(monthly, rate / 100, years).final
      : calculateCompoundInterest(monthly, years, rate);
  };

  return (
    <section className={`${styles.diffrentFunds} section`}>
      <div className={`${styles.container} max-w-screen-xl mx-auto px-4 ${styles.innerDiffrance}`}>
        <HomeHeading title={`Returns That Make a Difference`} center="true" />
        {/* Input Controls */}
        <div className={styles.controlsGrid}>
          {/* Monthly Amount */}
          <div className={styles.sliderBox}>
            <div className={styles.labelRow}>
              <label className={styles.label} htmlFor="monthly">
                Monthly Invested Amount
              </label> 
              <input
                type="number"
                id="monthly"
                min="0"
                max="100000"
                step="1"
                value={monthly}
                onChange={(e) => {
                  let val = parseInt(e.target.value);
                  if (isNaN(val) || val < 0) val = 0;
                  if (val > 50000) val = 50000;
                  setMonthly(val);
                }}
                className={styles.valueInput}
              />
            </div>
            <input
              ref={monthlyRef}
              type="range"
              min="0"
              max="100000"
              step="1"
              value={monthly}
              onChange={(e) => {
                setMonthly(parseInt(e.target.value));
                updateSliderBackground(e);
              }}
              className={styles.rangeSlider}
            />
          </div>

          {/* Years */}
          <div className={styles.sliderBox}>
            <div className={styles.labelRow}>
              <label className={styles.label} htmlFor="years">
                Time Period (in years)
              </label>
              <input
                type="number"
                id="years"
                min="0"
                max="30"
                step="1"
                value={years}
                onChange={(e) => {
                  let val = parseInt(e.target.value);
                  if (isNaN(val) || val < 0) val = 0;
                  if (val > 30) val = 30;
                  setYears(val);
                }}
                className={styles.valueInput}
              />
            </div>
            <input
              ref={yearsRef}
              type="range"
              min="0"
              max="30"
              step="1"
              value={years}
              onChange={(e) => {
                setYears(parseInt(e.target.value));
                updateSliderBackground(e);
              }}
              className={styles.rangeSlider}
            />
          </div>
        </div>

        {/* Fund Comparison Cards */}
        <div className={styles.fundGrid}>
          {funds.map((fund, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.iconWithText}>
                {/* <img
                  src={fund.icon}
                  alt={fund.name}
                  className={{ display: "none" }}
                  // {styles.fundIcon}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextSibling.style.display = "block";
                  }}
                /> */}
                <div className="text-[var(--rv-primary)]" >{fund.fallbackIcon}</div>
                <h4 className={styles.fundName}>{fund.name}</h4>
              </div>
              <p className={styles.amount}>
                ₹{" "}
                {formatINR(
                  calculateFundReturn(monthly, years, fund.rate, fund.type)
                )}
              </p>
              <p className={styles.rate}>(with {fund.rate}% return)</p>
            </div>
          ))}
        </div>

        {/* Summary */}
        <p className={styles.note}>
          If you build a personalized plan with a certified Mutual Fund
          Distributor (MFD), your expected returns could reach up to 15%
          annually turning ₹{formatINR(monthly)}/month into nearly ₹
          {formatINR(calculateCompoundInterest(monthly, years, 15))} in {years}{" "}
          years.
        </p>

        <div className={styles.btnWrap}>
          <Link href="/login" className="btn btn-primary">
            Begin My Investment
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DiffrentFunds;
