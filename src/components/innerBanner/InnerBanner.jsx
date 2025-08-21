"use client";
import React from "react";
import { motion } from "framer-motion";
import styles from "./InnerBanner.module.css";

const InnerBanner = ({ title }) => {
    return (
        <div 
            className={styles.bannerWrapper}  >
            <motion.div 
                className={styles.content}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <motion.h1 
                    className={styles.title}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    {title}
                </motion.h1>
                <motion.div
                    className={'flex items-center gap-2 text-center'}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <p>Home</p>/ <p>{title}</p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default InnerBanner;
