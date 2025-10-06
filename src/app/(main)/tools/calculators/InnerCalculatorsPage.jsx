"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { calculators, performance } from "@/data/calculators";
import styles from './Calculators.module.css'
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import InnerBanner from '@/components/innerBanner/InnerBanner';

export default function Page() {
    const searchParams = useSearchParams();
    const [isMonthlySip, setIsMonthlySip] = useState(true);
    useEffect(() => {
        const tab = searchParams.get("tab");
        setIsMonthlySip(tab !== "performance"); // default is "calculator"
    }, [searchParams]);
    return (
        <div className="">
            <InnerBanner title={"Financial Tools"} />
            <div className='max-w-screen-xl mx-auto flex flex-col justify-center section'>
                <div className="flex justify-center mb-14">
                    <div className="inline-flex border border-[var(--rv-primary)] rounded-full shadow-inner">
                        <Link
                            href={"/tools/calculators?tab=calculator"}
                            className={`px-10 md:px-20 py-1 text-lg font-medium border border-[var(--rv-primary)] hover:bg-[var(--rv-third)] rounded-l-full transition-all duration-300 ${isMonthlySip
                                ? "bg-[var(--rv-primary)] text-white"
                                : "bg-[var(--rv-white)] text-black hover:text-white"
                                }`}
                        >
                            Calculators
                        </Link>
                        <Link
                            href={"/tools/calculators?tab=performance"}
                            className={`px-10 md:px-20 py-1 text-lg hover:bg-[var(--rv-third)] font-medium border border-[var(--rv-primary)] rounded-r-full transition-all duration-300 ${!isMonthlySip
                                ? "bg-[var(--rv-primary)] text-white"
                                : "bg-[var(--rv-white)] text-black hover:text-white"
                                }`}
                        >
                            Performance
                        </Link>
                    </div>
                </div>
                {isMonthlySip ?
                    <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5'>
                        {calculators.map((item, index) => (
                            <Link href={item.route} key={index} className={styles.cardsContainer}>
                                <div className={styles.calculatorBox}>
                                    <div >
                                        <Image src={item.image} alt='' width={60} height={60} className={styles.boxImage} />
                                    </div>
                                    <div>
                                        <p className='font-bold text-lg group-hover:text-gray-950 mb-3'>
                                            {item.title}
                                        </p>
                                        <p className='text-md line-clamp-5'>
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    :
                    <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5'>
                        {performance.map((item, index) => (
                            <Link href={item.link} key={index} className={styles.cardsContainer}>
                                <div className={styles.calculatorBox}>
                                    <div>
                                        <Image src={item?.image} alt='' width={20} height={20} className={styles.boxImage} />
                                    </div>
                                    <div>
                                        <p className='font-bold text-lg group-hover:text-gray-950 mb-4'>
                                            {item.title}
                                        </p>
                                        <p className='text-md line-clamp-5'>
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                }
            </div >
        </div>
    )
}