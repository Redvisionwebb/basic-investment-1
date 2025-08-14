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
import { useRouter } from "next/navigation";
import { calculators } from "@/data/calculators";

export default function CrorepatiPlanningCalculator() {
  const router = useRouter();
  const [currentAge, setCurrentAge] = useState(10); // Current age of the child
  const [crorepatiStartAge, setCrorepatiStartAge] = useState(18); // Age at which Crorepati starts
  const [targetWealth, setTargetWealth] = useState(50000000); // Target wealth in INR
  const [currentSavings, setCurrentSavings] = useState(100000); // Current savings
  const [expectedReturn, setExpectedReturn] = useState(7); // Expected annual return in %
  const [inflationRate, setInflationRate] = useState(5); // Inflation rate in %

  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const calculateCrorepatiPlan = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/crorepati-calculator?currentAge=${currentAge}&crorepatiAge=${crorepatiStartAge}&targetedWealth=${targetWealth}&currentSavings=${currentSavings}&expectedReturn=${expectedReturn}&inflationRate=${inflationRate}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`
        );
        if (res.status === 200) {
          const data = res.data;
          // console.log(data)
          const futureTargetWealth = data.futureTargetWealth;
          const savingsGrowth = data.savingsGrowth;
          const finalTargetWealth = data.finalTargetWealth;
          const sipInvestmentRequired = data.sipInvestmentRequired;
          const totalSIPInvestment = data.totalSIPInvestment;
          const sipGrowth = data.sipGrowth;
          const sipFutureValue = data.sipFutureValue;
          const yearlyData = data.yearlyData;
          setResult({
            futureTargetWealth: Math.round(futureTargetWealth),
            growthOfSavings: Math.round(savingsGrowth),
            finalTargetWealth: Math.round(finalTargetWealth),
            sipInvestmentRequired: Math.round(sipInvestmentRequired),
            totalSIPInvestment: Math.round(totalSIPInvestment),
            sipGrowth: Math.round(sipGrowth),
            sipFutureValue: Math.round(sipFutureValue),
          });
          setChartData(yearlyData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    calculateCrorepatiPlan();
  }, [
    currentAge,
    crorepatiStartAge,
    targetWealth,
    currentSavings,
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
      label: "Current Cost of Car",
      color: "var(--rv-primary)",
    },
    return: {
      label: "Future Cost of Car",
      color: "var(--rv-gray)",
    },
  }

  const chartConfig1 = {
    investedAmount: {
      label: "Current Cost of Car",
      color: "var(--rv-primary)",
    },
    growth: {
      label: "Future Cost of Car",
      color: "var(--rv-gray)",
    },
  };

  return (
    <div className="pt-20">
      <div className="max-w-screen-xl mx-auto main_section">
        <div className="">
          <div className="mb-5 flex flex-col md:flex-row gap-5 justify-between ">
            <div className="">
              <span className="text-2xl md:text-3xl font-bold uppercase">
                Crorepati Planning Calculator
              </span>
            </div>
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
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
              <div className="col-span-1">
                <div className="border border-gray-200 rounded-2xl bg-white p-5">
                  <div className="sip-calculator container mx-auto p-3">
                    <div className="input-fields mt-5 mb-10">
                      {/* Target Wealth */}
                      <div>
                        <div className="flex justify-between mt-5">
                          <span>Target Wealth (₹) ?</span>
                          <div>
                            <input
                              type="number"
                              value={targetWealth}
                              placeholder="0"
                              onChange={(e) =>
                                setTargetWealth(
                                  parseFloat(e.target.value.replace(/,/g, ""))
                                )
                              }
                              className="font-semibold text-var(--rv-primary) w-36  border px-2 py-2 rounded"
                            />
                          </div>
                        </div>
                        <input
                          type="range"
                          min="1000000"
                          max="1000000000"
                          step="100000"
                          value={isNaN(targetWealth) ? 0 : targetWealth}
                          onChange={(e) =>
                            setTargetWealth(parseFloat(e.target.value))
                          }
                          className="customRange w-full"
                          style={{
                            "--progress":
                              (((isNaN(targetWealth) ? 0 : targetWealth) -
                                1000000) /
                                (1000000000 - 1000000)) *
                              100 +
                              "%",
                          }}
                        />
                      </div>
                      {/* Current Age */}
                      <div className="items-center mt-5 mb-5">
                        <div className="flex justify-between">
                          <span>Current Age</span>
                          <input
                            type="number"
                            value={currentAge}
                            placeholder="0"
                            onChange={(e) =>
                              setCurrentAge(parseFloat(e.target.value))
                            }
                            className="font-semibold text-var(--rv-primary) w-20  border px-2 py-2 rounded"
                          />
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="80"
                          step="1"
                          value={isNaN(currentAge) ? 0 : currentAge}
                          onChange={(e) =>
                            setCurrentAge(parseFloat(e.target.value))
                          }
                          className="customRange w-full"
                          style={{
                            "--progress":
                              (((isNaN(currentAge) ? 0 : currentAge) - 1) /
                                (80 - 1)) *
                              100 +
                              "%",
                          }}
                        />
                      </div>
                      {/* Crorepati Start Age */}
                      <div className="items-center mt-5 mb-5">
                        <div className="flex justify-between">
                          <span>Age at the Time of Crorepati</span>
                          <input
                            type="number"
                            value={crorepatiStartAge}
                            placeholder="0"
                            onChange={(e) =>
                              setCrorepatiStartAge(parseFloat(e.target.value))
                            }
                            className="font-semibold text-var(--rv-primary) w-20  border px-2 py-2 rounded"
                          />
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          step="1"
                          value={
                            isNaN(crorepatiStartAge) ? 0 : crorepatiStartAge
                          }
                          onChange={(e) =>
                            setCrorepatiStartAge(parseFloat(e.target.value))
                          }
                          className="customRange w-full"
                          style={{
                            "--progress":
                              (((isNaN(crorepatiStartAge)
                                ? 0
                                : crorepatiStartAge) -
                                10) /
                                (100 - 10)) *
                              100 +
                              "%",
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
                            className="font-semibold text-var(--rv-primary) w-20  border px-2 py-2 rounded"
                          />
                        </div>
                        <input
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
                            "--progress":
                              (((isNaN(expectedReturn) ? 0 : expectedReturn) -
                                1) /
                                (30 - 1)) *
                              100 +
                              "%",
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
                            className="font-semibold text-var(--rv-primary) w-20  border px-2 py-2 rounded"
                          />
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          step="1"
                          value={isNaN(inflationRate) ? 0 : inflationRate}
                          onChange={(e) =>
                            setInflationRate(parseFloat(e.target.value))
                          }
                          className="customRange w-full"
                          style={{
                            "--progress":
                              (((isNaN(inflationRate) ? 0 : inflationRate) -
                                1) /
                                (20 - 1)) *
                              100 +
                              "%",
                          }}
                        />
                      </div>
                      <div className="items-center mt-5">
                        {/* Current Savings */}
                        <div className="flex justify-between">
                          <span>Current Savings (INR)?</span>
                          <div>
                            <input
                              type="number"
                              value={currentSavings}
                              placeholder="0"
                              onChange={(e) =>
                                setCurrentSavings(
                                  parseFloat(e.target.value.replace(/,/g, ""))
                                )
                              }
                              className="font-semibold text-var(--rv-primary) w-36  border px-2 py-2 rounded"
                            />
                          </div>
                        </div>
                        <input
                          type="range"
                          min="1000000"
                          max="1000000000"
                          step="100000"
                          value={isNaN(currentSavings) ? 0 : currentSavings}
                          onChange={(e) =>
                            setCurrentSavings(parseFloat(e.target.value))
                          }
                          className="customRange w-full"
                          style={{
                            "--progress":
                              (((isNaN(currentSavings) ? 0 : currentSavings) -
                                1000000) /
                                (1000000000 - 1000000)) *
                              100 +
                              "%",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-2xl bg-white p-5">
                  {result && (
                    <div>
                      <div className="flex justify-between px-5 mb-3">
                        <p>Your Targeted Wealth (Inflation Adjusted)</p>
                        <p className="font-bold text-lg">
                          ₹ {result.futureTargetWealth.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex justify-between px-5 mb-3">
                        <p>Growth of Savings</p>
                        <p className="font-bold text-lg">
                          ₹ {result.growthOfSavings.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex justify-between px-5 mb-3">
                        <p>Monthly SIP Amount Required</p>
                        <p className="font-bold text-lg">
                          ₹ {result.sipInvestmentRequired.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex justify-between px-5 mb-3">
                        <p>
                          Amount Invested through SIP in{" "}
                          {crorepatiStartAge - currentAge} years
                        </p>
                        <p className="font-bold text-lg">
                          ₹ {result.totalSIPInvestment.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex justify-between px-5 mb-3">
                        <p>SIP Growth</p>
                        <p className="font-bold text-lg">
                          ₹ {result.sipGrowth.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex justify-between px-5 mb-3">
                        <p>Future Value of SIP</p>
                        <p className="font-bold text-lg">
                          ₹ {result.sipFutureValue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-1">
                <SippieChart
                  piedata={{
                    totalInvestment: result?.sipFutureValue,
                    futureValue: result?.totalSIPInvestment
                  }}
                  title={'Education Planning Projection'}
                  chartConfig={chartConfig}
                  className="mb-4"
                />
                <CalculatorReturnChart data={chartData} chartConfig={chartConfig1} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
