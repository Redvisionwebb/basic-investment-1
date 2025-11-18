"use client";
import React, { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { calculator } from "@/data/calculators";
import { SippieChart } from "@/components/charts/sippiechart";
import { CalculatorReturnChart } from "@/components/charts/calculatorReturnChart";
import { Skeleton } from "@/components/ui/skeleton";

// 🔹 Reusable InputSlider
const InputSlider = ({ label, min, max, step, value, setValue }) => {
  const formatNumber = (num) =>
    num || num === 0 ? num.toLocaleString("en-IN") : "";

  const handleChange = (e) => {
    const clean = e.target.value.replace(/,/g, "").replace(/[^\d.]/g, "");
    const num = parseFloat(clean);
    setValue(!isNaN(num) ? num : 0);
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

// 🔹 Reusable ResultDisplay
const ResultDisplay = ({ result, currentAge, crorepatiStartAge }) => (
  <div className="mt-5 space-y-3">
    {[
      { label: "Your Targeted Wealth (Inflation Adjusted)", value: result.futureTargetWealth },
      { label: "Growth of Savings", value: result.growthOfSavings },
      { label: "Monthly SIP Amount Required", value: result.sipInvestmentRequired },
      {
        label: `Amount Invested through SIP in ${crorepatiStartAge - currentAge} years`,
        value: result.totalSIPInvestment,
      },
      { label: "SIP Growth", value: result.sipGrowth },
      { label: "Future Value of SIP", value: result.sipFutureValue },
    ].map((item, i) => (
      <div key={i}>
        <div className="flex flex-col md:flex-row justify-between px-5 mb-1">
          <p>{item.label}</p>
          <p className="font-bold text-lg">
            ₹
            {Math.floor(item.value)?.toLocaleString("en-IN")}
          </p>
        </div>
        <hr />
      </div>
    ))}
  </div>
);

export default function CrorepatiPlanningCalculator() {
  const router = useRouter();
  // Inputs
  const [currentAge, setCurrentAge] = useState(25);
  const [crorepatiStartAge, setCrorepatiStartAge] = useState(45);
  const [targetWealth, setTargetWealth] = useState(50000000);
  const [currentSavings, setCurrentSavings] = useState(100000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [inflationRate, setInflationRate] = useState(6);

  // Data
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [siteData, setSiteData] = useState();

  const handlePdf = async (result) => {
    let calResult = {
      labels: ['Your Targeted Wealth (Inflation Adjusted)', 'Growth of Savings', 'Monthly SIP Amount Required', 'Amount Invested through SIP in 20 years', 'SIP Growth', 'Future Value of SIP'],
      totalInvestment: result.futureTargetWealth,
      futureValue: result.growthOfSavings,
      sipInvestment: result.sipInvestmentRequired,
      lumpsumInvestment: result.totalSIPInvestment,
      sipGrowth: result.sipGrowth,
      sipFutureValue: result.sipFutureValue,
    }
    generateCalculatorsPDF(calResult, "Crorepati Planning Calculator", "2023-01-01", "2023-12-31", "chartGraph", "barGraph", siteData);
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

  const calculateCrorepatiPlan = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/crorepati-calculator?currentAge=${currentAge}&crorepatiAge=${crorepatiStartAge}&targetedWealth=${targetWealth}&currentSavings=${currentSavings}&expectedReturn=${expectedReturn}&inflationRate=${inflationRate}`
      );

      if (res.status === 200) {
        const data = res.data;
        setResult({
          futureTargetWealth: Math.round(data.futureTargetWealth),
          growthOfSavings: Math.round(data.savingsGrowth),
          finalTargetWealth: Math.round(data.finalTargetWealth),
          sipInvestmentRequired: Math.round(data.sipInvestmentRequired),
          totalSIPInvestment: Math.round(data.totalSIPInvestment),
          sipGrowth: Math.round(data.sipGrowth),
          sipFutureValue: Math.round(data.sipFutureValue),
        });
        setChartData(data.yearlyData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  // Run once with skeleton, then live update silently
  useEffect(() => {
    if (firstLoad) {
      calculateCrorepatiPlan(true);
      setFirstLoad(false);
    } else {
      calculateCrorepatiPlan();
    }
  }, [currentAge, crorepatiStartAge, targetWealth, currentSavings, expectedReturn, inflationRate]);

  const handleCalculatorChange = (e) => {
    const selectedRoute = e.target.value;
    if (selectedRoute) router.push(selectedRoute);
  };

  const chartConfig = {
    invested: { label: "Invested", color: "var(--rv-primary)" },
    return: { label: "Future Value", color: "var(--rv-secondary)" },
  };

  const chartConfig1 = {
    investedAmount: { label: "Invested", color: "var(--rv-primary)" },
    growth: { label: "Future Value", color: "var(--rv-secondary)" },
  };

  // 🔹 Full-page Skeleton Loader
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-gray-50">
        <Skeleton className="h-8 w-1/3 rounded-xl" />
        <Skeleton className="h-6 w-1/2 rounded-xl" />
        <Skeleton className="h-[400px] w-[80%] rounded-xl" />
        <Skeleton className="h-6 w-1/2 rounded-xl" />
        <Skeleton className="h-[200px] w-[60%] rounded-xl" />
      </div>
    );
  }

  // 🔹 Main Calculator after skeleton
  return (
    <div>
      <InnerBanner title={"Crorepati Planning Calculator"} />
      <div className="section main-section">
        <div className="max-w-screen-xl mx-auto p-2 md:p-0">
          <div className="mb-2 flex flex-col md:flex-row gap-5 justify-between">
            <div className="space-x-2">
              <span className="text-2xl md:text-3xl font-bold uppercase">
                Crorepati Planning Calculator
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

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
            {/* Left - Inputs + Results */}
            <div className="col-span-1 border border-[var(--rv-primary)] rounded-2xl bg-white p-2 md:p-5">
              <div className="mx-auto p-3">
                <div className="input-fields mt-5 mb-10">
                  <InputSlider label="Target Wealth (₹)" min={1000000} max={1000000000} step={100000} value={targetWealth} setValue={setTargetWealth} />
                  <InputSlider label="Current Age" min={1} max={80} step={1} value={currentAge} setValue={setCurrentAge} />
                  <InputSlider label="Age at the Time of Crorepati" min={10} max={100} step={1} value={crorepatiStartAge} setValue={setCrorepatiStartAge} />
                  <InputSlider label="Rate of Return (%)" min={1} max={30} step={1} value={expectedReturn} setValue={setExpectedReturn} />
                  <InputSlider label="Inflation Rate (%)" min={1} max={20} step={1} value={inflationRate} setValue={setInflationRate} />
                  <InputSlider label="Current Savings (₹)" min={10000} max={1000000000} step={10000} value={currentSavings} setValue={setCurrentSavings} />
                </div>

                {result && (
                  <ResultDisplay
                    result={result}
                    currentAge={currentAge}
                    crorepatiStartAge={crorepatiStartAge}
                  />
                )}
              </div>
            </div>

            {/* Right - Charts */}
            <div className="col-span-1">
              <div className="mb-3" id="chartGraph">
                <SippieChart
                  piedata={{
                    totalInvestment: result?.sipFutureValue,
                    futureValue: result?.totalSIPInvestment,
                  }}
                  title="Crorepati Planning Projection"
                  chartConfig={chartConfig}
                />
              </div>
              <div id="barGraph" >
                <CalculatorReturnChart
                  data={chartData}
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
