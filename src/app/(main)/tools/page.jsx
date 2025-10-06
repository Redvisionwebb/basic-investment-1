"use client";
import styles from "./tools.module.css";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

const TopFeatures = () => {
  const cardData = [
    // {
    //   animation: "fade-right",
    //   link: "/tools/downloadforms",
    //   title: "Download Form",
    //   images: "/ourfeature1.svg",
    // },
    {
      animation: "fade-up",
      link: "/tools/calculators",
      title: "Financial Calculator",
      images: "/Services/calculator.jpg",
    },
    {
      animation: "fade-up",
      link: "/tools/financial-health",
      title: "Financial Health",
      images: "/ourfeature3.svg",
    },
    {
      link: "/tools/risk-profile",
      animation: "fade-right",
      title: "Risk Profile",
      images: "/ourfeature4.svg",
    },
    {
      link: "/tools/pay-premium-online",
      animation: "fade-right",
      title: "Pay Premium Online",
      images: "/ourfeature5.svg",
    },
    {
      link: "/tools/useful-links",
      animation: "fade-right",
      title: "Useful Links",
      images: "/ourfeature6.svg",
    },
     {
      animation: "fade-right",
      link: "/performance/fund-performance",
      title: "Fund Performance",
      images: "/ourfeature1.svg",
    },
  ];
  return (
    <div className={styles.ourFeature}>
      <div className="container mx-auto px-2  lg:px-24 xl:px-32 py-10">
        <div className="grid-cols-2 section-row flex flex-col md:flex-row justify-between  md:pr-5 mb-10 text-black align-items-center">
          <div>
            <div className="section-title dark-section">
              <h3 className="wow fadeInUp text-4xl mb-2">Our Feature</h3>
              {/* <Breadcrumb>
                <BreadcrumbList className="text-black text-center items-center">
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      className="text-center items-center text-black"
                      href="/"
                    >
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-black" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Tools</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb> */}
              <h2 className="text-anime-style-2 text-xl" data-cursor="-opaque">
                Key features of our finance <span>and consulting</span>
              </h2>
            </div>
          </div>
          <div>
            <div className="section-btn wow fadeInUp" data-wow-delay="0.2s">
              <Link href="/contactus"><Button className="bg-[var(--rv-primary)] text-white">Contact Now</Button></Link>
            </div>
          </div>
        </div>

        <div className={styles.ourFeatureList}>
          {cardData?.map((item, index) => (
            <div
              key={index}
              className={`${styles.ourFeatureItem} wow fadeInUp bg-[var(--rv-secondary)]`}
              data-wow-delay={`${index * 0.2}s`}
            >
              <Link href={item.link}>
                {/* <div className={styles.iconBox}>
                  <Image
                    src={item.images}
                    alt="Feature Icon"
                    width={600}
                    height={600}
                    layout="response"
                  />
                </div> */}
                <div className={styles.featureItemContent}>
                  <h3>{item.title}</h3>
                  <p>
                    Our Financial Solutions offer tailored strategies to meet
                    your unique goals, focusing on growth and risk management.
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* <div className={styles.ourFeatureFooter}>
          <p>
            <span>Free</span> Let&apos;s make something great work together.{" "}
            <Link className="text-[var(--rv-primary)]" href="/contact">Get Free Quote</Link>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default TopFeatures;
