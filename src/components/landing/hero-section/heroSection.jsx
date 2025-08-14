"use client";
import styles from "./Hero.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  const stats = [
    { label: "Happy Clients", value: 10000, prefix: "" },
    { label: "Financial Plans", value: 500, prefix: "cr" },
    { label: "Years of Experience", value: 5000, prefix: "" },
  ];

  const [counts, setCounts] = useState(stats.map(() => 0));
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideHeight, setSlideHeight] = useState(240); // Responsive height
  const slideImages = [
    "/images/banner/01.png",
    "/images/banner/01.png",
    "/images/banner/01.png",
  ];

  // Counter Animation
  useEffect(() => {
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
  }, []);

  // Auto Slider
  useEffect(() => {
    const sliderInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 3000);
    return () => clearInterval(sliderInterval);
  }, [slideImages.length]);

  // Responsive Slide Height
  useEffect(() => {
    const updateHeight = () => {
      if (typeof window !== "undefined") {
        setSlideHeight(window.innerWidth < 640 ? 180 : 240);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const handleClickSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideImages.length);
  };

  return (
    <section className={`${styles.heroSection}`}>
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Left Section */}
          <div className="space-y-6">
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${styles.heading}`}
            >
              Simple Investing.
              <br />
              Smart Returns
            </h1>

            <p className={`${styles.description}`}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
              nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam
              erat volutpat.
            </p>

            <div className={`${styles.CtaSections} w-full`}>
              <div className="flex flex-wrap justify-center gap-4 w-full">
                {stats.map((stat, i) => (
                  <div key={i} className={`${styles.statBox}`}>
                    <p className="text-4xl font-bold text-[var(--rv-primary)]">
                      {counts[i]}+ {stat.prefix}
                    </p>
                    <p className={styles.statLabel}>{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <Link className="btn btn-primary" href="#!">
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div
            className={` ${styles.banner}`}
          >
            {/* Background Image */}
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

            {/* Heading on Image - Bottom Left */}
            <h2 className={styles.heroHeading}>
              Mutual Funds <span className={`${styles.vs}`}>vs</span> Traditional Investments
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
