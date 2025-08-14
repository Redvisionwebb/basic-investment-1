"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { calculators, performance } from "@/data/calculators";

export default function CalculatorTabs() {
  const searchParams = useSearchParams();
  const [isMonthlySip, setIsMonthlySip] = useState(true);

  useEffect(() => {
    const tab = searchParams.get("tab");
    setIsMonthlySip(tab !== "performance");
  }, [searchParams]);

  return (
    <section>
      <div className="flex justify-center mb-14">
        <div className="inline-flex border border-[var(--rv-primary)] rounded-full shadow-inner">
          <Link
            href={"/tools/calculators?tab=calculator"}
            className={`px-5 md:px-20 py-2 text-lg font-medium border border-[var(--rv-primary)] hover:bg-[var(--rv-primary)] hover:text-white rounded-l-full transition-all duration-300 ${
              isMonthlySip
                ? "bg-[var(--rv-primary)] text-white"
                : "bg-[var(--rv-secondary)] text-[var(--rv-primary)]"
            }`}
          >
            Calculators
          </Link>
          <Link
            href={"/tools/calculators?tab=performance"}
            className={`px-5 md:px-20 py-2 text-lg hover:bg-[var(--rv-primary)] hover:text-white font-medium border border-[var(--rv-primary)] rounded-r-full transition-all duration-300 ${
              !isMonthlySip
                ? "bg-[var(--rv-primary)] text-white"
                : "bg-[var(--rv-secondary)] text-[var(--rv-primary)]"
            }`}
          >
            Performance
          </Link>
        </div>
      </div>

      {isMonthlySip ? (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
          {calculators.map((item, index) => (
            <Link href={item?.route} key={index}>
              <div className="px-2 bg-[var(--rv-primary)] h-14 flex gap-4 rounded items-center text-center shadow-md group">
                <div>
                  <Image src={item?.image} alt="" width={20} height={20} />
                </div>
                <div>
                  <p className="font-bold text-white text-md text-center group-hover:text-[#F3F3E0] mb-0">
                    {item?.title}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
          {performance.map((item, index) => (
            <Link href={item.link} key={index}>
              <div className="px-2 bg-[var(--rv-primary)] h-14 flex gap-4 items-center rounded-md shadow-md group">
                <div>
                  <Image src={item?.image} alt="" width={20} height={20} />
                </div>
                <div>
                  <p className="font-bold text-white text-md group-hover:text-[#F3F3E0] mb-0">
                    {item?.title}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
