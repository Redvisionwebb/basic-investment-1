"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BarChart,
  PieChart,
  Layers,
  Wallet,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import InnerBanner from "@/components/innerBanner/InnerBanner";

// ================== Variants ==================
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

// ================== Data ==================
const fundTypes = [
  { icon: <TrendingUp size={40} />, title: "Equity Funds", text: "Invest primarily in stocks for higher growth." },
  { icon: <ShieldCheck size={40} />, title: "Debt Funds", text: "Invest in fixed income securities like bonds and govt. securities." },
  { icon: <Layers size={40} />, title: "Hybrid Funds", text: "Combination of equity and debt for balanced risk and return." },
  { icon: <BarChart size={40} />, title: "Index Funds", text: "Track a specific index like Nifty or Sensex for passive returns." },
  { icon: <Wallet size={40} />, title: "Liquid Funds", text: "Invest in short-term instruments for liquidity and safety." },
  { icon: <PieChart size={40} />, title: "ELSS (Tax Saving Funds)", text: "Tax-saving fund with a 3-year lock-in under Section 80C." },
];

const whyInvest = [
  { icon: <ShieldCheck size={40} />, text: "Expert fund management & research-backed strategies" },
  { icon: <BarChart size={40} />, text: "Wide range of categories aligned to goals and risk appetite" },
  { icon: <Layers size={40} />, text: "Spreads risk through diversification across sectors" },
  { icon: <TrendingUp size={40} />, text: "Regular tracking and performance disclosures" },
  { icon: <Wallet size={40} />, text: "Start investing with as little as ₹500" },
  { icon: <PieChart size={40} />, text: "Transparent, regulated, and investor-friendly" },
];

// ================== Components ==================
function IntroSection() {
  return (
    <section className="bg-white px-4">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center section section-bottom">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.4 }}
          className="md:h-96 overflow-hidden rounded-2xl"
        >
          <Image
            src="/images/services/mutual.png"
            alt="Mutual Funds"
            width={500}
            height={350}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <h1 className="font-bold text-[var(--rv-primary)] mb-4">Mutual Funds</h1>
          <p className="text-lg mb-4">
            A Mutual Fund is a pooled investment vehicle managed by a professional
            fund manager. It collects money from many investors and invests it in
            diversified assets like stocks, bonds, or other securities.
          </p>
          <p className="text-lg">
            NAVs of schemes may fluctuate depending on market conditions. Past
            performance is not indicative of future returns.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function FundTypesSection() {
  return (
    <div className="px-4">
      <section className="section">
        <div className="max-w-screen-xl mx-auto">
          <motion.h2
            className="text-center font-bold mb-8"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Types of Mutual Funds
          </motion.h2>

          <motion.div
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {fundTypes.map((fund, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                className="bg-[var(--rv-bg-primary-light)] shadow-md rounded-xl p-6 flex flex-col items-center text-center hover:scale-105"
              >
                <div className="text-[var(--rv-primary)] mb-3">{fund.icon}</div>
                <h5 className="font-bold mb-2">{fund.title}</h5>
                <p className="text-base">{fund.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function WhyInvestSection() {
  return (
    <section className="bg-[var(--rv-bg-primary-light)] px-4">
      <div className="max-w-screen-xl mx-auto section">
        <motion.h2
          className="text-center font-bold mb-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Why Invest in Mutual Funds
        </motion.h2>

        <motion.div
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {whyInvest.map((item, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center hover:scale-105"
            >
              <div className="text-[var(--rv-primary)] mb-3">{item.icon}</div>
              <p className="text-lg">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <div className="section">
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className="bg-[var(--rv-bg-primary-light)] max-w-screen-xl mx-auto rounded-xl"
      >
        <div className="p-10 md:p-20 text-center flex flex-col gap-10 justify-center items-center">
          <h6>
            Mutual Funds offer flexibility, convenience, and the potential to grow
            your wealth over time. Let us help you choose the right fund to match
            your goals and risk profile.
          </h6>
          <div>
            <Link href="/contact-us" className="btn btn-primary">
              Start Investing in Mutual Funds
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

// ================== Main Page ==================
export default function MutualFundsLanding() {
  return (
    <>
      <InnerBanner title="Mutual Funds" />
      <IntroSection />
      <FundTypesSection />
      <WhyInvestSection />
      <CTASection />
    </>
  );
}
