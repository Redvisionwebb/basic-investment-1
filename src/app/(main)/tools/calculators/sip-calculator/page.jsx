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
import { Skeleton } from "@/components/ui/skeleton"; // ✅ Make sure you have Skeleton component from shadcn/ui or custom

// ✅ Reusable InputSlider component
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

// ✅ Reusable ResultDisplay component
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
            ₹
            {Math.floor(item.value)?.toLocaleString("en-IN")}
          </p>
        </div>
        <hr />
      </div>
    ))}
  </div>
);

// ✅ Main Page Component
export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);

  const [monthlyInvestment, setMonthlyInvestment] = useState(500);
  const [investmentDuration, setInvestmentDuration] = useState(1);
  const [expectedReturn, setExpectedReturn] = useState(1);
  const [result, setResult] = useState(null);
  const [chartdata, setChartdata] = useState([]);
  const [siteData, setSiteData] = useState();

  const handlePdf = async (result) => {
    let calResult = {
      labels: ['Invested Amount', 'Growth', 'Total Future Value'],
      totalInvestment: result.totalInvestment,
      futureValue: result.wealthGained,
      sipInvestment: result.futureValue,
    }
    generateCalculatorsPDF(calResult, "SIP Calculator", "2023-01-01", "2023-12-31", "chartGraph", "barGraph", siteData);
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

  const calculateSip = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/sip-calculator?monthlyInvestment=${monthlyInvestment}&investmentDuration=${investmentDuration}&expectedReturn=${expectedReturn}`
      );

      if (res.status === 200) {
        const data = res.data;
        const futureValue = data.futureValue;
        const totalInvestment = data.totalInvestment;
        const yearlyData = data.yearlyData;

        setResult({
          futureValue: Number(futureValue.toFixed(2)),
          totalInvestment: Number(totalInvestment.toFixed(2)),
          wealthGained: Number((futureValue - totalInvestment).toFixed(2)),
        });
        setChartdata(yearlyData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };


  useEffect(() => {
    if (firstLoad) {
      calculateSip(true); // show skeleton only once
      setFirstLoad(false);
    } else {
      calculateSip(); // no skeleton after first load
    }
  }, [monthlyInvestment, investmentDuration, expectedReturn]);


  const handleCalculatorChange = (e) => {
    const selectedRoute = e.target.value;
    if (selectedRoute) router.push(selectedRoute);
  };

  const chartConfig = {
    invested: {
      label: "Invested Amount",
      color: "var(--rv-primary)",
    },
    return: {
      label: "Return Amount",
      color: "var(--rv-secondary)",
    },
  };

  const chartConfig1 = {
    investedAmount: {
      label: "Invested Amount",
      color: "var(--rv-primary)",
    },
    growth: {
      label: "Return Amount",
      color: "var(--rv-secondary)",
    },
  };

  return (
    <div>
      <InnerBanner title={"SIP Calculator"} />
      <div className="section main-section">
        <div className="max-w-screen-xl mx-auto px-2">
          {/* Header */}
          <div className="mb-2 flex flex-col md:flex-row gap-5 justify-between">
            <div className="space-x-4">
              <span className="text-2xl md:text-3xl font-bold uppercase">
                SIP Calculator
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

          {/* Calculator Section */}
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
            <div className="col-span-1 border border-[var(--rv-primary)] rounded-2xl bg-white p-2 md:p-5">
              <div className="sip-calculator container mx-auto sticky top-24 z-10">
                {loading ? (
                  <div className="space-y-5">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="input-fields mt-5 mb-10">
                      <InputSlider
                        label="Monthly investment (₹)"
                        min={500}
                        max={100000}
                        step={100}
                        value={monthlyInvestment}
                        setValue={setMonthlyInvestment}
                      />
                      <InputSlider
                        label="Time period (Years)"
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
                    </div>

                    {result && <ResultDisplay result={result} />}
                  </>
                )}
              </div>
            </div>

            <div className="col-span-1">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-xl" />
                  <Skeleton className="h-64 w-full rounded-xl" />
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <div id="chartGraph">
                    <SippieChart
                      piedata={result}
                      title={"SIP Calculator"}
                      chartConfig={chartConfig}
                    />
                  </div>
                  <div id="barGraph">
                    <CalculatorReturnChart
                      data={chartdata}
                      title="SIP"
                      chartConfig={chartConfig1}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
