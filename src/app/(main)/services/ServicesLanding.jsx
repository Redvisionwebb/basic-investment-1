"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import InnerBanner from "@/components/innerBanner/InnerBanner";



const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
};

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
};

// Intro section
function IntroSection({ data }) {
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
                        src={data.image?.url || "/images/services/mutual.png"}
                        alt={data.name}
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
                    <h1 className="font-bold text-[var(--rv-primary)] mb-4">{data.name}</h1>
                    <div
                        className="text-lg mb-4"
                        dangerouslySetInnerHTML={{ __html: data.description }}
                    />
                </motion.div>
            </div>
        </section>
    );
}

// Benefits section
function BenefitsSection({ data }) {
    const benefits = data.benefits || [];
    if (!benefits.length) return null;

    return (
        <section className="px-4 ">
            <div className="max-w-screen-xl mx-auto section">
                <motion.h2
                    className="text-center font-bold mb-8"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    Types of Mutual Funds
                </motion.h2>

                <motion.div
                    className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
                    variants={container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {benefits.map((item) => (
                        <motion.div
                            key={item._id}
                            variants={fadeUp}
                            transition={{ duration: 0.6 }}
                            className="bg-[var(--rv-bg-primary-light)] shadow-md rounded-xl p-6 flex flex-col items-center text-center hover:scale-105"
                        >
                            {item.icon?.url && (
                                <Image src={item.icon.url} alt={item.title} width={60} height={60} className="mb-3" />
                            )}
                            <h5 className="font-bold mb-2">{item.title}</h5>
                            <p
                                className="text-base"
                                dangerouslySetInnerHTML={{ __html: item.description }}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

// Features section
function FeaturesSection({ data }) {
    const features = data.features || [];
    if (!features.length) return null;

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
                    Why Invest in {data.name}
                </motion.h2>

                <motion.div
                    className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
                    variants={container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {features.map((item) => (
                        <motion.div
                            key={item._id}
                            variants={fadeUp}
                            transition={{ duration: 0.6 }}
                            className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center text-center hover:scale-105"
                        >
                            {item.icon?.url && (
                                <Image src={item.icon.url} alt={item.title} width={50} height={50} className="mb-3" />
                            )}
                            <h5 className="font-bold mb-2">{item.title}</h5>
                            <p
                                className="text-lg"
                                dangerouslySetInnerHTML={{ __html: item.description }}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

// Call-to-action section
function CTASection({ data }) {
    return (
        <section className="px-4">
            <div className="section">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="bg-[var(--rv-bg-primary-light)] max-w-screen-xl mx-auto rounded-xl"
                >
                    <div className="p-10 md:p-20 text-center flex flex-col gap-10 justify-center items-center">
                        <h6 className="text-lg">
                            {data.ctaText ||
                                `Mutual Funds offer flexibility, convenience, and the potential to grow your wealth over time. Let us help you choose the right fund to match your goals and risk profile.`}
                        </h6>
                        <div>
                            <Link href="/contact-us" className="btn btn-primary">
                                Start Investing in {data.name}
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default function ServicesLanding({ data }) {
    return (
        <>
            <InnerBanner title={data?.name || "Service"} />
            <IntroSection data={data} />
            <BenefitsSection data={data} />
            <FeaturesSection data={data} />
            <CTASection data={data} />
        </>
    );
}
