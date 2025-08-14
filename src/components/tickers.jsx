"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent } from './ui/carousel';

const Tickers = () => {
    const [data, setData] = useState([]);
    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/tickers?apikey=${process.env.NEXT_PUBLIC_API_KEY}`);
            if (response.status === 200) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 30000); // Refresh data every 30 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mx-auto relative">
            {/* Fade effect overlays */}
            <div className="ticker relative bg-[var(--rv-primary)]">
                <Carousel
                    className="relative"
                    plugins={[Autoplay({ delay: 2000 })]}
                >
                    <CarouselContent className="flex -ml-0">
                        {data.map((item, index) => (
                            <div key={index} className="md:basis-1/6 lg:basis-1/6">
                                <div
                                    className="px-3 py-1 flex items-center gap-2 thirdbgcolor border-r border-white w-64"
                                >
                                    <span className="font-bold text-white text-sm whitespace-nowrap">{item?.indexName}</span>
                                    <span className="font-semibold text-gray-100 text-xs">{item?.figure}</span>
                                    <div className='bg-gray-800 flex items-center gap-2 px-1.5 py-1 w-54  rounded-md'>
                                        <span
                                            className={`font-bold text-xs flex justify-center items-center ${item?.diff_amount > 0 ? 'text-green-300' : 'text-red-500'}`}
                                        >
                                            {item?.diff_amount > 0 ? <FiArrowUp /> : <FiArrowDown />}
                                        </span>
                                        <span
                                            className={`font-bold text-xs flex items-center ${item?.diff_amount > 0 ? 'text-green-300' : 'text-red-500'}`}
                                        >
                                            {item?.diff_amount}
                                        </span>
                                        <span
                                            className={`font-bold text-xs flex items-center ${item?.diff_amount > 0 ? 'text-green-300' : 'text-red-500'}`}
                                        >
                                            ({item?.percentage}%)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    );
};

export default Tickers;