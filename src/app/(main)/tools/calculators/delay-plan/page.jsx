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

const ResultDisplay = ({ result }) => {
  if (!result) return null;

  const resultItems = [
    { label: "Total Value", value: result.totalInvestment },
    { label: "Future Value without Delay", value: result.futureValue },
    { label: "Cost of Delay in Future Value", value: result.sipInvestment },
    { label: "Future Value after Delay", value: result.lumpsumInvestment },
  ];

  return (
    <div className="mt-5 space-y-3 rounded-2xl p-5 bg-white shadow">
      {resultItems.map((item, i) => (
        <div key={i}>
          <div className="flex flex-col md:flex-row justify-between mb-1">
            <p>{item.label}</p>
            <p className="font-bold text-lg">
              ₹{Math.floor(item.value)?.toLocaleString("en-IN")}
            </p>
          </div>
          {i !== resultItems.length - 1 && <hr />}
        </div>
      ))}
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

export default function DelayCostCalculator() {
  const router = useRouter();
  const [monthlySIP, setMonthlySIP] = useState(5000);
  const [timePeriod, setTimePeriod] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [delayMonths, setDelayMonths] = useState(6);

  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ initial loading state
  const [siteData, setSiteData] = useState();

  const handlePdf = async (result) => {
    generateCalculatorsPDF(result, "Delay Cost Calculator", "2023-01-01", "2023-12-31", "chartGraph", "barGraph", siteData);
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

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/delay-calculator`,
        {
          params: {
            monthlyInvestment: monthlySIP,
            investmentDuration: timePeriod,
            expectedReturn: expectedReturn,
            delayInMonths: delayMonths,
          },
        }
      );
      if (res.status === 200) {
        const data = res.data;
        setResult({
          labels: ['Total Value', 'Future Value without Delay', 'Cost of Delay in Future Value', 'Future Value after Delay'],
          totalInvestment: Math.round(data.totalAmountInvested),
          futureValue: Math.round(data.futureValueWithoutDelay),
          lumpsumInvestment: Math.round(data.futureValueAfterDelay),
          sipInvestment: Math.round(data.costOfDelay),
        });
        setChartData(data.yearlyData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // ✅ stop skeleton after initial load
    }
  };

  // Only run on initial load
  useEffect(() => {
    fetchData();
  }, []);

  // Update results when input changes
  useEffect(() => {
    if (!loading) fetchData();
  }, [monthlySIP, timePeriod, expectedReturn, delayMonths]);

  const handleCalculatorChange = (e) => {
    const selectedRoute = e.target.value;
    if (selectedRoute) router.push(selectedRoute);
  };

  const chartConfig = {
    invested: { label: "Total Value", color: "var(--rv-primary)" },
    return: { label: "Future Value without Delay", color: "var(--rv-secondary)" },
  };

  const chartConfig1 = {
    investedAmount: { label: "Total Value", color: "var(--rv-primary)" },
    growth: { label: "Future Value without Delay", color: "var(--rv-secondary)" },
  };

  // ✅ show skeleton only initially

  return (
    <div>
      <InnerBanner title="Delay Cost Calculator" />
      {loading ? (<FullPageSkeleton />) : (
        <div className="section main-section max-w-screen-xl mx-auto">
          <div className="mb-2 flex flex-col md:flex-row gap-5 justify-between p-2 md:p-0">
            <div className="space-x-4">
              <span className="text-2xl md:text-3xl font-bold uppercase">
                Delay Cost Calculator
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
                {planning.map((calc) => (
                  <option key={calc.title} value={calc.route}>
                    {calc.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4 p-2 md:p-0">
            {/* Left Panel - Input Sliders */}
            <div className="border border-[var(--rv-primary)] rounded-2xl bg-white p-2 md:p-5">
              <InputSlider
                label="Monthly SIP (₹)"
                min={500}
                max={100000}
                step={500}
                value={monthlySIP}
                setValue={setMonthlySIP}
              />
              <InputSlider
                label="Time Period (Years)"
                min={1}
                max={30}
                step={1}
                value={timePeriod}
                setValue={setTimePeriod}
              />
              <InputSlider
                label="Expected Return (%)"
                min={1}
                max={30}
                step={1}
                value={expectedReturn}
                setValue={setExpectedReturn}
              />
              <InputSlider
                label="Delay in Starting SIP (Months)"
                min={0}
                max={24}
                step={1}
                value={delayMonths}
                setValue={setDelayMonths}
              />

              {result && <ResultDisplay result={result} />}
            </div>

            {/* Right Panel - Results & Charts */}
            <div>
              <div className="space-y-4">
                <div id="chartGraph">
                  <SippieChart piedata={result} title="Delay Planning Projection" chartConfig={chartConfig} />
                </div>
                <div id="barGraph">
                  <CalculatorReturnChart data={chartData} chartConfig={chartConfig1} />
                </div>
              </div>
            </div>
          </div>
        </div>)}

    </div>
  );
}
