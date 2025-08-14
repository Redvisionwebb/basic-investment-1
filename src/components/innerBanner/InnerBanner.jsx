"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import styles from "./InnerBanner.module.css"

const InnerBanner = ({ pageName, showBreadcrumb = true }) => {
    return (
        <div className={styles.bannerWrapper}>
            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={styles.bannerContent}
            >
                <div className={styles.textContainer}> 
                    <h1 className={styles.heading}>{pageName}</h1>
                    {showBreadcrumb && (
                        <div className={styles.breadcrumb}>
                            <Link href="/" className={styles.breadcrumbLink}>
                                Home
                            </Link>
                            <span className={styles.breadcrumbSeparator}>/</span>
                            <span className={styles.breadcrumbCurrent}>{pageName}</span>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Animated Blobs */}
            <motion.div
                className={styles.blobPrimary}
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
                className={styles.blobThird}
                animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
                className={styles.ring}
                animate={{ scale: [1, 1.5, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
                className={styles.sparkle}
                animate={{ y: [0, -10, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
            />
        </div>
    );
};

export default InnerBanner;
