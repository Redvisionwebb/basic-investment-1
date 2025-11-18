"use client"

import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import Image from 'next/image';
import SectionHeading from '@/components/sectionHeading/sectionHeading';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Mousewheel, Autoplay } from "swiper/modules";
import Link from 'next/link';

const WhyChooseUsSection = ({ missionvision }) => {
    const cards = [
        {
            icon: '/images/about/2.svg',
            title: "Mission",
            para: missionvision?.mission,
        },
        {
            icon: '/images/about/1.svg',
            title: "Vision",
            para: missionvision?.vision,
        },
        {
            icon: '/images/about/3.svg',
            title: "Values",
            para: missionvision?.values,
        }
    ];

    return (
        <div className="w-full relative">
            <div className="section">
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
                        {cards?.map((card, index) => (
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
                                        <Image src={card?.icon} alt='image' width={70} height={70} />
                                    </div>
                                    <h3 className="text-2xl uppercase font-bold">{card?.title}</h3>
                                    <p className=" text-lg" dangerouslySetInnerHTML={{ __html: card?.para||"" }}></p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const TeamSection = ({ team }) => {
    return (
        <div className="px-4">
            <div>
                <SectionHeading
                    align="center"
                    title1="Meet the Experts Who Power Our Vision"
                    heading="Our Dedicated Team"
                />
            </div>
            <div className="section">
                <div className="max-w-screen-xl mx-auto flex flex-col gap-12">
                    {team?.map((member, i) => {
                        const isEven = i % 2 === 0;

                        return (
                            <motion.div
                                key={i}
                                className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 bg-[var(--rv-bg-primary-light)] rounded-xl items-center"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <div
                                    className={`md:p-10 p-5 md:col-span-2 ${isEven ? "md:order-1" : "md:order-2"
                                        }`}
                                >

                                    <p  className="leading-relaxed text-xl mb-4" dangerouslySetInnerHTML={{ __html: member?.description||"" }}></p>
                                    <h4 className="text-3xl font-bold text-[var(--rv-secondary)]">
                                        {member?.name}
                                    </h4>
                                    <p className="text-[var(--rv-secondary)]">
                                        {member?.designation}
                                    </p>
                                </div>

                                <div
                                    className={`w-full h-full relative ${isEven ? "md:order-2" : "md:order-1"
                                        }`}
                                >
                                    <div className='w-full h-full p-2'>
                                        <Image
                                            src={member?.image?.url}
                                            alt={member?.name}
                                            width={500}
                                            height={400}
                                            className="w-full h-full rounded-xl object-cover"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// const TopFeaturesSection = () => {
//     const features = [
//         {
//             id: 1,
//             number: "250+",
//             title: "Crore Asset Under Management",
//             icon: "https://img.icons8.com/bubbles/100/facebook-like.png", // replace with your actual icons
//         },
//         {
//             id: 2,
//             number: "1500+",
//             title: "Clients Served",
//             icon: "https://img.icons8.com/stickers/100/administrator-male.png",
//         },
//         {
//             id: 3,
//             number: "20+",
//             title: "Qualified Team Members",
//             icon: "https://img.icons8.com/plasticine/100/commercial-development-management.png",
//         },
//         {
//             id: 4,
//             number: "30+",
//             title: "Years Combined Experience",
//             icon: "https://img.icons8.com/dusk/50/customer-insight.png",
//         },
//         {
//             id: 5,
//             number: "35+",
//             title: "Research Tools",
//             icon: "https://img.icons8.com/bubbles/100/administrative-tools.png",
//         },
//         {
//             id: 6,
//             number: "",
//             title: "Cutting Edge Technology",
//             icon: "https://img.icons8.com/plasticine/100/workstation.png",
//         },
//     ];

//     return (
//         <div className="">
//             <div className="max-w-screen-xl mx-auto px-4 flex flex-col gap-10 text-center">
//                 <SectionHeading align="center" title1="Our Top Features" />

//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//                     {features.map((feature, i) => (
//                         <motion.div
//                             key={feature.id}
//                             initial={{ opacity: 0, scale: 0.8 }}
//                             whileInView={{ opacity: 1, scale: 1 }}
//                             transition={{ duration: 0.5, delay: i * 0.1 }}
//                             viewport={{ once: true }}
//                             className={`flex flex-col items-center justify-center rounded-2xl p-6 shadow-md bg-[var(--rv-bg-primary-light)]`}
//                         >
//                             <Image
//                                 width={200}
//                                 height={200}
//                                 src={feature.icon}
//                                 alt={feature.title}
//                                 className="mx-auto mb-4 h-16 w-16"
//                             />
//                             <h3 className="font-bold text-4xl text-[var(--rv-primary)]">
//                                 {feature.number}
//                             </h3>
//                             <p className="mt-2 text-gray-700 font-medium">{feature.title}</p>
//                         </motion.div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

const PartnersSection = ({ partners }) => {
    const [amcLogos, setAmcLogos] = useState([]);
  const [mutualFundCategoryId, setMutualFundCategoryId] = useState("");
  const [loading, setLoading] = useState(false); // 👈 added

  // Fetch categories and get Mutual Funds category only
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/amc-category`);
      const data = await res.json();

      const mutualFundCategory = data.find(
        (cat) => cat.title === "Mutual Funds"
      );

      if (mutualFundCategory) {
        setMutualFundCategoryId(mutualFundCategory._id);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch AMC logos by Mutual Funds category ID, filter `addisstatus: true`
  const fetchAmcLogos = async (categoryID) => {
    try {
      setLoading(true); // 👈 start skeleton
      const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/amc-logos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryID }),
      });

      const data = await res.json();
      const filteredLogos = data?.data?.filter((logo) => logo.addisstatus);
      setAmcLogos(filteredLogos || []);
    } catch (error) {
      console.error("Error fetching AMC logos:", error);
    } finally {
      setLoading(false); // 👈 stop skeleton
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (mutualFundCategoryId) {
      fetchAmcLogos(mutualFundCategoryId);
    }
  }, [mutualFundCategoryId]);

    return (
        <div className="px-4">
            <div className="max-w-screen-xl mx-auto main-section flex flex-col gap-10 text-center">
                <SectionHeading
                    heading={"OUR PARTNERS"}
                    align="center"
                    variant="light"
                    title1={`Trusted by Leading Product Partners`}
                    description={
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat."
                    }
                />

                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={20}
                    loop={true}
                    autoplay={{ delay: 2000, disableOnInteraction: false }}
                    breakpoints={{
                        320: { slidesPerView: 2 },
                        640: { slidesPerView: 3 },
                        1024: { slidesPerView: 5 },
                    }}
                    className="my-3 h-full w-full"
                >
                    {amcLogos?.map((logo, i) => (
                        <SwiperSlide key={logo._id || i}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="border border-gray-300 h-40 p-2 flex flex-col items-center justify-center">
                                    <Link
                                        href={logo?.adminlogourl || logo?.logourl || ""}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <div className="w-full h-24">
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_DATA_API}${logo.logo}`}
                                                alt={logo?.logoname}
                                                width={200}
                                                height={200}
                                                className="mx-auto w-full h-full object-contain rounded"
                                            />
                                        </div>
                                        <p className="text-sm mt-2 font-medium text-gray-700">
                                            {logo?.logoname}
                                        </p>
                                    </Link>
                                </div>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};


const AboutAllContent = ({ missionvision, team, partners }) => {
    return (
        <div>
            <WhyChooseUsSection missionvision={missionvision} />
            <TeamSection team={team} />
            <PartnersSection partners={partners} />
            {/* <TopFeaturesSection /> */}
        </div>
    )
}

export default AboutAllContent
