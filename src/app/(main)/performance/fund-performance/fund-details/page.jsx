"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SipCalculator from "@/components/sipcalculator";
import { ReturnChart } from "@/components/returnchart";
import Loading from "./loading";
import CryptoJS from "crypto-js";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [performanceData, setPerformanceData] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [timeFrame, setTimeFrame] = useState("1Y");
  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

  const fetchPerformanceData = async (pcode, ftype) => {
    setLoading(true);
    try {
      const sanitizedperformanceId = ftype.includes("&")
        ? ftype.replace(/&/g, "%26")
        : ftype;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/fund-performance/fp-data?categorySchemes=${sanitizedperformanceId}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      if (response.status === 200) {
        const foundData = response.data.data?.find(
          (item) => item.pcode === pcode
        );
        setPerformanceData(foundData);
      }
    } catch (error) {
      console.error("Error fetching performance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGraphData = async (pcode) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/fund-performance/graph-data?pcode=${pcode}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      if (response.status === 200) {
        setGraphData(response.data);
      }
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  };

  useEffect(() => {
    const encrypted = localStorage.getItem("encryptedFundPerormanceData");
    if (!encrypted) return;
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) throw new Error("Decryption failed");
    const data = JSON.parse(decrypted);
    const isExpired = Date.now() - data.timestamp > 2 * 60 * 60 * 1000;

    if (isExpired) {
      localStorage.removeItem("encryptedFundPerormanceData");
    } else {
      fetchPerformanceData(data.pcode, data.ftype);
      fetchGraphData(data.pcode, timeFrame);
    }
  }, [timeFrame]);

  const transformGraphData = (data) => {
    if (!data) return {};

    const labels = data.navDateArray || [];
    const navValues = data.navArray?.map((item) => parseFloat(item)) || [];

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
    <div className="">
      <div className="max-w-screen-xl mx-auto main_section lg:px-1 px-3 text-[var(--rv-white)]">
        <div>
          {loading ? (
            <Loading />
          ) : (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <div className="mb-5">
                    <h1 className="text-lg md:text-3xl font-bold uppercase">
                      {performanceData?.funddes}
                    </h1>
                    <h2 className="text-lg font-medium text-stone-400">
                      {performanceData?.schemeCategory}
                    </h2>
                  </div>
                  <div className="shadow rounded mb-5">
                    <div className="grid grid-cols-1 lg:grid-cols-3 mb-2 gap-4">
                      {/* Nav section with hierarchical fallback */}
                      {/* {performanceData?.threeyear_navStartDate &&
                      performanceData.threeyear_navStartDate !== "0.00" && (
                        <div>
                          <p className="text-xs font-semibold text-stone-400">NAV: {performanceData?.threeyear_startDate}</p>
                          <h4 className="font-bold text-stone-100">
                            ₹{performanceData?.threeyear_navStartDate}
                          </h4>
                        </div>
                      ) || (performanceData?.one_year &&
                        performanceData.one_year !== "0.00" && (
                          <div>
                            <p className="text-xs font-semibold text-stone-400">NAV: 1 Year Data</p>
                            <h4 className="text-lg font-bold text-stone-100">
                              ₹{performanceData?.one_year}
                            </h4>
                          </div>
                        )) || (
                        performanceData?.six_month &&
                        performanceData.six_month !== "0.00" && (
                          <div>
                            <p className="text-xs font-semibold text-stone-400">NAV: 6 Month Data</p>
                            <h4 className="text-lg font-bold text-stone-100">
                              {performanceData?.six_month}
                            </h4>
                          </div>
                        ))} */}
                      {/* Second Nav with hierarchical fallback */}
                      {(performanceData?.threeyear_navEndDate &&
                        performanceData.threeyear_navEndDate !== "0.00" && (
                          <div>
                            <p className="text-xs font-semibold text-stone-400">
                              NAV
                            </p>
                            <h4 className="font-bold text-stone-100">
                              ₹{performanceData?.threeyear_navEndDate}
                            </h4>
                          </div>
                        )) ||
                        (performanceData?.one_year &&
                          performanceData.one_year !== "0.00" && (
                            <div>
                              <p className="text-xs font-semibold text-stone-400">
                                NAV: 1 Year Data
                              </p>
                              <h4 className="text-lg font-bold text-stone-100">
                                {performanceData?.one_year}
                              </h4>
                            </div>
                          )) /* Add six_month check here if available */ ||
                        (performanceData?.six_month &&
                          performanceData.six_month !== "0.00" && (
                            <div>
                              <h3 className="text-md text-stone-400">
                                NAV: 6 Month Data
                              </h3>
                              <h4 className="text-lg font-bold text-stone-100">
                                {performanceData?.six_month}
                              </h4>
                            </div>
                          ))}
                      {performanceData?.Corpus && (
                        <div>
                          <p className="text-xs font-semibold text-stone-400">
                            Corpus
                          </p>
                          <h4 className="font-bold text-stone-100">
                            ₹{performanceData?.Corpus}
                          </h4>
                        </div>
                      )}
                      <div>
                        {(() => {
                          const {
                            five_year,
                            three_year,
                            one_year,
                            nine_month,
                            six_month,
                            three_month,
                            one_month,
                            one_week,
                          } = performanceData || {};

                          let value = "0.00";
                          let label = "";

                          if (five_year !== "0.00") {
                            value = five_year;
                            label = "5Y";
                          } else if (three_year !== "0.00") {
                            value = three_year;
                            label = "3Y";
                          } else if (one_year !== "0.00") {
                            value = one_year;
                            label = "1Y";
                          } else if (nine_month !== "0.00") {
                            value = nine_month;
                            label = "9M";
                          } else if (six_month !== "0.00") {
                            value = six_month;
                            label = "6M";
                          } else if (three_month !== "0.00") {
                            value = three_month;
                            label = "3M";
                          } else if (one_month !== "0.00") {
                            value = one_month;
                            label = "1M";
                          } else {
                            value = one_week;
                            label = "1W";
                          }
                          return (
                            <>
                              <p className="text-xs font-semibold text-stone-400">
                                {label} CAGR returns
                              </p>
                              <p className="text-lg font-bold text-[var(--rv-secondary)]">
                                {value}%
                              </p>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="w-full">
                        {" "}
                        {/* Adjust this min-width as needed */}
                        {graphData ? (
                          <ReturnChart data={transformGraphData(graphData)} />
                        ) : (
                          <p>No graph data available.</p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-white mt-4">
                      {performanceData?.calculation}
                    </p>
                  </div>
                  <div>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xl">
                          Scheme Performance
                        </AccordionTrigger>
                        <AccordionContent className="px-10">
                          <p className="text-sm font-medium text-stone-100 mb-3">
                            Returns and Ranks
                          </p>
                          <div className="border-y border-stone-500 flex justify-between py-4 items-center">
                            <div>
                              <h5 className="text-md font-medium text-stone-100">
                                Time Line
                              </h5>
                            </div>
                            <div className="grid grid-cols-4 text-center gap-x-20">
                              <div className="text-lg font-bold text-stone-100">
                                1Y
                              </div>
                              <div className="text-lg font-bold text-stone-100">
                                3Y
                              </div>
                              <div className="text-lg font-bold text-stone-100">
                                5Y
                              </div>
                              <div className="text-lg font-bold text-stone-100">
                                MAX
                              </div>
                            </div>
                          </div>
                          <div className="border-b border-stone-500 flex justify-between py-4">
                            <div>
                              <h5 className="text-md font-medium text-stone-100">
                                Trailing Returns
                              </h5>
                            </div>
                            <div className="grid grid-cols-4 text-center gap-x-16">
                              <div className="text-md font-medium text-stone-100">
                                {performanceData?.one_year !== "0.00" &&
                                  performanceData?.one_year
                                  ? `${performanceData.one_year}%`
                                  : performanceData?.onemonth || "-"}
                                %
                              </div>
                              <div className="text-md font-medium text-stone-100">
                                {performanceData?.three_year !== "0.00" &&
                                  performanceData?.three_year
                                  ? `${performanceData.three_year}%`
                                  : performanceData?.six_month || "-"}
                                %
                              </div>
                              <div className="text-md font-medium text-stone-100">
                                {performanceData?.five_year !== "0.00" &&
                                  performanceData?.five_year
                                  ? `${performanceData.five_year}%`
                                  : performanceData?.three_month || "-"}
                                %
                              </div>
                              <div className="text-md font-medium text-stone-100">
                                {performanceData?.si || "-"}%
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger className="text-xl">
                          Fund Managers
                        </AccordionTrigger>
                        <AccordionContent className="px-10">
                          <div className="rounded shadow py-2 px-3 mt-2">
                            <div className="flex flex-col gap-1">
                              {performanceData?.fundManager
                                .split(",")
                                .map((manager, index) => (
                                  <div key={index} className="mr-4">
                                    <div className="text-md font-bold text-stone-100">
                                      {manager.trim()}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
                <div className="md:col-span-1 bg-[var(--rv-forth)] rounded">
                  <SipCalculator data={performanceData?.si} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
