"use client";
import React, { useEffect, useState } from "react";
import "chart.js/auto";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { SippieChart } from "@/components/charts/sippiechart";
import { CalculatorReturnChart } from "@/components/charts/calculatorReturnChart";
import axios from "axios";
import { calculators } from "@/data/calculators";
import { useRouter } from "next/navigation";
import InnerBanner from "@/components/innerBanner/InnerBanner";

export default function MarriagePlanningCalculator() {
  const router = useRouter();
  const [currentAge, setCurrentAge] = useState(10); // Current age of the child
  const [MarriageStartAge, setMarriageStartAge] = useState(18); // Age at which Marriage starts
  const [totalInvestment, setTotalInvestment] = useState(500000); // Current Marriage cost
  const [expectedReturn, setExpectedReturn] = useState(7); // Expected annual return in %
  const [inflationRate, setInflationRate] = useState(5); // Inflation rate in %

  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);

  const calculateMarriagePlan = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/marriage-calculator?currentAge=${currentAge}&marriageAge=${MarriageStartAge}&totalInvestment=${totalInvestment}&expectedReturn=${expectedReturn}&inflationRate=${inflationRate}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      if (res.status === 200) {
        const data = res.data;
        const totalInvestment = data.totalInvestment;
        const futureMarriageCost = data.futureMarriageCost;
        const lumpsumInvestment = data.lumpsumInvestment;
        const sipInvestment = data.sipInvestment;
        const yearlyData = data.yearlyData;
        setResult({
          totalInvestment,
          futureValue: Math.round(futureMarriageCost),
          lumpsumInvestment: Math.round(lumpsumInvestment),
          sipInvestment: Math.round(sipInvestment),
        });
        setChartData(yearlyData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    calculateMarriagePlan();
  }, [
    currentAge,
    MarriageStartAge,
    totalInvestment,
    expectedReturn,
    inflationRate,
  ]);
  const handleCalculatorChange = (e) => {
    const selectedRoute = e.target.value;
    if (selectedRoute) {
      router.push(selectedRoute); // Navigate to selected route
    }
  };


  const chartConfig = {
    invested: {
      label: "Current Expenses",
      color: "var(--rv-primary)",
    },
    return: {
      label: "Future Expenses",
      color: "var(--rv-secondary)",
    },
  }

  const chartConfig1 = {
    investedAmount: {
      label: "Total Investment",
      color: "var(--rv-primary)",
    },
    growth: {
      label: "Current Value",
      color: "var(--rv-secondary)",
    },
  };


  return (
    <>
      <InnerBanner title={'Marriage Plan Calculator'} />
      <div className="px-4">
        <div className="max-w-screen-xl mx-auto section">
          <div className="">
            <div className="mb-5 flex flex-col md:flex-row gap-5 justify-between">
              <span className="text-2xl md:text-3xl font-bold uppercase">
                Marriage Planning Calculator
              </span>
              <div className="flex justify-between gap-4">
                <span>Explore other calculators</span>
                <select
                  className="w-full border border-gray-500 rounded-lg p-2"
                  onChange={handleCalculatorChange}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {calculators.map((calc) => (
                    <option key={calc.title} value={calc.route}>
                      {calc.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <div>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
                  <div className="col-span-1 border border-[var(--rv-primary)] rounded-2xl bg-white p-5">
                    <div className="sip-calculator container mx-auto sticky top-0 z-10">
                      <div className="input-fields">
                        {/* Current Age */}
                        <div className="items-center ">
                          <div className="flex justify-between">
                            <span>Current Age</span>
                            <input
                              type="number"
                              value={currentAge}
                              placeholder="0"
                              onChange={(e) =>
                                setCurrentAge(parseFloat(e.target.value))
                              }
                              className="font-semibold text-[var(--rv-primary)] w-20 border px-2 py-2 rounded"
                            />
                          </div>
                          <Input
                            type="range"
                            min="1"
                            max="30"
                            step="1"
                            value={isNaN(currentAge) ? 0 : currentAge}
                            onChange={(e) =>
                              setCurrentAge(parseFloat(e.target.value))
                            }
                            className="customRange w-full"
                            style={{
                              "--progress": `${(((isNaN(currentAge) ? 0 : currentAge) - 1) / (30 - 1)) *
                                100}%`,
                            }}
                          />
                        </div>
                        {/* Marriage Start Age */}
                        <div className="items-center mt-5 mb-5">
                          <div className="flex justify-between">
                            <span>Age at the Start of Marriage</span>
                            <input
                              type="number"
                              value={MarriageStartAge}
                              placeholder="0"
                              onChange={(e) =>
                                setMarriageStartAge(parseFloat(e.target.value))
                              }
                              className="font-semibold text-[var(--rv-primary)] w-20 border px-2 py-2 rounded"
                            />
                          </div>
                          <Input
                            type="range"
                            min="10"
                            max="50"
                            step="1"
                            value={isNaN(MarriageStartAge) ? 0 : MarriageStartAge}
                            onChange={(e) =>
                              setMarriageStartAge(parseFloat(e.target.value))
                            }
                            className="customRange w-full"
                            style={{
                              "--progress": `${(((isNaN(MarriageStartAge) ? 0 : MarriageStartAge) - 10) /
                                (50 - 10)) *
                                100}%`,
                            }}
                          />
                        </div>
                        {/* Current Marriage Cost */}
                        <div>
                          <div className="flex justify-between">
                            <span>Current Marriage Expenses (₹)</span>
                            <div>

                              <input
                                type="number"
                                value={totalInvestment}
                                placeholder="0"
                                onChange={(e) =>
                                  setTotalInvestment(parseFloat(e.target.value))
                                }
                                className="font-semibold text-[var(--rv-primary)] w-36 border px-2 py-2 rounded"
                              />
                            </div>
                          </div>
                          <Input
                            type="range"
                            min="100000"
                            max="10000000"
                            step="1000"
                            value={isNaN(totalInvestment) ? 0 : totalInvestment}
                            onChange={(e) =>
                              setTotalInvestment(parseFloat(e.target.value))
                            }
                            className="customRange w-full"
                            style={{
                              "--progress": `${(((isNaN(totalInvestment) ? 0 : totalInvestment) - 100000) /
                                (10000000 - 100000)) *
                                100}%`,
                            }}
                          />
                        </div>
                        {/* Rate of Return */}
                        <div className="items-center mt-5">
                          <div className="flex justify-between">
                            <span>Rate of Return (%)</span>
                            <input
                              type="number"
                              value={expectedReturn}
                              placeholder="0"
                              onChange={(e) =>
                                setExpectedReturn(parseFloat(e.target.value))
                              }
                              className="font-semibold text-[var(--rv-primary)] w-20 border px-2 py-2 rounded"
                            />
                          </div>
                          <Input
                            type="range"
                            min="1"
                            max="30"
                            step="1"
                            value={isNaN(expectedReturn) ? 0 : expectedReturn}
                            onChange={(e) =>
                              setExpectedReturn(parseFloat(e.target.value))
                            }
                            className="customRange w-full"
                            style={{
                              "--progress": `${(((isNaN(expectedReturn) ? 0 : expectedReturn) - 1) / (30 - 1)) *
                                100}%`,
                            }}
                          />
                        </div>
                        {/* Inflation Rate */}
                        <div className="items-center mt-5">
                          <div className="flex justify-between">
                            <span>Inflation Rate (%)</span>
                            <input
                              type="number"
                              value={inflationRate}
                              placeholder="0"
                              onChange={(e) =>
                                setInflationRate(parseFloat(e.target.value))
                              }
                              className="font-semibold text-[var(--rv-primary)] w-20 border px-2 py-2 rounded"
                            />
                          </div>
                          <Input
                            type="range"
                            min="1"
                            max="30"
                            step="1"
                            value={isNaN(inflationRate) ? 0 : inflationRate}
                            onChange={(e) =>
                              setInflationRate(parseFloat(e.target.value))
                            }
                            className="customRange w-full"
                            style={{
                              "--progress": `${(((isNaN(inflationRate) ? 0 : inflationRate) - 1) / (30 - 1)) *
                                100}%`,
                            }}
                          />
                        </div>
                      </div>

                      {result && (
                        <div className="mt-5">
                          <div className="flex justify-between p-2">
                            <p>Current Marriage Expenses</p>
                            <p className="font-bold text-lg">
                              ₹{result?.totalInvestment?.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <hr className="mb-3" />
                          <div className="flex justify-between p-2">
                            <p>Future Marriage Expenses</p>
                            <p className="font-bold text-lg">
                              ₹{result?.futureValue?.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <hr className="mb-3" />
                          <div className="flex justify-between p-2">
                            <p>Planning Through Lumpsum</p>
                            <p className="font-bold text-lg">
                              ₹{result?.lumpsumInvestment?.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <hr className="mb-3" />
                          <div className="flex justify-between p-2">
                            <p>Planning Through SIP</p>
                            <p className="font-bold text-lg">
                              ₹{result?.sipInvestment?.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-1 flex flex-col gap-5">
                    <div className="">
                      <SippieChart
                        piedata={result}
                        title={"Marriage Planning Projection"}
                        chartConfig={chartConfig}
                      />
                    </div>
                    <div>
                      <CalculatorReturnChart
                        title={"Marriage Plan"}
                        data={chartData}
                        chartType="line"
                        chartConfig={chartConfig1}
                        chartTitle="Marriage Planning Projection"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
