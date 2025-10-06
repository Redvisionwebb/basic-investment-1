"use client";
import axios from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import SipCalculator from "@/components/sipcalculator";
import { ReturnChart } from "@/components/returnchart";
import Loader from "@/components/admin/common/Loader";
import CryptoJS from "crypto-js";


export default function Page() {

    const [loading, setLoading] = useState(false);
    const [performanceData, setPerformanceData] = useState(null);
      const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

    const fetchPerformanceData = async (pcode) => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_DATA_API}/api/single-schemedata?apikey=${process.env.NEXT_PUBLIC_API_KEY}`,
                { 'pcode': pcode });
            if (response.status === 200) {
                setPerformanceData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching performance data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
         const encrypted = localStorage.getItem("encryptedFundData");
        if (!encrypted) return;
        const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            if (!decrypted) throw new Error("Decryption failed");
            const data = JSON.parse(decrypted);
            const isExpired = Date.now() - data.timestamp > 2 * 60 * 60 * 1000;

      if (isExpired) {
        localStorage.removeItem("encryptedFundData");
      } else {
        fetchPerformanceData(data.pcode);
      }
    }, []);

    const transformGraphData = (data) => {
        if (!data) return {};
        const labels = data?.map((item) => item.nav_date) || [];
        const navValues = data?.map((item) => item.nav) || [];
        return {
            labels,
            datasets: [
                {
                    label: "NAV over time",
                    data: navValues,
                    fill: false,
                    backgroundColor: "rgb(75, 192, 192)",
                    borderColor: "rgba(75, 192, 192, 0.2)",
                },
            ],
        };
    };

    return (
        <div className="max-w-screen-xl mx-auto">
            <div className="bg-white text-gray-900  py-10">
            <div>
                {loading ? (
                    <Loader />
                ) : !performanceData ? (
                    <div className="h-screen text-center py-10">
                        <h2 className="text-2xl font-semibold mb-2">
                            Fund Data Not Found
                        </h2>
                        <p className="text-lg ">
                            We couldn&apos;t find the performance data for this fund. Please try again later or check the fund details.
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="mb-5">
                            <h1 className="text-4xl font-bold mb-3">
                                {performanceData?.funddes}
                            </h1>
                            <h1 className="text-lg font-medium ">
                                {performanceData?.nav_c2} - {performanceData?.nav_c4}
                            </h1>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div className='md:col-span-2'>
                                <div className='p-4 shadow rounded mb-5'>
                                    <div className="grid grid-cols-2 mb-2">
                                        <div>
                                            <p className="text-lg font-bold ">₹{performanceData?.NAVAmount}</p>
                                            <h6 className="text-md ">Current NAV</h6>
                                        </div>
                                     
                                        <div>
                      {(() => {
    const {
      prev5YearPer,
      prev3YearPer,
      prevYearPer,
      prev9MonthsPer,
      prev6MonthsPer,
      prev3MonthsPer,
      prev1MonthPer,
      prev1WeekPer,
    } = performanceData || {};

    let value = "0.00";
    let label = "";

    if (prev5YearPer && prev5YearPer !== "0.00") {
  value = prev5YearPer;
  label = "5Y";
} else if (prev3YearPer && prev3YearPer !== "0.00") {
  value = prev3YearPer;
  label = "3Y";
} else if (prevYearPer && prevYearPer !== "0.00") {
  value = prevYearPer;
  label = "1Y";
} else if (prev9MonthsPer && prev9MonthsPer !== "0.00") {
  value = prev9MonthsPer;
  label = "9M";
} else if (prev6MonthsPer && prev6MonthsPer !== "0.00") {
  value = prev6MonthsPer;
  label = "6M";
} else if (prev3MonthsPer && prev3MonthsPer !== "0.00") {
  value = prev3MonthsPer;
  label = "3M";
} else if (prev1MonthPer && prev1MonthPer !== "0.00") {
  value = prev1MonthPer;
  label = "1M";
} else if (prev1WeekPer && prev1WeekPer !== "0.00") {
  value = prev1WeekPer;
  label = "1W";
}


    return (
      <> 
        <p className="text-lg font-bold text-[var(--rv-primary)]">{value}%</p>
        <p className="text-md">
          {label} CAGR returns
        </p>
      </>
    );
  })()}
                    </div>
                                    </div>
                                    {performanceData?.nav ? (
                                        <ReturnChart data={transformGraphData(performanceData?.nav)} className="pt-10" />
                                    ) : (
                                        <p>No graph data available.</p>
                                    )}
                                </div>
                                <div>
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger className="text-lg">Scheme Performance</AccordionTrigger>
                                            <AccordionContent className="md:px-10">
                                                <p className='text-sm font-meduim mb-3'>Returns and Ranks</p>
                                                <div className='border-y border-stone-500 flex justify-between py-4 items-center'>
                                                    <div>
                                                        <p className='text-md font-medium '>Time Line</p>
                                                    </div>
                                                    <div className='grid grid-cols-4 text-center md:gap-x-20 gap-x-3'>
                                                        <div className='text-lg font-bold '>1Y</div>
                                                        <div className='text-lg font-bold '>3Y</div>
                                                        <div className='text-lg font-bold '>5Y</div>
                                                        <div className='text-lg font-bold '>MAX</div>
                                                    </div>
                                                </div>
                                                <div className='border-b border-stone-500 flex justify-between py-4'>
                                                    <div>
                                                        <p className='text-md font-bold '>Trailing Returns</p>
                                                    </div>
                                                    <div className='grid grid-cols-4 text-center md:gap-x-16 gap-x-3'>
                                                        <div className='text-md font-medium '>{performanceData?.prevYearPer || '-'}%</div>
                                                        <div className='text-md font-medium '>{performanceData?.prev3YearPer || '-'}%</div>
                                                        <div className='text-md font-medium '>{performanceData?.prev5YearPer || '-'}%</div>
                                                        <div className='text-md font-medium '>{performanceData?.sinceInceptionReturn || '-'}%</div>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="item-2">
                                            <AccordionTrigger className="text-lg">Minimum Sip Amount</AccordionTrigger>
                                            <AccordionContent className="md:px-10">
                                                <p>Minimum Sip Amount - {' '}{performanceData?.sip_minimum_installment_amount}</p>
                                            </AccordionContent>
                                        </AccordionItem>
                                        {/* <AccordionItem value="item-3">
                                            <AccordionTrigger className="text-lg">Fund Objective</AccordionTrigger>
                                            <AccordionContent className="md:px-10">
                                                <div className='mt-2'>
                                                    <div className='text-md '>
                                                        The Investment objective of the scheme is to provide long term capital appreciation by investing in equity and equity related instruments of Public Sector Undertakings (PSUs). The Scheme does not guarantee/indicate any returns. There can be no assurance that the schemes objectives will be achieved.
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem> */}
                                    </Accordion>
                                </div>
                            </div>
                            <div className="col-span-1 rounded">
                                <SipCalculator data={performanceData?.sinceInceptionReturn} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </div>
    );
}