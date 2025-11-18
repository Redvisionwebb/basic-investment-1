"use client";
import styles from "./Hero.module.css";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection({ statsdata }) {

  // Convert incoming statsdata into required format
  const stats = useMemo(() => {
    if (!Array.isArray(statsdata)) return [];

    // OPTIONAL: sort to render in a fixed order
    const order = ["Happy Clients", "Investments Assisted", "Years of Experience"];

    return statsdata
      .sort((a, b) => order.indexOf(a.title) - order.indexOf(b.title))
      .map((item) => ({
        label: item.title,
        value: Number(item.statsNumber) || 0,
        prefix: item.description || "", // "Cr" or empty
      }));
  }, [statsdata]);

  const [counts, setCounts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideHeight, setSlideHeight] = useState(240);

  const slideImages = [
    "/images/banner/01.png",
    "/images/banner/01.png",
    "/images/banner/01.png",
  ];

  // Counter Animation
  useEffect(() => {
    if (!stats.length) return;

    setCounts(stats.map(() => 0));

    const duration = 2000;
    const interval = 20;
    const steps = duration / interval;
    const increments = stats.map((stat) => Math.ceil(stat.value / steps));

    const counterInterval = setInterval(() => {
      setCounts((prev) =>
        prev.map((count, i) => {
          const next = count + increments[i];
          return next < stats[i].value ? next : stats[i].value;
        })
      );
    }, interval);

    return () => clearInterval(counterInterval);
  }, [stats]);

  // Auto Slider
  useEffect(() => {
    const sliderInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 3000);
    return () => clearInterval(sliderInterval);
  }, []);

  // Responsive Slide Height
  useEffect(() => {
    const updateHeight = () => {
      setSlideHeight(window.innerWidth < 640 ? 180 : 240);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const handleClickSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideImages.length);
  };

  return (
    <section className={`${styles.heroSection} px-4`}>
      <div className="max-w-screen-xl mx-auto section">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">

          {/* LEFT CONTENT */}
          <div className="space-y-6">
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${styles.heading}`}
            >
              Invest Today.
              <br />
              Build Tomorrow
            </h1>

            <p className={styles.description}>
              Contrary to popular belief, investing can be simple when you have the right partner along.
            </p>

            <div className={`${styles.CtaSections} w-full`}>
              <div className="flex flex-wrap justify-center gap-4 w-full">

                {/* Dynamic Stats */}
                {stats.map((stat, i) => (
                  <div key={i} className={styles.statBox}>
                    <p className="text-4xl font-bold text-[var(--rv-primary)]">
                      {counts[i]}+ {stat.prefix}
                    </p>
                    <p className={styles.statLabel}>{stat.label}</p>
                  </div>
                ))}

              </div>

              <div className="flex justify-center">
                <Link className="btn btn-primary" href="/login">
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT BANNER */}
          <div className={styles.banner}>
            <Image
              src="/images/banner/banner.png"
              alt="Hero Image"
              layout="fill"
              className={styles.bannerImg}
            />

            {/* Slider */}
            <div
              onClick={handleClickSlide}
              className="absolute top-5 left-5 sm:left-10 w-[250px] sm:w-[320px] h-[180px] sm:h-[240px] rounded-lg overflow-hidden cursor-pointer"
            >
              <motion.div
                className={`h-full ${styles.sliderBanner}`}
                initial={false}
                animate={{ y: -currentSlide * slideHeight }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
              >
                {slideImages.map((img, index) => (
                  <div key={index} className="w-full h-full">
                    <img
                      src={img}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-full object-contain rounded-md"
                    />
                  </div>
                ))}
              </motion.div>
            </div>

            <h2 className={styles.heroHeading}>
              Mutual Funds <span className={styles.vs}>vs</span> Traditional Investments
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
