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
  const [sourceFundAmount, setSourceFundAmount] = useState(10000); // Initial investment in source fund
  const [transferToFundAmount, setTransferToFundAmount] = useState(500); // Amount to transfer to destination fund
  const [transferPeriod, setTransferPeriod] = useState(5); // Transfer period in years
  const [expectedReturnSource, setExpectedReturnSource] = useState(5); // Expected return from source fund
  const [expectedReturnDestination, setExpectedReturnDestination] = useState(5); // Expected return from destination fund
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);

  const calculateSTP = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/stp-calculator?sourceFundAmount=${sourceFundAmount}&transferToFundAmount=${transferToFundAmount}&transferPeriod=${transferPeriod}&expectedReturnSource=${expectedReturnSource}&expectedReturnDestination=${expectedReturnDestination}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      if (res.status === 200) {
        const data = res.data;
        const investedAmount = data.investedAmount;
        const futureValueSourceFund = data.futureValueSourceFund;
        const totalTransferred = data.totalTransferred;
        const resultantAmount = data.resultantAmount;
        const yearlyData = data.yearlyData;
        setResult({
          investedAmount,
          balanceInSourceFund: Math.round(futureValueSourceFund), // Remaining amount in the source fund
          amountTransferredToDestinationFund: totalTransferred, // Total amount transferred to the destination fund
          resultantAmount: Math.round(resultantAmount), // Final amount in the destination fund after growth
        });
        setIsAuthorised(true);
        setChartData(yearlyData);
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
    calculateSTP();
  }, [
    sourceFundAmount,
    transferToFundAmount,
    transferPeriod,
    expectedReturnSource,
    expectedReturnDestination,
  ]);

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
      label: "Resultant Amount",
      color: "var(--rv-gray)",
    },
  }

  const chartConfig1 = {
    investedAmount: {
      label: "Invested Amount",
      color: "var(--rv-primary)",
    },
    growth: {
      label: "Resultant Amountt",
      color: "var(--rv-gray)",
    },
  };


  return (
    <div className="pt-20">


      <div className="max-w-screen-xl mx-auto main_section">
        <div className="">
          <div className="mb-5 flex flex-col md:flex-row gap-5 justify-between">
            <div className="">
              <span className="text-2xl md:text-3xl font-bold uppercase">
                STP Calculator
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
                    <div className="input-fields mt-5 mb-10">
                      <div className="items-center mt-5">
                        <div className="flex justify-between">
                          <span>I want to invest in Source Fund (₹)</span>
                          <div>

                            <input
                              type="number"
                              placeholder="0"
                              value={sourceFundAmount}
                              onChange={(e) =>
                                setSourceFundAmount(parseFloat(e.target.value))
                              }
                              className="font-semibold text-[var(--rv-primary)] w-36  border px-2 py-2 rounded"
                            />
                          </div>
                        </div>
                        <input
                          type="range"
                          min="500"
                          max="10000000"
                          step="500"
                          value={isNaN(sourceFundAmount) ? 0 : sourceFundAmount}
                          onChange={(e) =>
                            setSourceFundAmount(parseFloat(e.target.value))
                          }
                          className="customRange w-full"
                          style={{
                            "--progress": `${(((isNaN(sourceFundAmount) ? 0 : sourceFundAmount) - 500) /
                              (10000000 - 500)) *
                              100}%`,
                          }}
                        />
                      </div>
                      <div className="items-center mt-5">
                        <div className="flex justify-between mt-5">
                          <span>I want to transfer to Destination Fund (₹)</span>
                          <div>

                            <input
                              type="number"
                              placeholder="0"

                              value={transferToFundAmount}
                              onChange={(e) =>
                                setTransferToFundAmount(
                                  parseFloat(e.target.value)
                                )
                              }
                              className="font-semibold text-[var(--rv-primary)] w-36  border px-2 py-2 rounded"
                            />
                          </div>
                        </div>
                        <input
                          type="range"
                          min="500"
                          max="1000000"

                          step="500"
                          value={isNaN(transferToFundAmount) ? 0 : transferToFundAmount}
                          onChange={(e) =>
                            setTransferToFundAmount(parseFloat(e.target.value))
                          }
                          className="customRange w-full"
                          style={{
                            "--progress": `${(((isNaN(transferToFundAmount) ? 0 : transferToFundAmount) - 500) /
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
                          className="customRange w-full"
                          style={{
                            "--progress": `${(((isNaN(transferPeriod) ? 0 : transferPeriod) - 1) /
                              (30 - 1)) *
                              100}%`,
                          }}
                        />
                      </div>
                      <div className="items-center mt-5">
                        <div className="flex justify-between mt-5">
                          <span>Expected Rate of Return from Source Fund (%)</span>
                          <input
                            type="number"
                            placeholder="0"

                            value={expectedReturnSource}
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
                          className="customRange w-full"
                          style={{
                            "--progress": `${(((isNaN(expectedReturnSource) ? 0 : expectedReturnSource) - 1) /
                              (30 - 1)) *
                              100}%`,
                          }}
                        />
                      </div>
                      <div className="items-center mt-5">
                        <div className="flex justify-between mt-5">
                          <span>
                            Expected Rate of Return from Destination Fund (%)
                          </span>
                          <input
                            type="number"
                            placeholder="0"

                            value={expectedReturnDestination}
                            onChange={(e) =>
                              setExpectedReturnDestination(
                                parseFloat(e.target.value)
                              )
                            }
                            className="font-semibold text-[var(--rv-primary)] w-20 border px-2 py-2 rounded"
                          />
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="30"
                          step="1"
                          value={isNaN(expectedReturnDestination) ? 0 : expectedReturnDestination}
                          onChange={(e) =>
                            setExpectedReturnDestination(
                              parseFloat(e.target.value)
                            )
                          }
                          className="customRange w-full"
                          style={{
                            "--progress": `${(((isNaN(expectedReturnDestination) ? 0 : expectedReturnDestination) - 1) /
                              (30 - 1)) *
                              100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {result && (
                      <div className="mt-5">
                        <div className="flex justify-between px-5 mb-3">
                          <p>Invested Amount</p>
                          <p className="font-bold text-lg">
                            ₹{result?.investedAmount?.toLocaleString()}
                          </p>
                        </div>
                        <hr className="mb-3" />
                        <div className="flex justify-between px-5 mb-3">
                          <p>Balance Amount in Source Fund</p>
                          <p className="font-bold text-lg">
                            ₹{result?.balanceInSourceFund?.toLocaleString()}
                          </p>
                        </div>
                        <hr className="mb-3" />
                        <div className="flex justify-between px-5 mb-3">
                          <p>Amount Transferred to Destination Fund</p>
                          <p className="font-bold text-lg">
                            ₹
                            {result?.amountTransferredToDestinationFund?.toLocaleString()}
                          </p>
                        </div>
                        <hr className="mb-3" />
                        <div className="flex justify-between px-5 mb-3">
                          <p>Resultant Amount</p>
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
                      title={"STP Calculator"}
                      customLabels={{
                        invested: "Household Expenses",
                        return: "Loan Repayment",
                      }}
                      chartConfig={chartConfig}

                    />
                    <CalculatorReturnChart
                      chartConfig={chartConfig1}
                      data={chartData}
                      title={"STP Calculator"}
                    />
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
