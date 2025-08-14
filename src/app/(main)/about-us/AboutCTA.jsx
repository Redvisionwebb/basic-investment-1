"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./AboutUs.module.css";

export default function AboutCTA() {
    return (
        <div className="main-section bg-white">
            <div className="max-w-screen-xl mx-auto">
                <div className={styles.ctaSection}>
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className={styles.contentWrapper}
                    >
                        <h2 className={styles.heading}>
                            Start Your Journey to Financial Freedom Today
                        </h2>
                        <p className={styles.subtext}>
                            At <strong>Srivesh Management Services</strong>, we guide you with trusted advice and customized investment solutions to help you grow, protect, and achieve your financial goals.
                        </p>
                        <Link href="/contact-us">
                            <button className={`${styles.primaryButton}`}>Get Started</button>
                        </Link>
                    </motion.section>
                </div>
            </div>
        </div>

    );
}
