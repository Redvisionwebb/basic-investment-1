"use client";
import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./AboutUs.module.css";

const fadeInVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.2,
            duration: 0.6,
            ease: "easeOut",
        },
    }),
};

export default function TeamSection({ aboutteamdata = [] }) {
    return (
        <div className="main-section">
            <div className="max-w-screen-xl mx-auto px-4">
                <h2 className={styles.title}>Our Team</h2>
                <Carousel
                    className="w-full mt-10"
                    plugins={[
                        Autoplay({
                            delay: 3000,
                        }),
                    ]}
                >
                    <CarouselContent>
                        {aboutteamdata.map((member, index) => (
                            <CarouselItem
                                key={index}
                                className="md:basis-1/2 lg:basis-1/3 px-4"
                            >
                                <motion.div
                                    variants={fadeInVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    custom={index}
                                    className="relative rounded-2xl overflow-hidden shadow-lg group"
                                >
                                    <Image
                                        src={member.image?.url || "/teams/default.png"}
                                        alt={member.name}
                                        width={400}
                                        height={400}
                                        className="w-full h-[400px] object-cover grayscale hover:grayscale-0 "
                                    />
                                    <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-[var(--rv-primary)] via-[var(--rv-primary)]/60 to-transparent z-10" />
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white z-20">
                                        <h3 className="text-xl font-semibold">{member.name}</h3>
                                        <p className="text-sm opacity-90">{member.designation}</p>
                                    </div>
                                </motion.div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    );
}
