"use client";
import React, { useEffect, useState } from "react";
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
  const [investedAmount, setInvestedAmount] = useState(10000); // Initial investment in source fund
  const [withdrawalAmount, setWithdrawalAmount] = useState(500); // Amount to transfer to destination fund
  const [transferPeriod, setTransferPeriod] = useState(5); // Transfer period in years
  const [expectedReturnSource, setExpectedReturnSource] = useState(5); // Expected return from source fund
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);

  const calculateSTP = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/swp-calculator?investedAmount=${investedAmount}&withdrawalAmount=${withdrawalAmount}&timePeriod=${transferPeriod}&expectedReturn=${expectedReturnSource}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      if (res.status === 200) {
        const data = res.data;
        const totalInvestment = data.totalInvestment;
        const totalWithdrawn = data.totalWithdrawn;
        const totalGrowth = data.totalGrowth;
        const currentValue = data.currentValue;
        const yearlyData = data.yearlyData;
        setChartData(yearlyData);
        setResult({
          investedAmount: totalInvestment,
          balanceInSourceFund: Math.round(totalWithdrawn), // Remaining amount in the source fund
          amountTransferredToDestinationFund: totalGrowth, // Total amount transferred to the destination fund
          resultantAmount: Math.round(currentValue), // Final amount in the destination fund after growth
        });
      }
      setIsAuthorised(true);
    } catch (error) {
      console.log(error);
      setIsAuthorised(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateSTP();
  }, [investedAmount, withdrawalAmount, transferPeriod, expectedReturnSource]);

  const handleCalculatorChange = (e) => {
    const selectedRoute = e.target.value;
    if (selectedRoute) {
      router.push(selectedRoute); // Navigate to selected route
    }
  };

  const chartConfig = {
    invested: {
      label: "Total Investment",
      color: "var(--rv-primary)",
    },
    return: {
      label: "Current Value",
      color: "var(--rv-gray)",
    },
  }

  const chartConfig1 = {
    investedAmount: {
      label: "Total Investment",
      color: "var(--rv-primary)",
    },
    growth: {
      label: "Current Value",
      color: "var(--rv-gray)",
    },
  };

  return (
    <div className="pt-20">
      <div className="max-w-screen-xl mx-auto main_section">
        <div className="">
          <div className="mb-5 flex flex-col md:flex-row gap-5 justify-between">
            <span className="text-2xl md:text-3xl font-bold uppercase">
              SWP Calculator
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
                <div className="mb-10"></div>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
                  <div className="col-span-1 border border-gray-200 rounded-2xl bg-white p-5">
                    <div className="input-fields mt-5 mb-10">
                      <div className="items-center mt-5">
                        <div className="flex justify-between">
                          <span>Lumpsum Invested Amount (₹)</span>
                          <div>

                            <input
                              type="number"
                              value={investedAmount}
                              placeholder=""
                              onChange={(e) =>
                                setInvestedAmount(parseFloat(e.target.value))
                              }
                              className="font-semibold text-[var(--rv-primary)] w-36 border px-2 py-2 rounded"
                            />
                          </div>
                        </div>
                        <input
                          type="range"
                          min="10000"
                          max="10000000"
                          step="500"
                          value={isNaN(investedAmount) ? 0 : investedAmount}
                          onChange={(e) =>
                            setInvestedAmount(parseFloat(e.target.value))
                          }
                          className="customRange w-full"
                          style={{
                            "--progress": `${(((isNaN(investedAmount) ? 0 : investedAmount) - 10000) /
                              (10000000 - 10000)) *
                              100}%`,
                          }}
                        />
                      </div>
                      <div className="items-center mt-5">
                        <div className="flex justify-between mt-5">
                          <span>SWP Withdrawal Amount (₹)</span>
                          <div>

                            <input
                              type="number"
                              value={withdrawalAmount}
                              placeholder="0"
                              onChange={(e) =>
                                setWithdrawalAmount(parseFloat(e.target.value))
                              }
                              className="font-semibold text-[var(--rv-primary)] w-36 border px-2 py-2 rounded"
                            />
                          </div>
                        </div>
                        <input
                          type="range"
                          min="500"
                          max="1000000"
                          step="500"
                          value={isNaN(withdrawalAmount) ? 0 : withdrawalAmount}
                          onChange={(e) =>
                            setWithdrawalAmount(parseFloat(e.target.value))
                          }
                          className="customRange w-full"
                          style={{
                            "--progress": `${(((isNaN(withdrawalAmount) ? 0 : withdrawalAmount) - 500) /
                              (1000000 - 500)) *
                              100}%`,
                          }}
                        />
                      </div>
                      <div className="items-center mt-5">
                        <div className="flex justify-between mt-5">
                          <span>For a period of (years)</span>
                          <input
                            type="number"
                            value={transferPeriod}
                            placeholder="0"
                            onChange={(e) =>
                              setTransferPeriod(parseFloat(e.target.value))
                            }
                            className="font-semibold text-[var(--rv-primary)] w-20 border px-2 py-2 rounded"
                          />
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="30"
                          step="1"
                          value={isNaN(transferPeriod) ? 0 : transferPeriod}
                          onChange={(e) =>
                            setTransferPeriod(parseFloat(e.target.value))
                          }
                          className="customRange w-full text-gray-400"
                          style={{
                            "--progress": `${((isNaN(transferPeriod) ? 0 : transferPeriod - 1) / (30 - 1)) *
                              100}%`,
                          }}
                        />
                      </div>
                      <div className="items-center mt-5">
                        <div className="flex justify-between mt-5">
                          <span>Expected Rate of Return (%)</span>
                          <input
                            type="number"
                            value={expectedReturnSource}
                            placeholder="0"
                            onChange={(e) =>
                              setExpectedReturnSource(parseFloat(e.target.value))
                            }
                            className="font-semibold text-[var(--rv-primary)] w-20 border px-2 py-2 rounded"
                          />
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="30"
                          step="1"
                          value={isNaN(expectedReturnSource) ? 0 : expectedReturnSource}
                          onChange={(e) =>
                            setExpectedReturnSource(parseFloat(e.target.value))
                          }
                          className="customRange w-full text-gray-400"
                          style={{
                            "--progress": `${(((isNaN(expectedReturnSource) ? 0 : expectedReturnSource) - 1) /
                              (30 - 1)) *
                              100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {result && (
                      <div className="mt-5">
                        <div className="flex justify-between px-5 mb-3">
                          <p>Total Investment</p>
                          <p className="font-bold text-lg">
                            ₹{result?.investedAmount?.toLocaleString()}
                          </p>
                        </div>
                        <hr className="mb-3" />
                        <div className="flex justify-between px-5 mb-3">
                          <p>Total Withdrawal</p>
                          <p className="font-bold text-lg">
                            ₹{result?.balanceInSourceFund?.toLocaleString()}
                          </p>
                        </div>
                        <hr className="mb-3" />
                        <div className="flex justify-between px-5 mb-3">
                          <p>Total Growth</p>
                          <p className="font-bold text-lg">
                            ₹
                            {result?.amountTransferredToDestinationFund?.toLocaleString()}
                          </p>
                        </div>
                        <hr className="mb-3" />
                        <div className="flex justify-between px-5 mb-3">
                          <p>Current Value</p>
                          <p className="font-bold text-lg">
                            ₹{result?.resultantAmount?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-span-1">
                    <SippieChart
                      piedata={{
                        totalInvestment: result?.investedAmount,
                        futureValue: result?.resultantAmount,
                      }}
                      title={"SWP Calculator"}

                      chartConfig={chartConfig}
                    />
                    <CalculatorReturnChart
                      data={chartData}
                      title={"SWP Calculator"}
                      chartConfig={chartConfig1}
                    />
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
