"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import InnerBanner from "@/components/innerBanner/InnerBanner";
import { generateCalculatorsPDF } from "@/lib/generatePdf";
import { BsFileEarmarkPdf } from "react-icons/bs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { calculator } from "@/data/calculators";
import { EmipieChart } from "@/components/charts/emipiechart";
import { CalculatorReturnChart } from "@/components/charts/calculatorReturnChart";

// 🔹 Reusable InputSlider Component
const InputSlider = ({ label, min, max, step, value, setValue, unit = "" }) => {
  const formatNumber = (num) => (num ? num.toLocaleString("en-IN") : "0");

  const handleChange = (e) => {
    const numericString = e.target.value.replace(/,/g, "").replace(/[^\d.]/g, "");
    const numericValue = parseFloat(numericString);
    setValue(!isNaN(numericValue) ? numericValue : 0);
  };

  return (
    <div className="mt-5">
      <div className="flex justify-between mb-2">
        <span>{label}</span>
        <input
          type="text"
          value={formatNumber(value)}
          onChange={handleChange}
          className="font-semibold text-[var(--rv-primary)] w-32 border px-2 py-2 rounded text-right"
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={isNaN(value) ? 0 : value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        className="customRange w-full"
        style={{
          "--progress": `${(((isNaN(value) ? 0 : value) - min) / (max - min)) * 100}%`,
        }}
      />
    </div>
  );
};

// 🔹 Skeleton Loader Component
const FullPageSkeleton = () => (
  <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 animate-pulse">
    {/* Left Panel Skeleton */}
    <div className="border border-[var(--rv-primary)] rounded-2xl bg-white p-5 space-y-5">
      <div className="h-6 w-2/3 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-32 bg-gray-200 rounded mt-5"></div>
    </div>

    {/* Right Panel Skeleton */}
    <div className="space-y-4">
      <div className="h-72 bg-gray-200 rounded-xl"></div>
      <div className="h-80 bg-gray-200 rounded-xl"></div>
    </div>
  </div>
);

export default function Page() {
  const router = useRouter();

  const [loanAmount, setLoanAmount] = useState(100000);
  const [loanTenure, setLoanTenure] = useState(5);
  const [interestRate, setInterestRate] = useState(7);
  const [emi, setEmi] = useState(null);
  const [totalAmountPayable, setTotalAmountPayable] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);

  // ✅ New: Only show skeleton on initial load
  const [loading, setLoading] = useState(true);
  const [siteData, setSiteData] = useState();
  console.log(totalAmountPayable)
  const handlePdf = async () => {
    let calResult = {
      labels: ['Loan EMI', 'Principal Loan Amount', 'Total Interest Payable', 'Total Payment (Principal + Interest)'],
      totalInvestment: emi,
      futureValue: loanAmount,
      sipInvestment: totalInterest,
      lumpsumInvestment: totalAmountPayable,
    }
    generateCalculatorsPDF(calResult, "EMI Calculator", "2023-01-01", "2023-12-31", "chartGraph", "barGraph", siteData);
  };

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/site-settings`
        );
        if (res.status === 200) {
          setSiteData(res.data[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSiteData();
  }, []);

  useEffect(() => {
    const calculateEmi = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/emi-calculator?loanAmount=${loanAmount}&loanTenure=${loanTenure}&interestRate=${interestRate}`
        );
        if (res.status === 200) {
          const data = res.data;
          setResult({
            principalamount: Math.round(data.principal),
            intrestamount: Math.round(data.totalInterestPaid),
          });
          setChartData(data.yearlyData);
          setEmi(Math.round(data.emiCalculated));
          setTotalAmountPayable(Math.round(data.totalPayment));
          setTotalInterest(Math.round(data.totalInterestPaid));

          // ✅ Only turn off skeleton after first API call
          if (loading) setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    calculateEmi();
  }, [loanAmount, loanTenure, interestRate]);

  const handleCalculatorChange = (e) => {
    const selectedRoute = e.target.value;
    if (selectedRoute) router.push(selectedRoute);
  };

  const chartConfig1 = {
    investedAmount: { label: "Principal Amount", color: "var(--rv-primary)" },
    growth: { label: "Intrest Amount", color: "var(--rv-secondary)" },
  };

  // ✅ Show skeleton only if loading on first load
  if (loading) return <FullPageSkeleton />;

  return (
    <div>
      <InnerBanner title={"EMI Calculator"} />
      <div className="section main-section">
        <div className="max-w-screen-xl mx-auto p-2">
          <div className="mb-2 flex flex-col md:flex-row gap-5 justify-between ">
            <div className="space-x-4">
              <span className="text-2xl md:text-3xl font-bold uppercase">
                EMI Calculator
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() =>
                        handlePdf(
                          result
                        )
                      }
                      className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                      <BsFileEarmarkPdf size={22} className="text-red-500" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black">
                    <p>Download PDF</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex flex-col justify-between">
              <span>Explore other calculators</span>
              <select
                className="w-full border border-gray-500 rounded-lg p-2"
                onChange={handleCalculatorChange}
                defaultValue=""
              >
                <option value="" disabled>Select</option>
                {calculator.map((calc) => (
                  <option key={calc.title} value={calc.route}>
                    {calc.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
            {/* Left Panel - Inputs and Results */}
            <div className="col-span-1 border border-[var(--rv-primary)] rounded-2xl bg-white p-2 md:p-5">
              {/* Loan Amount Slider */}
              <InputSlider
                label="Loan Amount (₹)"
                min={100000}
                max={100000000}
                step={1000}
                value={loanAmount}
                setValue={setLoanAmount}
              />
              {/* Loan Tenure Slider */}
              <InputSlider
                label="Loan Tenure (Years)"
                min={1}
                max={40}
                step={1}
                value={loanTenure}
                setValue={setLoanTenure}
              />
              {/* Interest Rate Slider */}
              <InputSlider
                label="Interest Rate (%)"
                min={1}
                max={30}
                step={0.1}
                value={interestRate}
                setValue={setInterestRate}
              />

              {emi && (
                <div className="mt-10  p-2">
                  <div className="mb-4 text-center flex flex-col md:flex-row justify-between">
                    <h2 className="text-2xl font-bold text-gray-700">Loan EMI</h2>
                    <p className="text-2xl font-extrabold text-[var(--rv-primary)]">
                      ₹{emi.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="mb-4 text-center flex flex-col md:flex-row justify-between">
                    <p className="text-lg text-gray-600">Principal Loan Amount</p>
                    <p className="text-xl font-bold text-gray-800">
                      ₹{loanAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="mb-4 text-center flex flex-col md:flex-row justify-between">
                    <p className="text-lg text-gray-600">Total Interest Payable</p>
                    <p className="text-xl font-bold text-gray-800">
                      ₹{totalInterest.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="mb-4 text-center flex flex-col md:flex-row justify-between">
                    <p className="text-lg text-gray-600">
                      Total Payment (Principal + Interest)
                    </p>
                    <p className="text-xl font-bold  text-gray-800">
                      ₹{totalAmountPayable.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Charts */}
            <div className="col-span-1">
              <div className="border border-[var(--rv-primary)] rounded-xl" id="chartGraph">
                <EmipieChart piedata={result} title={"EMI Breakdown"} />
              </div>
              <div className="mt-4" id="barGraph">
                <CalculatorReturnChart
                  chartConfig={chartConfig1}
                  data={chartData}
                  title={"EMI Breakdown"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
