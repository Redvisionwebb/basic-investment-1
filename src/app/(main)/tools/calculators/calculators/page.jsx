"use client";

import styles from "./Calculators.module.css";
import InnerBanner from "@/components/innerBanner/InnerBanner";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import { calculator,planning, performance } from "@/data/calculators";
import Link from "next/link";

export default function AllCalculator() {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
                {calculator.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={cardVariants}
                    className="flex gap-2 flex-col"
                  >
                    <Link href={item.route}>
                      <div className="flex gap-2 items-center bg-white p-5 rounded-xl">
                        <Calculator className="text-[var(--rv-primary)]" size={30} />
                        <h3 className="font-medium text-xl text-[var(--rv-secondary)]">{item.title}</h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>


            </div>

   <h3 className="font-semibold text-[var(--rv-primary)] text-center">Planning</h3>
            <div className="bg-[var(--rv-bg-primary-light)] relative w-full rounded-xl">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {planning.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={cardVariants}
                    className="flex gap-2 flex-col"
                  >
                    <Link href={item.route}>
                      <div className="flex gap-2 items-center bg-white p-5 rounded-xl">
                        <Calculator className="text-[var(--rv-primary)]" size={30} />
                        <h3 className="font-medium text-xl text-[var(--rv-secondary)]">{item.title}</h3>
                      </div>
                    </Link>
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
                {performance.map((item,index) => (
                  <motion.div
                    key={index+1}
                    variants={cardVariants}
                    className="flex gap-2 flex-col"
                  >

                    <Link href={item.route}>
                      <div className="flex gap-2 items-center bg-white p-5 rounded-xl">
                        <Calculator className="text-[var(--rv-primary)]" size={30} />
                        <h3 className="font-medium text-xl text-[var(--rv-secondary)]">{item.title}</h3>
                      </div>
                    </Link>
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
