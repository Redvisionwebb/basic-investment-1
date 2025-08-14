"use client";
import React, { useEffect, useState } from "react";
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

export default function Page() {
  const router = useRouter();
  const [monthlyInvestment, setMonthlyInvestment] = useState(500);
  const [investmentDuration, setInvestmentDuration] = useState(1);
  const [expectedReturn, setExpectedReturn] = useState(1);
  const [result, setResult] = useState(null);
  const [chartdata, setChartdata] = useState([]);

  const calculateSip = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/sip-calculator?monthlyInvestment=${monthlyInvestment}&investmentDuration=${investmentDuration}&expectedReturn=${expectedReturn}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      if (res.status === 200) {
        const data = res.data;
        const futureValue = data.futureValue;
        const totalInvestment = data.totalInvestment;
        const yearlyData = data.yearlyData;
        setResult({
          futureValue: Number(futureValue.toFixed(2)),
          totalInvestment: Number(totalInvestment.toFixed(2)),
        });
        setChartdata(yearlyData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Update the calculation when any of the investment values change
  useEffect(() => {
    calculateSip();
  }, [monthlyInvestment, investmentDuration, expectedReturn]);

  const setDuration = (years) => {
    const parsedYears = parseFloat(years);
    // if (!isNaN(parsedYears)) {
    setInvestmentDuration(parsedYears);
    // }
  };

  const handleCalculatorChange = (e) => {
    const selectedRoute = e.target.value;
    if (selectedRoute) {
      router.push(selectedRoute); // Navigate to selected route
    }
  };
  const chartConfig = {
    invested: {
      label: "Invested Amount",
      color: "var(--rv-primary)",
    },
    return: {
      label: "Return Amount",
      color: "var(--rv-gray)",
    },
  }

  const chartConfig1 = {
    investedAmount: {
      label: "Invested Amount",
      color: "var(--rv-primary)",
    },
    growth: {
      label: "Return Amount",
      color: "var(--rv-gray)",
    },
  };


  return (
    <div className="py-20">
      <div className="max-w-screen-xl mx-auto main_section">
        <div className="">
          <div className="mb-5 flex flex-col md:flex-row gap-5 justify-between">
            <div className="">
              <span className="text-2xl md:text-3xl font-bold uppercase">
                SIP Calculator
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
                  <div className="sip-calculator container mx-auto p-3 sticky top-24 z-10">
                    <div className="input-fields mt-5 mb-10">
                      <div>
                        <div className="flex justify-between">
                          <span>Monthly investment (₹)</span>
                          <div>
                            <input
                              type="number" // Change type to number for better input handling
                              value={monthlyInvestment}
                              placeholder="0"
                              onChange={(e) =>
                                setMonthlyInvestment(parseFloat(e.target.value))
                              }
                              className="font-semibold text-[var(--rv-primary] w-36 border px-2 py-2 rounded"
                            />
                          </div>
                        </div>
                        <input
                          type="range"
                          min="500"
                          max="100000"
                          step="100"
                          value={isNaN(monthlyInvestment) ? 0 : monthlyInvestment}
                          onChange={(e) =>
                            setMonthlyInvestment(parseFloat(e.target.value))
                          }
                          className="customRange w-full"
                          style={{
                            "--progress": `${(((isNaN(monthlyInvestment) ? 0 : monthlyInvestment) - 100) /
                              (100000 - 100)) *
                              100}%`,
                          }}
                        />
                      </div>
                      <div className="items-center mt-5">
                        <div className="flex justify-between">
                          <span>Time period (Y)</span>
                          <input
                            type="number" // Change type to number for better input handling
                            value={investmentDuration}
                            placeholder="0"
                            onChange={(e) => setDuration(e.target.value)} // Update duration
                            className="font-semibold text-[var(--rv-primary] w-20 border px-2 py-2 rounded"
                          />
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="40"
                          step="1"
                          value={isNaN(investmentDuration) ? 0 : investmentDuration}
                          onChange={(e) => setDuration(Number(e.target.value))} // Convert value to number
                          className="customRange w-full"
                          style={{
                            "--progress": `${(((isNaN(investmentDuration) ? 0 : investmentDuration) - 1) /
                              (40 - 1)) *
                              100}%`,
                          }}
                        />
                      </div>

                      <div className="items-center mt-5">
                        <div className="flex justify-between">
                          <span>Expected Return (Y)</span>
                          <input
                            type="number" // Change type to number for better input handling
                            value={expectedReturn}
                            placeholder="0"
                            onChange={(e) => setExpectedReturn(e.target.value)} // Update duration
                            className="font-semibold text-[var(--rv-primary] w-20   border px-2 py-2 rounded"
                          />
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="30"
                          step="1"
                          value={isNaN(expectedReturn) ? 0 : expectedReturn}
                          onChange={(e) =>
                            setExpectedReturn(Number(e.target.value))
                          } // Convert to number
                          style={{
                            "--progress": `${(((isNaN(expectedReturn) ? 0 : expectedReturn) - 1) /
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
                          <p>Invested Amount </p>
                          <p className="font-bold text-lg">
                            ₹{result?.totalInvestment.toFixed(2)}
                          </p>
                        </div>
                        <hr className="mb-3" />
                        <div className="flex justify-between px-5 mb-3">
                          <p>Wealth Gained </p>
                          <p className="font-bold text-lg">
                            ₹
                            {Math.floor(
                              result.futureValue - result.totalInvestment
                            ).toFixed(2)}
                          </p>
                        </div>
                        <hr className="mb-3" />
                        <div className="flex justify-between px-5 mb-3">
                          <p>Expected Amount </p>
                          <p className="font-bold text-lg">
                            ₹{result.futureValue.toFixed(2)}
                          </p>
                        </div>
                        <hr />
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="mb-3">
                    <SippieChart piedata={result} title={"SIP Calculator"} chartConfig={chartConfig} />
                  </div>
                  <div>
                    <CalculatorReturnChart data={chartdata} title="SIP" chartConfig={chartConfig1} />
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
