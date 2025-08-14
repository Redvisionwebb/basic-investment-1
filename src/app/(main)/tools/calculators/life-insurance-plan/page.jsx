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

export default function Page() {
  const router = useRouter();
  const [loanAmount, setLoanAmount] = useState(100000); // Loan Amount
  const [currentFdRate, setCurrentFdRate] = useState(5); // Current FD Rate
  const [inflationRate, setInflationRate] = useState(5); // Inflation Rate
  const [protectionDuration, setProtectionDuration] = useState(5); // Duration in years
  const [monthlyExpenses, setMonthlyExpenses] = useState(10000); // Monthly Expenses
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);

  // Update the calculation when any of the values change
  useEffect(() => {
    const calculateInsurancePlan = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/life-insurance-calculator?loanAmount=${loanAmount}&currentFdRate=${currentFdRate}&protectionDuration=${protectionDuration}&inflationRate=${inflationRate}&monthlyExpenses=${monthlyExpenses}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`
        );
        if (res.status === 200) {
          const data = res.data;
          const loanAmount = data.loanAmount;
          const totalHouseholdExpenses = data.totalHouseholdExpenses;
          const totalInsuranceCover = data.totalInsuranceCover;
          const yearlyData = data.yearlyData;
          setResult({
            loanRepayment: loanAmount,
            householdExpenses: Math.round(totalHouseholdExpenses),
            totalInsuranceCover: Math.round(totalInsuranceCover),
          });
          setChartData(yearlyData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    calculateInsurancePlan();
  }, [
    loanAmount,
    currentFdRate,
    inflationRate,
    protectionDuration,
    monthlyExpenses,
  ]);
  const handleCalculatorChange = (e) => {
    const selectedRoute = e.target.value;
    if (selectedRoute) {
      router.push(selectedRoute); // Navigate to selected route
    }
  };


  const chartConfig = {
    invested: {
      label: "Insurance Expenses",
      color: "var(--rv-primary)",
    },
    return: {
      label: "Loan Repayment",
      color: "var(--rv-gray)",
    },
  }

  const chartConfig1 = {
    investedAmount: {
      label: "Insurance Cover",
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
            <div className="">
              <span className="text-2xl md:text-3xl font-bold uppercase">
                Life Insurance Planning Calculator
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
                  <div className="insurance-calculator container mx-auto p-3 sticky top-0 z-10">
                    <div className="input-fields mt-5 mb-10">
                      <div>
                        <div className="flex justify-between">
                          <span>Loan Amount (₹)</span>
                          <div>
                            <span className="font-semibold text-[var(--rv-primary)]">

                            </span>
                            <input
                              type="number"
                              value={loanAmount}
                              placeholder="0"
                              onChange={(e) =>
                                setLoanAmount(parseFloat(e.target.value))
                              }
                              className="font-semibold text-[var(--rv-primary)] w-36 border px-2 py-2 rounded"
                            />
                          </div>
                        </div>
                        <input
                          type="range"
                          min="10000"
                          max="10000000"
                          step="1000"
                          value={isNaN(loanAmount) ? 0 : loanAmount}
                          onChange={(e) =>
                            setLoanAmount(parseFloat(e.target.value))
                          }
                          className="customRange w-full"
                          style={{
                            "--progress": `${(((isNaN(loanAmount) ? 0 : loanAmount) - 10000) /
                              (10000000 - 10000)) *
                              100}%`,
                          }}
                        />
                      </div>
                      <div className="items-center mt-5">
                        <div className="flex justify-between">
                          <span>Current FD Rate (%)</span>
                          <input
                            type="number"
                            value={currentFdRate}
                            placeholder="0"
                            onChange={(e) =>
                              setCurrentFdRate(parseFloat(e.target.value))
                            }
                            className="font-semibold text-[var(--rv-primary)] w-20 border px-2 py-2 rounded"
                          />
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="15"
                          step="0.1"
                          value={isNaN(currentFdRate) ? 0 : currentFdRate}
                          onChange={(e) =>
                            setCurrentFdRate(parseFloat(e.target.value))
                          }
                          className="customRange w-full"
                          style={{
                            "--progress": `${(((isNaN(currentFdRate) ? 0 : currentFdRate) - 1) / (15 - 1)) *
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
                            placeholder="0"
                            onChange={(e) =>
                              setInflationRate(parseFloat(e.target.value))
                            }
                            className="font-semibold text-[var(--rv-primary)] w-20 border px-2 py-2 rounded"
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
                            "--progress": `${(((isNaN(inflationRate) ? 0 : inflationRate) - 1) / (30 - 1)) *
                              100}%`,
                          }}
                        />
                      </div>
                      <div className="items-center mt-5">
                        <div className="flex justify-between">
                          <span>
                            For How Many Years You Want To Protect Your Household
                            Expenses
                          </span>
                          <input
                            type="number"
                            value={protectionDuration}
                            placeholder="0"
                            onChange={(e) =>
                              setProtectionDuration(parseFloat(e.target.value))
                            }
                            className="font-semibold text-[var(--rv-primary)] w-20 border px-2 py-2 rounded"
                          />
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="40"
                          step="1"
                          value={isNaN(protectionDuration) ? 0 : protectionDuration}
                          onChange={(e) =>
                            setProtectionDuration(parseFloat(e.target.value))
                          }
                          className="customRange w-full"
                          style={{
                            "--progress": `${(((isNaN(protectionDuration) ? 0 : protectionDuration) - 1) /
                              (40 - 1)) *
                              100}%`,
                          }}
                        />
                      </div>
                      <div className="items-center mt-5">
                        <div className="flex justify-between">
                          <span>Monthly Expenses (₹)</span>
                          <div>

                            <input
                              type="number"
                              value={monthlyExpenses}
                              placeholder="0"
                              onChange={(e) =>
                                setMonthlyExpenses(parseFloat(e.target.value))
                              }
                              className="font-semibold text-[var(--rv-primary)] w-36 border px-2 py-2 rounded"
                            />
                          </div>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="500000"
                          step="1000"
                          value={isNaN(monthlyExpenses) ? 0 : monthlyExpenses}
                          onChange={(e) =>
                            setMonthlyExpenses(parseFloat(e.target.value))
                          }
                          className="customRange w-full"
                          style={{
                            "--progress": `${((isNaN(monthlyExpenses) ? 0 : monthlyExpenses) / 500000) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {result && (
                      <div className="mt-5">
                        <div className="flex justify-between px-5 mb-3">
                          <p>You need Life Insurance Cover Of</p>
                          <p className="font-bold text-lg">
                            ₹{result?.totalInsuranceCover?.toLocaleString()}
                          </p>
                        </div>
                        <hr className="mb-3" />
                        <div className="flex justify-between px-5 mb-3">
                          <p>Loan Repayment</p>
                          <p className="font-bold text-lg">
                            ₹{result?.loanRepayment?.toLocaleString()}
                          </p>
                        </div>
                        <hr className="mb-3" />
                        <div className="flex justify-between px-5 mb-3">
                          <p>Household Expenses</p>
                          <p className="font-bold text-lg">
                            ₹{result?.householdExpenses?.toLocaleString()}
                          </p>
                        </div>
                        <hr />
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-1 border border-gray-200 rounded-2xl bg-white p-5">
                  <div className="mb-10">
                    <SippieChart
                      piedata={{
                        totalInvestment: result?.totalInsuranceCover,
                        futureValue: result?.loanRepayment,
                      }}
                      title={"Life Insurance"}

                      chartConfig={chartConfig}
                    />
                  </div>
                  <div>
                    <CalculatorReturnChart
                      data={chartData}
                      title={"Life Insurance"}
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
