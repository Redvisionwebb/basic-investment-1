"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import InnerBanner from "@/components/innerBanner/InnerBanner";
import { generateCalculatorsPDF } from "@/lib/generatePdf";
import { BsFileEarmarkPdf } from "react-icons/bs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SippieChart } from "@/components/charts/sippiechart";
import { CalculatorReturnChart } from "@/components/charts/calculatorReturnChart";
import { planning } from "@/data/calculators";

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

// 🔹 Reusable ResultDisplay Component
const ResultDisplay = ({ result }) => (
  <div className="mt-5 space-y-3 rounded-2xl p-5 bg-white shadow">
    {[
      { label: "Total Insurance Cover", value: result.totalInsuranceCover },
      { label: "Loan Repayment", value: result.loanRepayment },
      { label: "Household Expenses", value: result.householdExpenses },
    ].map((item, i) => (
      <div key={i}>
        <div className="flex flex-col md:flex-row justify-between mb-1">
          <p>{item.label}</p>
          <p className="font-bold text-lg">
            ₹{Math.floor(item.value)?.toLocaleString("en-IN")}
          </p>
        </div>
        {i !== 2 && <hr />}
      </div>
    ))}
  </div>
);

// 🔹 Skeleton Loader Component
const FullPageSkeleton = () => (
  <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 animate-pulse mt-10">
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
  const [currentFdRate, setCurrentFdRate] = useState(5);
  const [inflationRate, setInflationRate] = useState(5);
  const [protectionDuration, setProtectionDuration] = useState(5);
  const [monthlyExpenses, setMonthlyExpenses] = useState(10000);
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [siteData, setSiteData] = useState();

  const handlePdf = async (result) => {
    let calResult = {
      labels: ['Total Insurance Cover', 'Loan Repayment', 'Household Expenses'],
      totalInvestment: result.totalInsuranceCover,
      futureValue: result.householdExpenses,
      sipInvestment: result.loanRepayment,
    }
    generateCalculatorsPDF(calResult, "Life Insurance Planning Calculator", "2023-01-01", "2023-12-31", "chartGraph", "barGraph", siteData);
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

  // Fetch calculator results
  useEffect(() => {
    const calculateInsurancePlan = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/life-insurance-calculator?loanAmount=${loanAmount}&currentFdRate=${currentFdRate}&protectionDuration=${protectionDuration}&inflationRate=${inflationRate}&monthlyExpenses=${monthlyExpenses}`
        );
        if (res.status === 200) {
          const data = res.data;
          setResult({
            loanRepayment: data.loanAmount,
            householdExpenses: Math.round(data.totalHouseholdExpenses),
            totalInsuranceCover: Math.round(data.totalInsuranceCover),
          });
          setChartData(data.yearlyData);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    calculateInsurancePlan();
  }, [loanAmount, currentFdRate, inflationRate, protectionDuration, monthlyExpenses]);

  const handleCalculatorChange = (e) => {
    const selectedRoute = e.target.value;
    if (selectedRoute) router.push(selectedRoute);
  };

  const chartConfig = {
    invested: { label: "Insurance Expenses", color: "var(--rv-primary)" },
    return: { label: "Loan Repayment", color: "var(--rv-secondary)" },
  };

  const chartConfig1 = {
    investedAmount: { label: "Insurance Cover", color: "var(--rv-primary)" },
    growth: { label: "Current Value", color: "var(--rv-secondary)" },
  };

  return (
    <div>
      <InnerBanner title={"Life Insurance Planning Calculator"} />
      <div className="section main-section  ">
        <div className="max-w-screen-xl mx-auto p-2 md:p-0">
          <div className="mb-5 flex flex-col md:flex-row gap-5 justify-between">
            <div className="space-x-1">
              <span className="text-2xl md:text-3xl font-bold uppercase">
                Life Insurance Planning Calculator
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() =>
                        handlePdf(
                          result,
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
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <span>Explore other calculators</span>
              <select
                className="w-full border border-gray-500 rounded-lg p-2"
                onChange={handleCalculatorChange}
                defaultValue=""
              >
                <option value="" disabled>
                  Select
                </option>
                {planning.map((calc) => (
                  <option key={calc.title} value={calc.route}>
                    {calc.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
            {/* Left Panel: Inputs + Result */}
            <div className="col-span-1 border border-[var(--rv-primary)] rounded-2xl bg-white p-2 md:p-5">
              <InputSlider label="Loan Amount (₹)" min={10000} max={10000000} step={1000} value={loanAmount} setValue={setLoanAmount} />
              <InputSlider label="Current FD Rate (%)" min={1} max={15} step={0.1} value={currentFdRate} setValue={setCurrentFdRate} />
              <InputSlider label="Inflation Rate (%)" min={1} max={30} step={1} value={inflationRate} setValue={setInflationRate} />
              <InputSlider label="Protection Duration (Years)" min={1} max={40} step={1} value={protectionDuration} setValue={setProtectionDuration} />
              <InputSlider label="Monthly Expenses (₹)" min={0} max={500000} step={1000} value={monthlyExpenses} setValue={setMonthlyExpenses} />

              {result && <ResultDisplay result={result} />}
            </div>

            {/* Right Panel: Charts */}
            <div className="col-span-1 space-y-4">
              <div id="chartGraph">
                <SippieChart
                  piedata={{ totalInvestment: result?.totalInsuranceCover, futureValue: result?.loanRepayment }}
                  title={"Life Insurance"}
                  chartConfig={chartConfig}
                />
              </div>
              <div id="barGraph">
                <CalculatorReturnChart
                  data={chartData}
                  title={"Life Insurance"}
                  chartConfig={chartConfig1}
                />
              </div>
            </div>
          </div>

          {/* Full Page Skeleton */}
          {loading && <FullPageSkeleton />}
        </div>
      </div>
    </div>
  );
}
