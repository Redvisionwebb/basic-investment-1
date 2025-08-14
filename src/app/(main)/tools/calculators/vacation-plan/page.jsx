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
  const [totalInvestment, setCurrentExpenses] = useState(10000); // Current cost of vacation
  const [investmentDuration, setInvestmentDuration] = useState(5); // Duration in years
  const [expectedReturn, setExpectedReturn] = useState(5); // Expected annual return
  const [inflationRate, setInflationRate] = useState(5); // Inflation rate
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);

  const handleCalculatorChange = (e) => {
    const selectedRoute = e.target.value;
    if (selectedRoute) {
      router.push(selectedRoute); // Navigate to selected route
    }
  };
  const calculateVacationPlan = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/vacation-plan?planHolidayInYears=${investmentDuration}&currentExpense=${totalInvestment}&expectedReturn=${expectedReturn}&inflationRate=${inflationRate}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      if (res.status === 200) {
        const data = res.data;
        const totalInvestment = data.totalInvestment;
        const lumpsumInvestment = data.lumpsumInvestment;
        const futureVacationCost = data.futureVacationCost;
        const sipInvestment = data.sipInvestment;
        const yearlyData = data.yearlyData;
        setResult({
          totalInvestment,
          futureValue: Math.round(futureVacationCost),
          lumpsumInvestment: Math.round(lumpsumInvestment),
          sipInvestment: Math.round(sipInvestment),
        });
        setChartData(yearlyData);
        setIsAuthorised(true);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorised(false);
    } finally {
      setLoading(false);
    }
  };
  // Update the calculation when any of the values change
  useEffect(() => {
    calculateVacationPlan();
  }, [totalInvestment, investmentDuration, expectedReturn, inflationRate]);


  const chartConfig = {
    invested: {
      label: "Current Cost of Vacation",
      color: "var(--rv-primary)",
    },
    return: {
      label: "Future Cost of Vacation",
      color: "var(--rv-gray)",
    },
  }

  const chartConfig1 = {
    investedAmount: {
      label: "Current Cost of Vacation",
      color: "var(--rv-primary)",
    },
    growth: {
      label: "Future Cost of Vacation",
      color: "var(--rv-gray)",
    },
  };

  return (
    <div className="pt-20">
      <div className="max-w-screen-xl mx-auto main_section">
        <div className="">
          <div className="mb-5 flex flex-col md:flex-row gap-5 justify-between">
            <span className="text-2xl md:text-3xl font-bold uppercase">
              Vacation Plan Calculator
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
            {isAuthorised ? (
              <div>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
                  <div className="col-span-1 border border-gray-200 rounded-2xl bg-white p-5">
                    <div className="sip-calculator container mx-auto p-3 sticky top-0 z-10">
                      <div className="input-fields mt-5 mb-10">
                        <div>
                          <div className="flex justify-between">
                            <span>Current Vacation Expenses (₹)</span>
                            <div>

                              <input
                                type="number"
                                value={totalInvestment}
                                onChange={(e) =>
                                  setCurrentExpenses(parseFloat(e.target.value))
                                }
                                className="font-semibold text-[var(--rv-primary)] w-36 border px-2 py-2 rounded"
                              />
                            </div>
                          </div>
                          <input
                            type="range"
                            min="10000"
                            max="200000"
                            step="100"
                            value={totalInvestment || 0}
                            onChange={(e) =>
                              setCurrentExpenses(parseFloat(e.target.value))
                            }
                            className="customRange w-full text-gray-400"
                            style={{
                              "--progress": `${((totalInvestment - 10000) /
                                (200000 - 10000)) *
                                100}%`,
                            }}
                          />
                        </div>
                        <div className="items-center mt-5">
                          <div className="flex justify-between">
                            <span>
                              After How Many Years Do You Wish To Plan Your
                              Holiday?
                            </span>
                            <input
                              type="number"
                              value={investmentDuration}
                              onChange={(e) =>
                                setInvestmentDuration(parseFloat(e.target.value))
                              }
                              className="font-semibold text-[var(--rv-primary)] w-20 border px-2 py-2 rounded"
                            />
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="40"
                            step="1"
                            value={investmentDuration || 0}
                            onChange={(e) =>
                              setInvestmentDuration(parseFloat(e.target.value))
                            }
                            className="customRange w-full text-gray-400"
                            style={{
                              "--progress": `${((investmentDuration - 1) /
                                (40 - 1)) *
                                100}%`,
                            }}
                          />
                        </div>
                        <div className="items-center mt-5">
                          <div className="flex justify-between">
                            <span>Rate of Return (%)</span>
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
                            value={expectedReturn || 0}
                            onChange={(e) =>
                              setExpectedReturn(parseFloat(e.target.value))
                            }
                            className="customRange w-full text-gray-400"
                            style={{
                              "--progress": `${((expectedReturn - 1) / (30 - 1)) *
                                100}%`,
                            }}
                          />
                        </div>
                        <div className="items-center mt-5">
                          <div className="flex justify-between">
                            <span>Inflation Rate (%)</span>
                            <input
                              type="number"
                              value={inflationRate}
                              onChange={(e) =>
                                setInflationRate(parseFloat(e.target.value))
                              }
                              className="font-semibold text-[var(--rv-primary)] w-20 border px-2 py-2 rounded"
                            />
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="30"
                            step="1"
                            value={inflationRate || 0}
                            onChange={(e) =>
                              setInflationRate(parseFloat(e.target.value))
                            }
                            className="customRange w-full text-gray-400"
                            style={{
                              "--progress": `${(inflationRate / 30) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      {result && (
                        <div className="mt-5">
                          <div className="flex justify-between px-5 mb-3">
                            <p>Current Cost of Vacation</p>
                            <p className="font-bold text-lg">
                              ₹{result?.totalInvestment?.toLocaleString()}
                            </p>
                          </div>
                          <hr className="mb-3" />
                          <div className="flex justify-between px-5 mb-3">
                            <p>Future Cost of Vacation</p>
                            <p className="font-bold text-lg">
                              ₹{result?.futureValue?.toLocaleString()}
                            </p>
                          </div>
                          <hr className="mb-3" />
                          <div className="flex justify-between px-5 mb-3">
                            <p>Planning Through SIP</p>
                            <p className="font-bold text-lg">
                              ₹{result?.sipInvestment?.toLocaleString()}
                            </p>
                          </div>
                          <hr className="mb-3" />
                          <div className="flex justify-between px-5 mb-3">
                            <p>Planning Through Lump Sum</p>
                            <p className="font-bold text-lg">
                              ₹{result?.lumpsumInvestment?.toLocaleString()}
                            </p>
                          </div>
                          <hr />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <SippieChart
                      piedata={result}
                      title={"Current & Future Cost Of Vacation Breakup"}
                      chartConfig={chartConfig}
                    />
                    <div className="mt-5">
                      <CalculatorReturnChart
                        data={chartData}
                        title={"Vacation Planning "}
                        chartConfig={chartConfig1}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <span className="font-bold text-red-600 text-4xl mb-3">
                  Error 403
                </span>
                <p className="font-medium text-xl">Your not Authorised</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
