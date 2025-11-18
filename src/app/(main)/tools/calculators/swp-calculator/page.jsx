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
import { SippieChart } from "@/components/charts/sippiechart";
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

// 🔹 Reusable ResultDisplay Component
const ResultDisplay = ({ result }) => (
  <div className="mt-5 space-y-3 = rounded-2xl p-5 bg-white">
    {[
      { label: "Total Investment", value: result.investedAmount },
      { label: "Total Withdrawal", value: result.balanceInSourceFund },
      { label: "Total Growth", value: result.amountTransferredToDestinationFund },
      { label: "Current Value", value: result.resultantAmount },
    ].map((item, i) => (
      <div key={i}>
        <div className="flex flex-col md:flex-row justify-between mb-1">
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
  const [isAuthorised, setIsAuthorised] = useState(false);
  const [loading, setLoading] = useState(true);
  const [investedAmount, setInvestedAmount] = useState(10000);
  const [withdrawalAmount, setWithdrawalAmount] = useState(500);
  const [transferPeriod, setTransferPeriod] = useState(5);
  const [expectedReturnSource, setExpectedReturnSource] = useState(5);
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [siteData, setSiteData] = useState();

  const handlePdf = async (result) => {
    let calResult = {
      labels: ['Total Investment', 'Total Withdrawal', 'Total Growth', 'Current Value'],
      totalInvestment: result.investedAmount,
      futureValue: result.balanceInSourceFund,
      sipInvestment: result.amountTransferredToDestinationFund,
      lumpsumInvestment: result.resultantAmount,
    }
    generateCalculatorsPDF(calResult, "SWP Calculator", "2023-01-01", "2023-12-31", "chartGraph", "barGraph", siteData);
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

  const calculateSWP = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/swp-calculator?investedAmount=${investedAmount}&withdrawalAmount=${withdrawalAmount}&timePeriod=${transferPeriod}&expectedReturn=${expectedReturnSource}`
      );
      if (res.status === 200) {
        const data = res.data;
        setChartData(data.yearlyData);
        setResult({
          investedAmount: data.totalInvestment,
          balanceInSourceFund: Math.round(data.totalWithdrawn),
          amountTransferredToDestinationFund: data.totalGrowth,
          resultantAmount: Math.round(data.currentValue),
        });
        setIsAuthorised(true);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorised(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateSWP();
  }, [investedAmount, withdrawalAmount, transferPeriod, expectedReturnSource]);

  const handleCalculatorChange = (e) => {
    const selectedRoute = e.target.value;
    if (selectedRoute) router.push(selectedRoute);
  };

  const chartConfig = {
    invested: { label: "Total Investment", color: "var(--rv-primary)" },
    return: { label: "Current Value", color: "var(--rv-secondary)" },
  };

  const chartConfig1 = {
    investedAmount: { label: "Total Investment", color: "var(--rv-primary)" },
    growth: { label: "Current Value", color: "var(--rv-secondary)" },
  };

  if (loading) return <FullPageSkeleton />; // Full-page skeleton shows only once

  return (
    <div>
      <InnerBanner title={"SWP Calculator"} />
      <div className="section main-section max-w-screen-xl mx-auto ">
        <div className="mb-2 flex flex-col md:flex-row gap-5 justify-between p-2 md:p-0">
          <div className="space-x-4">
            <span className="text-2xl md:text-3xl font-bold uppercase">SWP Calculator</span>
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
          <div className="flex flex-col justify-between">
            <span>Explore other calculators</span>
            <select className="w-full border border-gray-500 rounded-lg p-2" onChange={handleCalculatorChange} defaultValue="">
              <option value="" disabled>Select</option>
              {calculator.map((calc) => (
                <option key={calc.title} value={calc.route}>{calc.title}</option>
              ))}
            </select>
          </div>
        </div>

        {isAuthorised ? (
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 p-2">
            {/* Left Column: Inputs & Results */}
            <div className="col-span-1 border border-[var(--rv-primary)] rounded-2xl bg-white p-2 md:p-5">
              <InputSlider label="Lumpsum Invested Amount (₹)" min={10000} max={10000000} step={500} value={investedAmount} setValue={setInvestedAmount} />
              <InputSlider label="SWP Withdrawal Amount (₹)" min={500} max={1000000} step={500} value={withdrawalAmount} setValue={setWithdrawalAmount} />
              <InputSlider label="For a period of (years)" min={1} max={30} step={1} value={transferPeriod} setValue={setTransferPeriod} />
              <InputSlider label="Expected Rate of Return (%)" min={1} max={30} step={1} value={expectedReturnSource} setValue={setExpectedReturnSource} />

              {result && <ResultDisplay result={result} />}
            </div>

            {/* Right Column: Charts */}
            <div className="col-span-1">
              <div className="mb-4" id="chartGraph">
                <SippieChart
                  piedata={{ totalInvestment: result?.investedAmount, futureValue: result?.resultantAmount }}
                  title={"SWP Calculator"}
                  chartConfig={chartConfig}
                />
              </div>
              <div id="barGraph">
                <CalculatorReturnChart data={chartData} title={"SWP Calculator"} chartConfig={chartConfig1} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <span className="font-bold text-red-600 text-4xl mb-3">Error 403</span>
            <p className="font-medium text-xl">You're not authorised</p>
          </div>
        )}
      </div>
    </div>
  );
}
