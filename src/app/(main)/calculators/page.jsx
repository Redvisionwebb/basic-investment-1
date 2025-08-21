"use client";

import styles from "./Calculators.module.css";
import InnerBanner from "@/components/innerBanner/InnerBanner";
import { motion } from "framer-motion";
import { useState } from "react";
import { Calculator } from "lucide-react";

export default function ContactUs() {
  const [activeTab, setActiveTab] = useState("calculators");

  const calculators = [
    { id: "sip", title: "SIP Calculator" },
    { id: "swp", title: "SWP Calculator" },
    { id: "marriage", title: "Marriage Planning Calculator", },
    { id: "stepup", title: "Step Up Calculator"},
    { id: "retirement", title: "Retirement Planning Calculator" },
    { id: "education", title: "Education Planning Calculator" },
    { id: "lumpsum", title: "Lumpsum Calculator"},
    { id: "delay", title: "Delay Planning Calculator" },
    { id: "house", title: "House Planning Calculator" },
    { id: "crorepati", title: "Crorepati Calculator" },
    { id: "lifeinsurance", title: "Life Insurance Calculator" },
    { id: "car", title: "Car Planning Calculator",  },
    { id: "stp", title: "STP Calculator"},
    { id: "emi", title: "EMI Calculator"},
    { id: "vacation", title: "Vacation Planning Calculator" },
  ];

  const lumpsum = [
    { id: "sip", title: "SIP Calculator" },
    { id: "stp", title: "STP Calculator" },
    { id: "swp", title: "SWP Calculator" },
    { id: "scheme", title: "Scheme Calculator" },
    { id: "fund", title: "Fund Calculator" },
  ];

  // Parent container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // delay between cards
      },
    },
  };

  // Card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className={styles.contactPage}>
      <InnerBanner title="Calculators" />
      <div className="px-4">
        <div className="max-w-screen-xl mx-auto section">
          <div className="flex flex-col gap-10 w-full ">
            
            <h3 className="font-semibold text-[var(--rv-primary)] text-center">Calculators</h3>
            <div className="bg-[var(--rv-bg-primary-light)] relative w-full rounded-xl">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {calculators.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={cardVariants}
                    className="flex gap-2 flex-col"
                  >
                    <div className="flex gap-2 items-center bg-white p-5 rounded-xl">
                      <Calculator className="text-[var(--rv-primary)]" size={30} />
                      <h3 className="font-medium text-xl text-[var(--rv-secondary)]">{item.title}</h3>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

            
            </div>

            <h3 className="font-semibold text-[var(--rv-primary)] text-center">Performance</h3>
            <div className="bg-[var(--rv-bg-primary-light)] relative w-full rounded-xl">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {lumpsum.map((item) => (
                 <motion.div
                    key={item.id}
                    variants={cardVariants}
                    className="flex gap-2 flex-col"
                  >
                    <div className="flex gap-2 items-center bg-white p-5 rounded-xl">
                      <Calculator className="text-[var(--rv-primary)]" size={30} />
                      <h3 className="font-medium text-xl text-[var(--rv-secondary)]">{item.title}</h3>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
