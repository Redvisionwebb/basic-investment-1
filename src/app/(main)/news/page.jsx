"use client";
import React, { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import axios from "axios";
import NewsCard from "@/components/newscard";
import InnerBanner from "@/components/innerBanner/InnerBanner";

export default function LatestNews() {
  const [ipodata, setIpodata] = useState([]);
  const [marketdata, setMarketdata] = useState([]);
  const [populardata, setPopulardata] = useState([]);
  const [activeCategory, setActiveCategory] = useState("ipo"); // Track selected category
  const [data, setData] = useState([]); // Data to be displayed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ipoRes, marketRes, popularRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/open-apis/upcoming-news/ipo-news`),
          axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/open-apis/upcoming-news/market-news`),
          axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/open-apis/upcoming-news/popular-news`),
        ]);
        if (ipoRes.status === 200 && marketRes.status === 200 && popularRes.status === 200) {
          setIpodata(ipoRes.data);
          setMarketdata(marketRes.data);
          setPopulardata(popularRes.data);

          // Set the initial data to display based on the active category
          if (activeCategory === "ipo") setData(ipoRes.data);
          else if (activeCategory === "market") setData(marketRes.data);
          else setData(popularRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []); // Empty dependency array to run this only once

  useEffect(() => {
    // Update displayed data when active category changes
    if (activeCategory === "ipo") setData(ipodata);
    else if (activeCategory === "market") setData(marketdata);
    else setData(populardata);
  }, [activeCategory, ipodata, marketdata, populardata]);

  return (
    <section className="">
       <InnerBanner title={"News"} />
      <div className="lg:px-1 px-4 section max-w-screen-xl mx-auto">
        {/* Buttons with active class and hover effect */}
     <div className="flex gap-3 justify-center">
  {[
    { id: "ipo", label: "IPO" },
    { id: "market", label: "Market" },
    { id: "upcoming", label: "Upcoming" },
  ].map(tab => (
    <button
      key={tab.id}
      onClick={() => setActiveCategory(tab.id)}
      className={`px-6 py-2 rounded-full font-semibold transition 
      ${activeCategory === tab.id
        ? "bg-[var(--rv-primary)] text-white shadow-md"
        : "bg-gray-200 text-black hover:bg-gray-300"
      }`}
    >
      {tab.label}
    </button>
  ))}
</div>


        <div className="overflow-x-auto">
          <div className="grid lg:grid-cols-3 md:grid-cols-2">
            {data?.map((item, index) => (
              <NewsCard item={item} key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}