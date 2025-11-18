"use client";
import React, { useEffect, useState } from "react";

import { SippieChart } from "@/components/charts/sippiechart";
import { CalculatorReturnChart } from "@/components/charts/calculatorReturnChart";
import axios from "axios";
import { calculator } from "@/data/calculators";
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

export default function Page() {
  const router = useRouter();
  const [isAuthorised, setIsAuthorised] = useState(false);
  const [loading, setLoading] = useState(true);
  const [monthlyInvestment, setMonthlyInvestment] = useState(1000);
  const [investmentDuration, setInvestmentDuration] = useState(5);
  const [expectedReturn, setExpectedReturn] = useState(5);
  const [stepUpPercentage, setStepUpPercentage] = useState(5);
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [siteData, setSiteData] = useState();

  const handlePdf = async (result) => {
    let calResult = {
      labels: ['Invested Amount', 'Growth', 'Total Future Value'],
      totalInvestment: result.totalInvestment,
      futureValue: result.futureValue,
      sipInvestment: result.wealthGained,
    }
    generateCalculatorsPDF(calResult, "Step-up Calculator", "2023-01-01", "2023-12-31", "chartGraph", "barGraph", siteData);
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
  const handleCalculatorChange = (e) => {
    const selectedRoute = e.target.value;
    if (selectedRoute) router.push(selectedRoute);
  };

  const calculateStepUpSip = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/stepup-calculator?monthlyInvestment=${monthlyInvestment}&investmentDuration=${investmentDuration}&expectedReturn=${expectedReturn}&annualStepupPercentage=${stepUpPercentage}`
      );
      if (res.status === 200) {
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
      console.log(error);
      setIsAuthorised(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateStepUpSip();
  }, [monthlyInvestment, investmentDuration, expectedReturn, stepUpPercentage]);

  const setDuration = (years) => {
    const parsed = parseFloat(years);
    if (!isNaN(parsed)) setInvestmentDuration(parsed);
  };

  const chartConfig = {
    invested: { label: "Invested Amount", color: "var(--rv-primary)" },
    return: { label: "Growth", color: "var(--rv-secondary)" },
  };

  const chartConfig1 = {
    investedAmount: { label: "Invested Amount", color: "var(--rv-primary)" },
    growth: { label: "Growth", color: "var(--rv-secondary)" },
  };

  return (
    <div>
      <InnerBanner title={"STEP Calculator"} />
      <div className="section main-section">
        <div className="max-w-screen-xl mx-auto px-2">
          <div className="mb-2 flex flex-col md:flex-row gap-5 justify-between">
            <div className="space-x-4">
              <span className="text-2xl md:text-3xl font-bold uppercase">
                Step Up Calculator
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
                <option value="" disabled>
                  Select
                </option>
                {calculator.map((calc) => (
                  <option key={calc.title} value={calc.route}>
                    {calc.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            // 🦴 Skeleton Loader
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
          ) : isAuthorised ? (
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
              {/* Input + Result */}
              <div className="col-span-1 border border-[var(--rv-primary)] rounded-2xl bg-white p-2 md:p-5">
                <div className="mt-5 mb-10 space-y-5">
                  {/* Monthly Investment */}
                  <InputSlider
                    label="Monthly investment (₹)"
                    min={500}
                    max={50000}
                    step={500}
                    value={monthlyInvestment}
                    setValue={setMonthlyInvestment}
                  />

                  {/* Duration */}
                  <InputSlider
                    label="Time period (Years)"
                    min={1}
                    max={40}
                    step={1}
                    value={investmentDuration}
                    setValue={setDuration}
                  />

                  {/* Expected Return */}
                  <InputSlider
                    label="Expected Return (%)"
                    min={1}
                    max={30}
                    step={1}
                    value={expectedReturn}
                    setValue={setExpectedReturn}
                  />

                  {/* Step-up Rate */}
                  <InputSlider
                    label="Step-up Rate (%)"
                    min={1}
                    max={30}
                    step={1}
                    value={stepUpPercentage}
                    setValue={setStepUpPercentage}
                  />
                </div>

                {result && (
                  <ResultDisplay result={result} />
                )}
              </div>

              {/* Charts */}
              <div className="col-span-1">
                <div className="mb-3" id="chartGraph">
                  <SippieChart
                    piedata={result}
                    title="Current & Future Cost Of House Breakup"
                    customLabels={{
                      invested: "Invested Amount",
                      return: "Growth",
                    }}
                    chartConfig={chartConfig}
                  />
                </div>
                <div id="barGraph">
                  <CalculatorReturnChart
                    data={chartData}
                    chartConfig={chartConfig1}
                    title="Step-Up Calculator"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <h3 className="font-bold text-red-600 text-4xl mb-3">
                Error 403
              </h3>
              <p className="font-medium text-xl">You are not Authorised</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* --- 🔧 Reusable Subcomponents --- */

const InputSlider = ({ label, min, max, step, value, setValue }) => {
  // Format number with commas (Indian style)
  const formatNumber = (num) => {
    if (!num && num !== 0) return "";
    return num.toLocaleString("en-IN");
  };

  // Handle typing
  const handleChange = (e) => {
    // Remove all non-digit characters except dot
    const numericString = e.target.value.replace(/,/g, "").replace(/[^\d.]/g, "");
    const numericValue = parseFloat(numericString);

    // Update value safely
    if (!isNaN(numericValue)) {
      setValue(numericValue);
    } else {
      setValue(0);
    }
  };

  return (
    <div className="mt-5">
      <div className="flex justify-between">
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
const ResultDisplay = ({ result }) => (
  <div className="mt-5 space-y-3">
    {[
      { label: "Invested Amount", value: result.totalInvestment },
      { label: "Growth", value: result.wealthGained },
      { label: "Total Future Value", value: result.futureValue },
    ].map((item, i) => (
      <div key={i}>
        <div className="flex flex-col md:flex-row justify-between px-5 mb-1">
          <p>{item.label}</p>
          <p className="font-bold text-lg">
            {Math.floor(item.value)?.toLocaleString("en-IN")}
          </p>
        </div>
        <hr />
      </div>
    ))}
  </div>
);
