"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import styles from "./AwardsSection.module.css";
import HomeHeading from "../heading/heading";

const awardCards = [
  {
    id: 1,
    title: "Certificate of Appreciation by Bajaj Finserv",
    logo: "/images/awards/bajaj.png",
    badge: "/images/awards/awards.png",
  },
  {
    id: 2,
    title: "Certificate of Achievement by HDFC Life",
    logo: "/images/awards/bajaj.png",
    badge: "/images/awards/awards.png",
  },
  {
    id: 3,
    title: "Top Wealth Advisor Award",
    logo: "/images/awards/bajaj.png",
    badge: "/images/awards/awards.png",
  },
];

export default function AwardsSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % awardCards.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const current = awardCards[index];
  const next = awardCards[(index + 1) % awardCards.length];

  return (
    <section className={`${styles.sectionWrapper} section`}>
      <div className="max-w-screen-xl mx-auto px-4">
         <HomeHeading title={`Recognized for Excellence`} center="true" />
        <div
          className={`flex flex-col md:flex-row items-center md:items-start p-6 md:p-12 rounded-xl ${styles.contentBox}`}
        >
          {/* LEFT SIDE */}
          <div className="md:basis-2/5 w-full space-y-4 z-10 text-center md:text-left">
            <h2 className={styles.leftHeading}>Achievements That Build Trust</h2>
            <p className={styles.leftDescription}>
              Our consistent dedication to client success has earned us industry
              awards and recognition. These honors reflect our commitment to
              ethical practices, innovative strategies, and real results for every
              investor.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="md:basis-3/5 w-full relative flex items-center justify-center h-[260px] sm:h-[320px] mt-8 md:mt-0">
            <div className="relative flex items-center gap-6 sm:gap-12">
              <AnimatePresence mode="popLayout">
                {/* Current Card */}
                <motion.div
                  key={`main-${current.id}`}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, info) => {
                    if (info.offset.x < -50) {
                      setIndex((prev) => (prev + 1) % awardCards.length);
                    } else if (info.offset.x > 50) {
                      setIndex((prev) => (prev - 1 + awardCards.length) % awardCards.length);
                    }
                  }}
                  initial={{ x: 60, opacity: 0, scale: 0.9 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ x: -80, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="z-20 w-[90%] max-w-[240px] h-[260px] sm:h-[300px] bg-white p-2 shadow-xl rounded-xl flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
                >
                  <Image
                    src={current.logo}
                    alt={current.title}
                    width={60}
                    height={60}
                    className="mb-4"
                  />
                  <h4 className={`text-xl ${styles.cardTitle}`}>{current.title}</h4>
                  <Image
                    src={current.badge}
                    alt="Award Badge"
                    width={80}
                    height={80}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Next Card (hidden on mobile) */}
              <motion.div
                key={`next-${next.id}`}
                initial={{ x: 80, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, opacity: 0.6, scale: 0.9 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="hidden sm:flex z-10 w-[160px] h-[200px] p-2 bg-white shadow-md rounded-xl flex-col items-center justify-center"
              >
                <Image
                  src={next.logo}
                  alt={next.title}
                  width={40}
                  height={40}
                  className="mb-2"
                />
                <h6 className={`text-sm ${styles.cardTitle}`}>{next.title}</h6>
                <Image
                  src={next.badge}
                  alt="Award Badge"
                  width={60}
                  height={60}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
