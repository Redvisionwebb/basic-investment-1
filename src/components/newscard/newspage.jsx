"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "@/components/newscard";
import NewsCardSkeleton from "@/components/newscard/NewsCardSkeleton";
import { Button } from "../ui/button";
import Link from "next/link";
import HomeHeading from "../landing/heading/heading";

const Newspage = () => {
  const [ipodata, setIpodata] = useState([]);
  const [marketdata, setMarketdata] = useState([]);
  const [populardata, setPopulardata] = useState([]);
  const [activeCategory, setActiveCategory] = useState("ipo");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ipoRes, marketRes, popularRes] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/open-apis/upcoming-news/ipo-news`
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/open-apis/upcoming-news/market-news`
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/open-apis/upcoming-news/popular-news`
          ),
        ]);

        if (
          ipoRes.status === 200 &&
          marketRes.status === 200 &&
          popularRes.status === 200
        ) {
          setIpodata(ipoRes.data);
          setMarketdata(marketRes.data);
          setPopulardata(popularRes.data);

          if (activeCategory === "ipo") setData(ipoRes.data);
          else if (activeCategory === "market") setData(marketRes.data);
          else setData(popularRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (activeCategory === "ipo") setData(ipodata);
    else if (activeCategory === "market") setData(marketdata);
    else setData(populardata);
  }, [activeCategory, ipodata, marketdata, populardata]);

  return (
    <div className="section bg-[var(--rv-bg-white)]">
      <section className="px-4">
        <div className="max-w-screen-xl mx-auto  flex flex-col gap-2 md:gap-8">
          <HomeHeading title={`Updates & Insights`} center="true" />

          <div className="flex gap-3 justify-center">
            {[
              { id: "ipo", label: "IPO" },
              { id: "market", label: "Market" },
              { id: "upcoming", label: "Upcoming" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-6 py-2 rounded-full font-semibold transition 
      ${
        activeCategory === tab.id
          ? "bg-[var(--rv-primary)] text-white shadow-md"
          : "bg-gray-200 text-black hover:bg-gray-300"
      }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5 grid-cols-1 overflow-hidden">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <NewsCardSkeleton key={i} />
                  ))
                : data
                    ?.slice(0, 3)
                    ?.map((item, index) => (
                      <NewsCard item={item} key={index} />
                    ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Link href="/news" className="btn btn-primary">
              Read More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Newspage;
