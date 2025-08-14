"use client";
import React, { useEffect, useState } from "react";
import "chart.js/auto";
import { Input } from "@/components/ui/input";
import { SippieChart } from "@/components/charts/sippiechart";
import { CalculatorReturnChart } from "@/components/charts/calculatorReturnChart";
import axios from "axios";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { calculators } from "@/data/calculators";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [isAuthorised, setIsAuthorised] = useState(false);
  const [loading, setLoading] = useState(true);
  const [monthlyInvestment, setMonthlyInvestment] = useState(1000);
  const [investmentDuration, setInvestmentDuration] = useState(5); // Duration in years
  const [expectedReturn, setExpectedReturn] = useState(5);
  const [stepUpPercentage, setStepUpPercentage] = useState(5); // Step-up percentage
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);

  const handleCalculatorChange = (e) => {
    const selectedRoute = e.target.value;
    if (selectedRoute) {
      router.push(selectedRoute); // Navigate to selected route
    }
  };

  const calculateStepUpSip = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/stepup-calculator?monthlyInvestment=${monthlyInvestment}&investmentDuration=${investmentDuration}&expectedReturn=${expectedReturn}&annualStepupPercentage=${stepUpPercentage}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      if (res.status === 200) {
        // console.log(res)
        const data = res.data;
        const totalInvestment = data.totalInvestment;
        const futureValue = data.futureValue;
        const yearlyData = data.yearlyData;
        setResult({
          totalInvestment: Math.round(totalInvestment),
          futureValue: Math.round(futureValue),
          wealthGained: Math.round(futureValue - totalInvestment),
        });
        setIsAuthorised(true);
        setChartData(yearlyData);
      }
    } catch (error) {
      setIsAuthorised(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // Update the calculation when any of the investment values change
  useEffect(() => {
    calculateStepUpSip();
  }, [monthlyInvestment, investmentDuration, expectedReturn, stepUpPercentage]);

  const setDuration = (years) => {
    const parsedYears = parseFloat(years);
    if (!isNaN(parsedYears)) {
      setInvestmentDuration(parsedYears);
    }
  };

  const chartConfig = {
    invested: {
      label: "Invested Amount",
      color: "var(--rv-primary)",
    },
    return: {
      label: "Growth",
      color: "var(--rv-gray)",
    },
  }

  const chartConfig1 = {
    investedAmount: {
      label: "Invested Amount",
      color: "var(--rv-primary)",
    },
    growth: {
      label: "Growth",
      color: "var(--rv-gray)",
    },
  };

  return (
    <div className="pt-20">
      <div className="max-w-screen-xl mx-auto main_section">
        <div className=" ">
          <div className="mb-5 flex flex-col md:flex-row gap-5 justify-between ">
            <div className="">
              <span className="text-2xl md:text-3xl font-bold uppercase">
                Step-Up SIP Calculator
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
            {isAuthorised ? (
              <div>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
                  <div className="col-span-1 border border-gray-200 rounded-2xl bg-white p-5">
                    <div className="sip-calculator container mx-auto p-3 sticky top-0 z-10">
                      <div className="input-fields mt-5 mb-10">
                        <div>
                          <div className="flex justify-between">
                            <span>Monthly investment (₹)</span>
                            <div>
                              <input
                                type="number"
                                value={monthlyInvestment}
                                onChange={(e) =>
                                  setMonthlyInvestment(
                                    parseFloat(e.target.value)
                                  )
                                }
                                className="font-semibold text-[var(--rv-primary)] w-36 border px-2 py-2 rounded"
                              />
                            </div>
                          </div>
                          <input
                            type="range"
                            min="500"
                            max="50000"
                            step="500"
                            value={isNaN(monthlyInvestment)
                              ? 0
                              : monthlyInvestment}
                            onChange={(e) =>
                              setMonthlyInvestment(parseFloat(e.target.value))
                            }
                            className="customRange w-full"
                            style={{
                              "--progress": `${(((isNaN(monthlyInvestment)
                                ? 0
                                : monthlyInvestment) -
                                500) /
                                (50000 - 500)) *
                                100}%`,
                            }}
                          />
                        </div>
                        <div className="items-center mt-5">
                          <div className="flex justify-between">
                            <span>Time period (Years)</span>
                            <input
                              type="number"
                              value={investmentDuration}
                              onChange={(e) => setDuration(e.target.value)}
                              className="font-semibold text-[var(--rv-primary)] w-20 border px-2 py-2 rounded"
                            />
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="40"
                            step="1"
                            value={isNaN(investmentDuration)
                              ? 0
                              : investmentDuration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="customRange w-full"
                            style={{
                              "--progress": `${(((isNaN(investmentDuration)
                                ? 0
                                : investmentDuration) -
                                1) /
                                (40 - 1)) *
                                100}%`,
                            }}
                          />
                        </div>

                        <div className="items-center mt-5">
                          <div className="flex justify-between">
                            <span>Expected Return (%)</span>
                            <input
                              type="number"
                              value={expectedReturn}
                              onChange={(e) =>
                                setExpectedReturn(parseFloat(e.target.value))
                              }
                              className="font-semibold text-[var(--rv-primary)] w-20 border px-2 py-2 rounded"
                            />
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="30"
                            step="1"
                            value={isNaN(expectedReturn)
                              ? 0
                              : expectedReturn}
                            onChange={(e) =>
                              setExpectedReturn(parseFloat(e.target.value))
                            }
                            style={{
                              "--progress": `${(((isNaN(expectedReturn)
                                ? 0
                                : expectedReturn) -
                                1) /
                                (30 - 1)) *
                                100}%`,
                            }}
                            className="customRange w-full"
                          />
                        </div>

                        {/* Step-up percentage field */}
                        <div className="items-center mt-5">
                          <div className="flex justify-between">
                            <span>Step-up Rate (%)</span>
                            <input
                              type="number"
                              value={stepUpPercentage}
                              onChange={(e) =>
                                setStepUpPercentage(parseFloat(e.target.value))
                              }
                              className="font-semibold text-[var(--rv-primary)] w-20 border px-2 py-2 rounded"
                            />
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="30"
                            step="1"
                            value={
                              isNaN(stepUpPercentage) ? 0 : stepUpPercentage
                            }
                            onChange={(e) =>
                              setStepUpPercentage(parseFloat(e.target.value))
                            }
                            style={{
                              "--progress": `${(((isNaN(stepUpPercentage)
                                ? 0
                                : stepUpPercentage) -
                                1) /
                                (30 - 1)) *
                                100}%`,
                            }}
                            className="customRange w-full"
                          />
                        </div>
                      </div>

                      {result && (
                        <div className="mt-5">
                          <div className="flex justify-between px-5 mb-3">
                            <p>Invested Amount</p>
                            <p className="font-bold text-lg">
                              ₹{result?.totalInvestment?.toLocaleString()}
                            </p>
                          </div>
                          <hr className="mb-3" />
                          <div className="flex justify-between px-5 mb-3">
                            <p>Growth</p>
                            <p className="font-bold text-lg">
                              ₹{result?.wealthGained?.toLocaleString()}
                            </p>
                          </div>
                          <hr className="mb-3" />
                          <div className="flex justify-between px-5 mb-3">
                            <p>Total Future Value</p>
                            <p className="font-bold text-lg">
                              ₹{result?.futureValue?.toLocaleString()}
                            </p>
                          </div>
                          <hr />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='col-span-1'>
                    <SippieChart
                      piedata={result}
                      title={'Current & Future Cost Of House Breakup'}
                      customLabels={{
                        invested: "Invested Amount",
                        return: "Growth",
                      }}
                      chartConfig={chartConfig}
                    />
                    <div>
                      <CalculatorReturnChart data={chartData} chartConfig={chartConfig1} title={"Step-Up Calculator"} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <h3 className="font-bold text-red-600 text-4xl mb-3">
                  Error 403
                </h3>
                <p className="font-medium text-xl">Your not Authorised</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
