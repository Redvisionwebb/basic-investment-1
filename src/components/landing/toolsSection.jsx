"use client";
import { useEffect } from "react";
import { HoverEffect } from "../ui/card-hover-effect";
import gsap from "gsap";

export function ToolsSection() {
    useEffect(() => {
        gsap.to(".worldmap", {
            scrollTrigger: {
                trigger: ".worldmap",
                start: "top bottom",
                end: "+=2600",
                pin: true,
                scrub: true,
                invalidateOnRefresh: true,
            },
        });
    }, []);
    return (
        <section className="bg-white worldmap">
            <div className="max-w-screen-xl mx-auto my-40">
                <h2 className="h2 text-lg md:text-5xl mb-10 text-gray-900 max-w-xl mx-auto font-bold text-center">
                    Our Financial Tools
                </h2>
                <HoverEffect items={cardData} />
            </div>
        </section>
    );
}

const cardData = [
    {
        title: 'Financial Calculators',
        description: 'Use our calculators to estimate your investment returns, loan payments, and more.',
        images: '/images/tools/calculator.svg',
        link: "/tools/calculators"
    },
    {
        title: 'Download Forms',
        description: 'Access and download important forms for your financial needs quickly and easily.',
        images: '/images/tools/cloud-file.svg',
        link: "/tools/download-forms"
    },
    {
        title: 'Financial Fitness',
        description: 'Track and improve your financial health with our personalized tools and resources.',
        images: '/images/tools/medical-report.svg',
        link: "/tools/financial-health"
    },
    {
        title: 'Risk Profile',
        description: 'Assess your risk tolerance to make better investment decisions tailored to your goals.',
        images: '/images/tools/profile-account.svg',
        link: "/tools/risk-profile"
    },
    // {
    //     title: 'Useful Links',
    //     description: 'Explore useful resources and links to enhance your financial knowledge and tools.',
    //     images: '/images/link.svg',
    //     link: "/tools/useful-links"
    // },
    // {
    //     title: 'Pay Premium Online',
    //     description: 'Pay your premiums securely and conveniently through our online platform.',
    //     images: '/images/vip-card.svg',
    //     link: "/tools/pay-premium-online"
    // },
];
