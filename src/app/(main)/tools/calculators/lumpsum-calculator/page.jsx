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
import { SippieChart } from "@/components/charts/sippiechart";
import { CalculatorReturnChart } from "@/components/charts/calculatorReturnChart";
import { calculator } from "@/data/calculators";
import { Skeleton } from "@/components/ui/skeleton";

// 🔹 Reusable Slider Input Component
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

// 🔹 Result Display Component
const ResultDisplay = ({ result }) => (
  <div className="mt-5 space-y-3">
    {[
      { label: "Invested Amount", value: result.totalInvestment },
      { label: "Wealth Gained", value: result.futureValue - result.totalInvestment },
      { label: "Expected Amount", value: result.futureValue },
    ].map((item, i) => (
      <div key={i}>
        <div className="flex flex-col md:flex-row justify-between px-5 mb-1">
          <p>{item.label}</p>
          <p className="font-bold text-lg">
            ₹{Math.floor(item.value)?.toLocaleString("en-IN")}
          </p>
        </div>
        <hr />
      </div>
    ))}
  </div>
);

export default function Page() {
  const router = useRouter();
  const [oneTimeInvestment, setOneTimeInvestment] = useState(500);
  const [investmentDuration, setInvestmentDuration] = useState(1);
  const [expectedReturn, setExpectedReturn] = useState(1);
  const [result, setResult] = useState(null);
  const [chartdata, setChartdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [siteData, setSiteData] = useState();

  const handlePdf = async (result) => {
    let calResult = {
      labels: ['Invested Amount', 'Wealth Gained', 'Expected Amount'],
      totalInvestment: result.totalInvestment,
      futureValue: result.futureValue - result.totalInvestment,
      sipInvestment: result.futureValue,
    }
    generateCalculatorsPDF(calResult, "Lumpsum Calculator", "2023-01-01", "2023-12-31", "chartGraph", "barGraph", siteData);
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
  // 🔹 Fetch calculation data
  const calculateLumpsum = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/lumpsum-calculator`,
        {
          params: {
            oneTimeInvestment,
            investmentDuration,
            expectedReturn,
          },
        }
      );

      if (res.status === 200) {
        const data = res.data;
        setResult({
          futureValue: Number(data.futureValue?.toFixed(2)),
          totalInvestment: Number(data.totalInvestment?.toFixed(2)),
        });
        setChartdata(data.yearlyData);
      }
    } catch (error) {
      console.error("Calculation error:", error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  // 🔹 Initial load (show full-page skeleton)
  useEffect(() => {
    if (firstLoad) {
      calculateLumpsum(true);
      setFirstLoad(false);
    } else {
      calculateLumpsum();
    }
  }, [oneTimeInvestment, investmentDuration, expectedReturn]);

  const handleCalculatorChange = (e) => {
    const selectedRoute = e.target.value;
    if (selectedRoute) router.push(selectedRoute);
  };

  const chartConfig = {
    invested: { label: "Total Investment", color: "var(--rv-primary)" },
    return: { label: "Future Value", color: "var(--rv-secondary)" },
  };

  const chartConfig1 = {
    investedAmount: { label: "Total Investment", color: "var(--rv-primary)" },
    growth: { label: "Future Value", color: "var(--rv-secondary)" },
  };

  // 🔹 Full-page skeleton (for first load only)
  if (loading && firstLoad) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 px-5">
        <Skeleton className="h-8 w-64" />
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 w-full max-w-6xl">
          <div className="border border-[var(--rv-primary)] rounded-2xl bg-white p-6 space-y-6">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="border border-[var(--rv-primary)] rounded-2xl bg-white p-6 space-y-6">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-60 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <InnerBanner title="Lumpsum Calculator" />
      <div className="section main-section">
        <div className="max-w-screen-xl mx-auto px-3">
          <div className="mb-5 flex flex-col md:flex-row gap-5 justify-between">
            <div className="space-x-4">
              <span className="text-2xl md:text-3xl font-bold uppercase">
                Lumpsum Calculator
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() =>
                        handlePdf(
                          result,
                          "Car Planning",
                          "2023-01-01",
                          "2023-12-31",
                          siteData
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
                {calculator.map((calc) => (
                  <option key={calc.title} value={calc.route}>
                    {calc.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 🔹 Calculator UI */}
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
            {/* Left Side */}
            <div className="col-span-1 border border-[var(--rv-primary)] rounded-2xl bg-white p-2 md:p-5">
              <div className="container mx-auto p-3 sticky top-24 z-10">
                {/* Inputs */}
                <InputSlider
                  label="Total Investment (₹)"
                  min={500}
                  max={1000000}
                  step={100}
                  value={oneTimeInvestment}
                  setValue={setOneTimeInvestment}
                />
                <InputSlider
                  label="Time Period (Years)"
                  min={1}
                  max={40}
                  step={1}
                  value={investmentDuration}
                  setValue={setInvestmentDuration}
                />
                <InputSlider
                  label="Expected Return (%)"
                  min={1}
                  max={30}
                  step={1}
                  value={expectedReturn}
                  setValue={setExpectedReturn}
                />

                {/* 🔹 Result Section */}
                {result && <ResultDisplay result={result} />}
              </div>
            </div>

            {/* Right Side (Charts) */}
            <div className="col-span-1">
              <div id="chartGraph">
                <SippieChart
                  piedata={result}
                  title="Lumpsum Calculator"
                  chartConfig={chartConfig}
                />
              </div>
              <div className="mt-4" id="barGraph">
                <CalculatorReturnChart
                  data={chartdata}
                  title="Lumpsum"
                  chartConfig={chartConfig1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
