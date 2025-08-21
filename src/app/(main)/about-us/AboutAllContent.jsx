"use client"

import React from 'react'
import { motion } from "framer-motion";
import Image from 'next/image';
import SectionHeading from '@/components/sectionHeading/sectionHeading';

const WhyChooseUsSection = () => {
    const cards = [
        {
            icon: '/images/about/2.svg',
            title: "Mission",
            para: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. `,
        },
        {
            icon: '/images/about/1.svg',
            title: "Vision",
            para: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam  nonummy nibh euismod tincidunt  magna aliquam erat volutpat. `,
        },
        {
            icon: '/images/about/3.svg',
            title: "Values",
            para: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. `,
        }
    ];

    return (
        <div className="w-full relative">
            <div className="main-section">
                <div className="max-w-screen-xl px-4 mx-auto flex flex-col gap-10">
                    <div className="flex items-center gap-5 flex-col md:flex-row ">
                        <div className='md:w-1/2'>
                            <SectionHeading
                                align='start'
                                title1={`Backed by Experience, Driven by Results`}
                            />
                        </div>
                        <div className='md:w-1/2'>
                            <p className='text-xl'> Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.</p>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 items-end justify-end grid-cols-1 gap-5" >
                        {cards.map((card, index) => (
                            <motion.div
                                key={index}
                                className="border  border-white/20  relative"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                viewport={{ once: true }}
                            >
                                <div className={`flex rounded-xl p-5 flex-col gap-3 bg-[var(--rv-bg-primary-light)]`}>
                                    <div className='p-2 w-24 h-24 flex items-center justify-center rounded-full'>
                                        <Image src={card.icon} alt='' width={70} height={70} />
                                    </div>
                                    <h3 className="text-2xl uppercase font-bold">{card.title}</h3>
                                    <p className=" text-lg">{card.para}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const TeamSection = () => {
    const team = [
        {
            img: "/images/about/manoj.png",
            name: "Mr. Manoj Sharma",
            role: "Founder, Organization Name",
            text: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
                   Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.`,
        },
    ]

    return (

        <div className="px-4">
        <div className="main-section">
            <div className="max-w-screen-xl mx-auto flex bg-[var(--rv-bg-primary-light)] rounded-xl flex-col gap-12">
                {team.map((member, i) => (
                    <motion.div
                        key={i}
                        className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10  items-center"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className={'md:col-span-2 md:p-10 p-5'}>
                            <p className="leading-relaxed text-xl mb-4">{member.text}</p>
                            <h4 className="text-3xl font-bold text-[var(--rv-secondary)]">{member.name}</h4>
                            <p className="text-[var(--rv-secondary)]">{member.role}</p>
                        </div>
                        <div className='w-full h-full  relative'>
                                <Image src={member.img} alt={member.name} width={300} height={250} className="rounded-xl lg:hidden w-full h-full" />
                            <div className='absolute lg:block hidden bottom-0 left-0'>
                                <Image src={member.img} alt={member.name} width={300} height={250} className="rounded-xl w-full h-full" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
        </div>

    )
}

const TopFeaturesSection = () => {
    const features = [
        {
            id: 1,
            number: "250+",
            title: "Crore Asset Under Management",
            icon: "https://img.icons8.com/bubbles/100/facebook-like.png", // replace with your actual icons
        },
        {
            id: 2,
            number: "1500+",
            title: "Clients Served",
            icon: "https://img.icons8.com/stickers/100/administrator-male.png",
        },
        {
            id: 3,
            number: "20+",
            title: "Qualified Team Members",
            icon: "https://img.icons8.com/plasticine/100/commercial-development-management.png",
        },
        {
            id: 4,
            number: "30+",
            title: "Years Combined Experience",
            icon: "https://img.icons8.com/dusk/50/customer-insight.png",
        },
        {
            id: 5,
            number: "35+",
            title: "Research Tools",
            icon: "https://img.icons8.com/bubbles/100/administrative-tools.png",
        },
        {
            id: 6,
            number: "",
            title: "Cutting Edge Technology",
            icon: "https://img.icons8.com/plasticine/100/workstation.png",
        },
    ];

    return (
        <div className="main-section">
            <div className="max-w-screen-xl mx-auto px-4 flex flex-col gap-10 text-center">
                <SectionHeading align="center" title1="Our Top Features" />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className={`flex flex-col items-center justify-center rounded-2xl p-6 shadow-md bg-[var(--rv-bg-primary-light)]`}
                        >
                            <img
                                src={feature.icon}
                                alt={feature.title}
                                className="mx-auto mb-4 h-16 w-16"
                            />
                            <h3 className="font-bold text-4xl text-[var(--rv-primary)]">
                                {feature.number}
                            </h3>
                            <p className="mt-2 text-gray-700 font-medium">{feature.title}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};




const AboutAllContent = () => {
    return (
        <div>
            <WhyChooseUsSection />
            <TeamSection />
            <TopFeaturesSection />
        </div>
    )
}

export default AboutAllContent
