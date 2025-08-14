"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import router
import "chart.js/auto";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
// import { input } from "@/components/ui/input";
import { SippieChart } from "@/components/charts/sippiechart";
import { CalculatorReturnChart } from "@/components/charts/calculatorReturnChart";
import axios from "axios";
import { calculators } from "@/data/calculators";

export default function Page() {
  const router = useRouter();

  const [totalInvestment, setCurrentExpenses] = useState(10000);
  const [investmentDuration, setInvestmentDuration] = useState(5);
  const [expectedReturn, setExpectedReturn] = useState(5);
  const [inflationRate, setInflationRate] = useState(5);
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const calculateCarPlan = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/car-plan?currentCarCost=${totalInvestment}&planCarInYears=${investmentDuration}&expectedReturn=${expectedReturn}&inflationRate=${inflationRate}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`
        );
        if (res.status === 200) {
          const data = res.data;
          setResult({
            totalInvestment: data.currentCarCost,
            futureValue: Math.round(data.futureCarCost),
            lumpsumInvestment: Math.round(data.lumpsumInvestment),
            sipInvestment: Math.round(data.sipInvestment),
          });
          setChartData(data.yearlyData);
        }
      } catch (error) {
        // console.log(error);
      }
    };
    calculateCarPlan();
  }, [totalInvestment, investmentDuration, expectedReturn, inflationRate]);

  // console.log(totalInvestment)
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
        <div className=" ">
          <div className="mb-5 flex flex-col md:flex-row gap-5 justify-between ">
            <div className="">
              <span className="text-2xl md:text-3xl font-bold uppercase">
                Car Planning Calculator
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
            <div>
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
                <div className="col-span-1 border border-gray-200 rounded-2xl bg-white p-5">
                  <div className="sip-calculator container mx-auto p-3 sticky top-0 z-10">
                    <div className="input-fields mt-5 mb-10">
                      <div>
                        <div className="flex justify-between">
                          <p>Current Cost (₹)</p>
                          <div>
                            <input
                              type="number"
                              placeholder="0"
                              value={totalInvestment}
                              onChange={(e) =>
                                setCurrentExpenses(parseFloat(e.target.value))
                              }
                              className="font-semibold text-[var(--rv-primary] w-30 border px-2 py-2 rounded"
                            />
                          </div>
                        </div>
                        <input
                          type="range"
                          min="1000000"
                          max="100000000"
                          step="1000"
                          value={isNaN(totalInvestment) ? 0 : totalInvestment}
                          onChange={(e) =>
                            setCurrentExpenses(parseFloat(e.target.value))
                          }
                          className="customRange w-full"
                          style={{
                            "--progress":
                              (((isNaN(totalInvestment) ? 0 : totalInvestment) - 1000000) /
                                (100000000 - 1000000)) *
                              100 +
                              "%",
                          }}
                        />
                      </div>
                      <div className="items-center mt-5">
                        <div className="flex justify-between">
                          <p>
                            After How Many Years Do You Wish To Plan Your Dream
                            Car (Y)
                          </p>
                          <input
                            type="number"
                            value={investmentDuration}
                            placeholder="0"
                            onChange={(e) =>
                              setInvestmentDuration(parseFloat(e.target.value))
                            }
                            className="font-semibold text-[var(--rv-primary] w-16 border px-2 py-2 rounded"
                          />
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="40"
                          step="1"
                          value={isNaN(investmentDuration) ? 0 : investmentDuration}
                          onChange={(e) =>
                            setInvestmentDuration(parseFloat(e.target.value))
                          }
                          className="customRange w-full"
                          style={{
                            "--progress": `${(((isNaN(investmentDuration) ? 0 : investmentDuration) - 1) / (40 - 1)) * 100
                              }%`,
                          }}
                        />
                      </div>
                      <div className="items-center mt-5">
                        <div className="flex justify-between">
                          <p>Rate of Return (%)</p>
                          <input
                            type="number"
                            value={expectedReturn}
                            placeholder="0"
                            onChange={(e) =>
                              setExpectedReturn(parseFloat(e.target.value))
                            }
                            className="font-semibold text-[var(--rv-primary] w-16 border px-2 py-2 rounded"
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
                            "--progress": `${(((isNaN(expectedReturn) ? 0 : expectedReturn) - 1) / (30 - 1)) * 100
                              }%`,
                          }}
                        />
                      </div>
                      <div className="items-center mt-5">
                        <div className="flex justify-between">
                          <p>Inflation Rate (%)</p>
                          <input
                            type="number"
                            value={inflationRate}
                            placeholder=""
                            onChange={(e) =>
                              setInflationRate(parseFloat(e.target.value))
                            }
                            className="font-semibold text-[var(--rv-primary] w-16 border px-2 py-2 rounded"
                          />
                        </div>
                        <input
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
                            "--progress": `${(((isNaN(inflationRate) ? 0 : inflationRate) - 1) / (30 - 1)) * 100
                              }%`,
                          }}
                        />
                      </div>
                    </div>

                    {result && (
                      <div className="mt-5">
                        <div className="flex justify-between px-5 mb-3">
                          <p>Current Cost of Car</p>
                          <p className="font-bold text-lg">
                            ₹{result?.totalInvestment?.toLocaleString()}
                          </p>
                        </div>
                        <hr className="mb-3" />
                        <div className="flex justify-between px-5 mb-3">
                          <p>Future Cost of Car</p>
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
                    title={"Current & Future Cost Of Car Breakup"}

                    chartConfig={chartConfig}
                  />
                  <div className="mt-5">
                    <CalculatorReturnChart
                      data={chartData}
                      title={"Car Planning "}
                      chartConfig={chartConfig1}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
