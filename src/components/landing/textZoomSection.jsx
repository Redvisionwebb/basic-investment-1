"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

export default function TextZoomSection() {
    const headingRef = useRef(null); // Reference for the heading element

    useEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                scrub: 1,
                pin: true,
                trigger: "#pin-windmill",
                start: "50% 50%",
                endTrigger: "#pin-windmill-wrap",
                end: "+=4000",
            },
        });

        tl.to("#pin-windmill-svg", {
            scale: 100,
            duration: 2,
            opacity: 0,
        });
        // tl.to('#pin-windmill-svg', {
        //     duration: 2,
        //     scale: 90,
        //     autoAlpha: 0,
        //     ease: 'power2.in',
        //     scrollTrigger: {
        //         trigger: '#container',
        //         start: 'top top',
        //         end: '+=2000',
        //         anticipatePin: true,
        //         pin: true,
        //         scrub: true,
        //     }
        // });
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10 h-screen flex items-center justify-center" id="pin-windmill"
        >
            <h2
                // Attach the ref to the heading
                className="text-lg md:text-5xl mb-4 text-white max-w-4xl mx-auto font-bold text-center"
                id="pin-windmill-svg"
            >
                Contact Us
            </h2>
        </div>
    );
}
