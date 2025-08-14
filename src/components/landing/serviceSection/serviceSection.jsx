"use client";
import React, { useRef, useState } from "react";
import styles from "./ServicesSection.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import HomeHeading from "../heading/heading";

export default function ServicesSection({ services }) {
  const containerRef = useRef(null);

  const scrollBySlide = (direction) => { 
    const container = containerRef.current;
    const slideWidth = container?.firstChild?.offsetWidth || 0;
    if (!container) return;

    const scrollAmount = direction === "left" ? -slideWidth : slideWidth;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className={`${styles.ServiceSection} section`}>
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-10">
            <HomeHeading title={`Grow Smarter with Our Services`} center="true" />
          <p className="mt-2 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat.
          </p>
        </div>

        <div className={styles.sliderWrapper}>
          <button
            className={`${styles.arrow} ${styles.leftArrow}`}
            onClick={() => scrollBySlide("left")}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className={`${styles.arrow} ${styles.rightArrow}`}
            onClick={() => scrollBySlide("right")}
          >
            <ChevronRight size={20} />
          </button>

          <div className={styles.sliderContainer} ref={containerRef}>
            {services?.map((service, index) => (
              <motion.div
                key={index}
                className={styles.slide}
                whileHover={{ scale: 1.03 }}
              >
                <Link
                  href={`/services/${service.link}`}
                  className={styles.card}
                >
                  <div className={styles.cardInner}>
                    {/* <div
                                            className={styles.cardBg}
                                            style={{
                                                backgroundImage: `url(/images/services/${service.imageSrc})`,
                                            }}
                                        ></div> */}
                    <div
                      className={styles.cardBg}
                      style={{
                        backgroundImage: `url(/images/services/${service.imageSrc}.png)`,
                      }}
                    ></div>
                    <div className={styles.overlay}></div>
                    <div className={styles.cardContent}>
                      <h3>{service.name}</h3>
                      <p>{service.description}</p>
                      <span className={styles.hoverArrow}>
                        <ChevronRight size={20} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
