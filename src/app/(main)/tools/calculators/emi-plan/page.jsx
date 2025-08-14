"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { SippieChart } from "@/components/charts/sippiechart";
import { CalculatorReturnChart } from "@/components/charts/calculatorReturnChart";
import { EmipieChart } from "@/components/charts/emipiechart";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import axios from "axios";
import { calculators } from "@/data/calculators";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const [loanAmount, setLoanAmount] = useState(100000); // Principal loan amount
    const [loanTenure, setLoanTenure] = useState(5); // Loan tenure in years
    const [interestRate, setInterestRate] = useState(7); // Annual interest rate
    const [emi, setEmi] = useState(null);
    const [totalAmountPayable, setTotalAmountPayable] = useState(null);
    const [totalInterest, setTotalInterest] = useState(null);
    const [result, setResult] = useState(null);
    const [chartData, setChartData] = useState([]);



    useEffect(() => {
        const calculateEmi = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/emi-calculator?loanAmount=${loanAmount}&loanTenure=${loanTenure}&interestRate=${interestRate}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`);
                if (res.status === 200) {
                    const data = res.data
                    const principal = data.principal;
                    const totalInterestPaid = data.totalInterestPaid;
                    const yearlyData = data.yearlyData;
                    const emiCalculated = data.emiCalculated;
                    const totalPayment = data.totalPayment;
                    setResult({
                        principalamount: Math.round(principal),
                        intrestamount: Math.round(totalInterestPaid),
                    });
                    setChartData(yearlyData);
                    setEmi(Math.round(emiCalculated));
                    setTotalAmountPayable(Math.round(totalPayment));
                    setTotalInterest(Math.round(totalInterestPaid));
                }
            }
            catch (error) {
                console.log(error)
            }

        };
        calculateEmi();
    }, [loanAmount, loanTenure, interestRate]);
    const handleCalculatorChange = (e) => {
        const selectedRoute = e.target.value;
        if (selectedRoute) {
            router.push(selectedRoute); // Navigate to selected route
        }
    };


    const chartConfig1 = {
        investedAmount: {
            label: "Principal Amount",
            color: "var(--rv-primary)",
        },
        growth: {
            label: "Intrest Amount",
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
                                EMI Calculator
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
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
                        <div className="col-span-1 border border-gray-200 rounded-2xl bg-white p-5">
                            <div className="input-fields mt-5 mb-10">
                                <div className="mb-5">
                                    <div className="flex justify-between">
                                        <span>Loan Amount (₹)</span>
                                        <input
                                            type="number"
                                            value={loanAmount}
                                            placeholder="0"
                                            onChange={(e) => setLoanAmount(parseFloat(e.target.value))}
                                            className="font-semibold text-[var(--rv-primary)] w-36 border px-2 py-2 rounded"
                                        />
                                    </div>
                                    <input
                                        type="range"
                                        min="100000"
                                        max="100000000"
                                        step="1000"
                                        value={isNaN(loanAmount) ? 0 : loanAmount}
                                        onChange={(e) => setLoanAmount(parseFloat(e.target.value))}
                                        className="customRange w-full"
                                        style={{
                                            "--progress":
                                                (((isNaN(loanAmount) ? 0 : loanAmount) - 1000000) /
                                                    (100000000 - 1000000)) *
                                                100 +
                                                "%",
                                        }}
                                    />
                                </div>
                                <div className="mb-5">
                                    <div className="flex justify-between">
                                        <span>Loan Tenure (Years)</span>
                                        <input
                                            type="number"
                                            value={loanTenure}
                                            placeholder="0"
                                            onChange={(e) => setLoanTenure(parseFloat(e.target.value))}
                                            className="font-semibold text-[var(--rv-primary)] w-20 border px-2 py-2 rounded"
                                        />
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="40"
                                        step="1"
                                        value={isNaN(loanTenure) ? 0 : loanTenure}
                                        onChange={(e) => setLoanTenure(parseFloat(e.target.value))}
                                        className="customRange w-full"
                                        style={{
                                            "--progress":
                                                (((isNaN(loanTenure) ? 0 : loanTenure) - 1) /
                                                    (40 - 1)) *
                                                100 +
                                                "%",
                                        }}
                                    />
                                </div>
                                <div className="mb-5">
                                    <div className="flex justify-between">
                                        <span>Interest Rate (%)</span>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={interestRate}
                                            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                                            className="font-semibold text-[var(--rv-primary)] w-20 border px-2 py-2 rounded"
                                        />
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="30"
                                        step="0.1"
                                        value={interestRate}
                                        onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                                        className="customRange w-full"
                                        style={{
                                            "--progress":
                                                (((isNaN(interestRate) ? 0 : interestRate) - 1) /
                                                    (30 - 1)) *
                                                100 +
                                                "%",
                                        }}
                                    />
                                </div>
                            </div>

                            {emi && (
                                <div className="mt-40 bg-gray-50 p-5 rounded-lg shadow">
                                    <div className="">
                                        <div className="mb-4 text-center flex justify-between">
                                            <h2 className="text-2xl font-bold text-gray-700">Loan EMI</h2>
                                            <p className="text-2xl font-extrabold text-[var(--rv-primary)]">₹{emi.toLocaleString()}</p>
                                        </div>
                                        <div className="mb-4 text-center flex justify-between">
                                            <p className="text-lg text-gray-600">Principal Loan Amount</p>
                                            <p className="text-xl font-bold text-gray-800">₹{loanAmount.toLocaleString()}</p>
                                        </div>
                                        <div className="mb-4 text-center flex justify-between">
                                            <p className="text-lg text-gray-600">Total Interest Payable</p>
                                            <p className="text-xl font-bold text-gray-800">₹{totalInterest.toLocaleString()}</p>
                                        </div>
                                        <div className="mb-4 text-center flex justify-between">
                                            <p className="text-lg text-gray-600">Total Payment (Principal + Interest)</p>
                                            <p className="text-xl font-bold text-gray-800">₹{totalAmountPayable.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="col-span-1">
                            <EmipieChart
                                piedata={result}
                                title={"EMI Breakdown"}

                            />
                            <div className="mt-5">
                                <CalculatorReturnChart chartConfig={chartConfig1} data={chartData} title={'EMI Breakdown'} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}