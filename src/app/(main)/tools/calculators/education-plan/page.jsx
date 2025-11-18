"use client";
import React, { useEffect, useState } from "react";
import { SippieChart } from "@/components/charts/sippiechart";
import { CalculatorReturnChart } from "@/components/charts/calculatorReturnChart";
import axios from "axios";
import { planning } from "@/data/calculators";
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



export default function EducationPlanningCalculator() {
  const router = useRouter();
  const [currentAge, setCurrentAge] = useState(10); // Current age of the child
  const [educationStartAge, setEducationStartAge] = useState(18); // Age at which education starts
  const [totalInvestment, setTotalInvestment] = useState(500000); // Current education cost
  const [expectedReturn, setExpectedReturn] = useState(7); // Expected annual return in %
  const [inflationRate, setInflationRate] = useState(5); // Inflation rate in %

  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [siteData, setSiteData] = useState();

  const handlePdf = async (result) => {
    let calResult = {
      labels: ['Current Education Expenses', 'Future Education Expenses', 'Planning Through SIP', 'Planning Through Lump Sum'],
      totalInvestment: result.totalInvestment,
      futureValue: result.futureValue,
      sipInvestment: result.sipInvestment,
      lumpsumInvestment: result.lumpsumInvestment,
    }
    generateCalculatorsPDF(calResult, "Education Planning Calculator", "2023-01-01", "2023-12-31", "chartGraph", "barGraph", siteData);
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
    const calculateEducationPlan = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/education-calculator?currentAge=${currentAge}&educationAge=${educationStartAge}&totalInvestment=${totalInvestment}&expectedReturn=${expectedReturn}&inflationRate=${inflationRate}`
        );
        if (res.status === 200) {
          const data = res.data;
          const lumpsumInvestment = data.lumpsumInvestment;
          const futureEducationCost = data.futureEducationCost;
          const sipInvestment = data.sipInvestment;
          const yearlyData = data.yearlyData;
          setResult({
            totalInvestment,
            futureValue: Math.round(futureEducationCost),
            lumpsumInvestment: Math.round(lumpsumInvestment),
            sipInvestment: Math.round(sipInvestment),
          });
          setChartData(yearlyData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    calculateEducationPlan();
  }, [
    currentAge,
    educationStartAge,
    totalInvestment,
    expectedReturn,
    inflationRate,
  ]);

  const handleCalculatorChange = (e) => {
    const selectedRoute = e.target.value;
    if (selectedRoute) {
      router.push(selectedRoute); // Navigate to selected route
    }
  };

  const chartConfig = {
    invested: {
      label: "Current Expenses",
      color: "var(--rv-primary)",
    },
    return: {
      label: "Future Expenses",
      color: "var(--rv-secondary)",
    },
  }

  const chartConfig1 = {
    investedAmount: {
      label: "Current Expenses",
      color: "var(--rv-primary)",
    },
    growth: {
      label: "Future Expenses",
      color: "var(--rv-secondary)",
    },
  };

  const inputFields = [
    {
      label: "Current Age",
      min: 1,
      max: 30,
      step: 1,
      value: currentAge,
      setValue: setCurrentAge,
    },
    {
      label: "Age at the Start of Education",
      min: 10,
      max: 50,
      step: 1,
      value: educationStartAge,
      setValue: setEducationStartAge,
    },
    {
      label: "Current Education Expenses (₹)",
      min: 100000,
      max: 10000000,
      step: 1000,
      value: totalInvestment,
      setValue: setTotalInvestment,
      unit: "₹",
    },
    {
      label: "Rate of Return (%)",
      min: 1,
      max: 30,
      step: 1,
      value: expectedReturn,
      setValue: setExpectedReturn,
      unit: "%",
    },
    {
      label: "Inflation Rate (%)",
      min: 1,
      max: 30,
      step: 1,
      value: inflationRate,
      setValue: setInflationRate,
      unit: "%",
    },
  ];

  return (
    <div className="">
      <InnerBanner title={"Education Planning Calculator"} />
      <div className="section main-section">
        <div className="max-w-screen-xl mx-auto p-2 md:p-0">
          <div className="">
            <div className="mb-5 flex flex-col md:flex-row gap-5 justify-between">
              <div className="space-x-4">
                <span className="text-2xl md:text-3xl font-bold uppercase">
                  Education Planning Calculator
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
            <div>
              <div>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
                  <div className="col-span-1 border border-[var(--rv-primary)] rounded-2xl bg-white p-2 md:p-5">
                    <div className="sip-calculator container mx-auto p-3 sticky top-0 z-10">
                      <div className="input-fields mt-5 mb-10">
                        {inputFields.map((field, index) => (
                          <InputSlider
                            key={index}
                            label={field.label}
                            min={field.min}
                            max={field.max}
                            step={field.step}
                            value={field.value}
                            setValue={field.setValue}
                            unit={field.unit}
                          />
                        ))}
                      </div>
                      {result && (
                        <div className="mt-5">
                          <div className="flex flex-col md:flex-row justify-between px-5 mb-3">
                            <p>Current Education Expenses</p>
                            <p className="font-bold text-lg">
                              ₹{Math.floor(result?.totalInvestment)?.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <hr className="mb-3" />
                          <div className="flex flex-col md:flex-row justify-between px-5 mb-3">
                            <p>Future Education Expenses</p>
                            <p className="font-bold text-lg">
                              ₹{Math.floor(result?.futureValue)?.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <hr className="mb-3" />
                          <div className="flex flex-col md:flex-row justify-between px-5 mb-3">
                            <p>Planning Through Lumpsum</p>
                            <p className="font-bold text-lg">
                              ₹{Math.floor(result?.lumpsumInvestment)?.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <hr className="mb-3" />
                          <div className="flex flex-col md:flex-row justify-between px-5 mb-3">
                            <p>Planning Through SIP</p>
                            <p className="font-bold text-lg">
                              ₹{Math.floor(result?.sipInvestment)?.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="mb-4" id="chartGraph">
                      <SippieChart
                        piedata={result}
                        title={"Education Planning Projection"}
                        customLabels={{
                          invested: "Current Expenses",
                          return: "Future Expenses",
                        }}
                        chartConfig={chartConfig}
                      />
                    </div>
                    <div id="barGraph">
                      <CalculatorReturnChart
                        title={"Education Plan"}
                        data={chartData}
                        chartType="line"

                        chartTitle="Education Planning Projection"
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
    </div>
  );
} 
