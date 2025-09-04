"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HeartPulse,
  Car,
  Home,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";
import InnerBanner from "@/components/innerBanner/InnerBanner";
import { FaUserShield } from "react-icons/fa6";

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
const insuranceTypes = [
  { icon: <HeartPulse size={40} />, title: "Health Insurance", text: "Covers medical expenses and hospitalization costs." },
  { icon: <FaUserShield size={40} />, title: "Life Insurance", text: "Provides financial protection to your family in case of uncertainty." },
  { icon: <Car size={40} />, title: "Motor Insurance", text: "Protects your vehicle against accidents, theft, and damages." },
  { icon: <Home size={40} />, title: "Home Insurance", text: "Secures your home against natural disasters and accidents." },
  { icon: <Wallet size={40} />, title: "Travel Insurance", text: "Coverage for medical emergencies, trip cancellations, and loss of baggage." },
  { icon: <ShieldCheck size={40} />, title: "Term Insurance", text: "Affordable long-term financial security for your loved ones." },
];

const whyInsurance = [
  { icon: <FaUserShield size={40} />, text: "Protects you and your family against financial uncertainties" },
  { icon: <HeartPulse size={40} />, text: "Covers rising medical and healthcare expenses" },
  { icon: <Car size={40} />, text: "Mandatory coverage for vehicles ensures safety on the road" },
  { icon: <ShieldCheck size={40} />, text: "Provides peace of mind and financial stability" },
  { icon: <Home size={40} />, text: "Safeguards valuable assets like home and property" },
  { icon: <Wallet size={40} />, text: "Ensures long-term wealth protection and tax benefits" },
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
            src="/images/services/insurance.png"
            alt="Insurance"
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
          <h1 className="font-bold text-[var(--rv-primary)] mb-4">Insurance</h1>
          <p className="text-lg mb-4">
            Insurance is a safety net that protects you and your loved ones
            from unexpected financial burdens. From health to life, vehicle,
            and property – insurance ensures peace of mind and financial stability.
          </p>
          <p className="text-lg">
            It helps you prepare for uncertainties and offers long-term
            security through affordable premiums and comprehensive coverage.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function InsuranceTypesSection() {
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
            Types of Insurance
          </motion.h2>

          <motion.div
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {insuranceTypes.map((insurance, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                className="bg-[var(--rv-bg-primary-light)] shadow-md rounded-xl p-6 flex flex-col items-center text-center hover:scale-105"
              >
                <div className="text-[var(--rv-primary)] mb-3">{insurance.icon}</div>
                <h5 className="font-bold mb-2">{insurance.title}</h5>
                <p className="text-base">{insurance.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function WhyInsuranceSection() {
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
          Why Buy Insurance
        </motion.h2>

        <motion.div
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {whyInsurance.map((item, idx) => (
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
            Insurance is not just a policy – it’s a promise of protection. 
            Secure your health, life, and assets with the right insurance plan today.
          </h6>
          <div>
            <Link href="/contact-us" className="btn btn-primary">
              Get Insured Today
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

// ================== Main Page ==================
export default function InsuranceLanding() {
  return (
    <>
      <InnerBanner title="Insurance" />
      <IntroSection />
      <InsuranceTypesSection />
      <WhyInsuranceSection />
      <CTASection />
    </>
  );
}
