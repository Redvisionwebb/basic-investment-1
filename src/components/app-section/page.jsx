"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import HomeHeading from "../landing/heading/heading";

const AppSectionNew = ({ siteData }) => {
  return (
    <section className="bg-[var(--rv-bg-white)] section py-16">
      <div className="max-w-screen-xl mx-auto px-4 md:px-10 grid md:grid-cols-2 items-center gap-12">

        {/* LEFT SIDE CONTENT */}
        <div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: false, amount: 0.3 }}
          className="space-y-6"
        >
         
           <HomeHeading title={`Everything You Need—In One Smart App`} center="true" />

          <p className="text-gray-600 text-lg leading-relaxed">
            Track your investments, monitor your goals, check portfolio updates,
            and access powerful tools—all from your phone.  
            <span className="font-semibold text-[var(--rv-primary)]">
              Fast. Secure. Easy.
            </span>
          </p>

          {/* QR + Buttons */}
          <div className="flex items-center gap-6 mt-5">

            {/* QR BOX */}
            <div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false, amount: 0.3 }}
              className="hidden md:flex flex-col items-center justify-center 
                         bg-white/80 backdrop-blur-lg shadow-lg border rounded-xl 
                         p-4 w-48 h-40"
            >
              <p className="text-sm font-medium text-gray-700 mb-2">Scan to Download</p>
              <Image
                src="/app-qr.png"
                width={110}
                height={110}
                alt="QR Code"
                className="rounded"
              />
            </div>

            {/* STORE BUTTONS */}
            <div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              viewport={{ once: false, amount: 0.3 }}
              className="flex flex-col gap-4"
            >
              <Link
                href={siteData?.appsplaystoreurl || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/Playstore.png"
                  alt="Play Store"
                  width={240}
                  height={60}
                  className="hover:scale-105 cursor-pointer transition-transform"
                />
              </Link>

              <Link
                href={siteData?.appsappleurl || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/Appstore.png"
                  alt="App Store"
                  width={240}
                  height={60}
                  className="hover:scale-105 cursor-pointer transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE PHONE IMAGE */}
      <div
  initial={{ opacity: 0, x: 60 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 1 }}
  viewport={{ once: false, amount: 0.3 }}
  className="relative flex justify-center items-center"
>
  {/* Animated Gradient Circle Background */}
  <div className="absolute inset-0 flex justify-center items-center">
    <div className="
      w-[350px] h-[350px] md:w-[450px] md:h-[450px]
      bg-gradient-to-b from-[var(--rv-primary-light)] via-[var(--rv-primary)] to-[var(--rv-primary-dark)]
      rounded-full blur-3xl opacity-70 halo-animation
    ">
    </div>
  </div>

  {/* Phone Image */}
  <Image
    src="/app-screen1.webp"
    alt="Mobile App"
    width={200}
    height={300}
    className="relative drop-shadow-2xl rounded-2xl z-10"
  />
</div>
      </div>
    </section>
  );
};

export default AppSectionNew;
