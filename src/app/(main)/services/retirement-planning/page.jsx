"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PiggyBank,
  Calendar,
  TrendingUp,
  Coins,
  ShieldCheck,
  BarChart,
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
const planTypes = [
  {
    icon: <PiggyBank size={40} />,
    title: "Pension Plans",
    text: "Steady income post-retirement through annuities and savings.",
  },
  {
    icon: <Calendar size={40} />,
    title: "Deferred Annuity",
    text: "Accumulate wealth during your working years for future payouts.",
  },
  {
    icon: <TrendingUp size={40} />,
    title: "Guaranteed Plans",
    text: "Assured returns with financial protection for your retirement.",
  },
  {
    icon: <Coins size={40} />,
    title: "Systematic Withdrawal Plan",
    text: "Regular withdrawals to support your lifestyle expenses.",
  },
  {
    icon: <BarChart size={40} />,
    title: "Market-Linked Plans",
    text: "Potential for higher growth with equity & debt mix.",
  },
  {
    icon: <ShieldCheck size={40} />,
    title: "Life Cover with Retirement",
    text: "Insurance protection along with retirement benefits.",
  },
];

const whyChoose = [
  {
    icon: <ShieldCheck size={40} />,
    text: "Financial independence during retirement years",
  },
  {
    icon: <TrendingUp size={40} />,
    text: "Grow wealth steadily while mitigating risks",
  },
  {
    icon: <Calendar size={40} />,
    text: "Plan early to enjoy compounding benefits",
  },
  {
    icon: <PiggyBank size={40} />,
    text: "Tax benefits on contributions under 80C & 10(10A)",
  },
  {
    icon: <Coins size={40} />,
    text: "Customizable payout options for flexible income",
  },
  {
    icon: <BarChart size={40} />,
    text: "Peace of mind with guaranteed income streams",
  },
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
            alt="Retirement Plan"
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
          <h1 className="font-bold text-[var(--rv-primary)] mb-4">
            Retirement Plans
          </h1>
          <p className="text-lg mb-4">
            A Retirement Plan helps you secure your financial future after your
            working years. It ensures a steady income, wealth growth, and peace
            of mind so you can live life on your terms.
          </p>
          <p className="text-lg">
            Early planning allows you to benefit from compounding, tax savings,
            and a stress-free retirement journey.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function PlanTypesSection() {
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
            Types of Retirement Plans
          </motion.h2>

          <motion.div
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {planTypes.map((plan, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                className="bg-[var(--rv-bg-primary-light)] shadow-md rounded-xl p-6 flex flex-col items-center text-center hover:scale-105"
              >
                <div className="text-[var(--rv-primary)] mb-3">{plan.icon}</div>
                <h5 className="font-bold mb-2">{plan.title}</h5>
                <p className="text-base">{plan.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function WhyChooseSection() {
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
          Why Choose a Retirement Plan
        </motion.h2>

        <motion.div
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {whyChoose.map((item, idx) => (
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
            Secure your golden years with the right Retirement Plan. Start today
            and enjoy financial freedom, peace of mind, and a worry-free future.
          </h6>
          <div>
            <Link href="/contact-us" className="btn btn-primary">
              Plan Your Retirement Today
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

// ================== Main Page ==================
export default function RetirementLanding() {
  return (
    <>
      <InnerBanner title="Retirement Plan" />
      <IntroSection />
      <PlanTypesSection />
      <WhyChooseSection />
      <CTASection />
    </>
  );
}
