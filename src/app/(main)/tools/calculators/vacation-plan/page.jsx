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

export default function Page() {
  const router = useRouter();
  const [isAuthorised, setIsAuthorised] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalInvestment, setCurrentExpenses] = useState(10000); // Current cost of vacation
  const [investmentDuration, setInvestmentDuration] = useState(5); // Duration in years
  const [expectedReturn, setExpectedReturn] = useState(5); // Expected annual return
  const [inflationRate, setInflationRate] = useState(5); // Inflation rate
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [siteData, setSiteData] = useState();

  const handlePdf = async () => {
    const calResult = {
      labels: ['Current Cost of Vacation', 'Future Cost of Vacation', 'Planning Through SIP', 'Planning Through Lump Sum'],
      totalInvestment: result.totalInvestment,
      futureValue: result.futureValue,
      sipInvestment: result.sipInvestment,
      lumpsumInvestment: result.lumpsumInvestment,
    }
    generateCalculatorsPDF(calResult, "Vacation Plan Calculator", "2023-01-01", "2023-12-31", "chartGraph", "barGraph", siteData);
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
    if (selectedRoute) {
      router.push(selectedRoute); // Navigate to selected route
    }
  };
  const calculateVacationPlan = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/vacation-plan?planHolidayInYears=${investmentDuration}&currentExpense=${totalInvestment}&expectedReturn=${expectedReturn}&inflationRate=${inflationRate}`
      );
      if (res.status === 200) {
        const data = res.data;
        const totalInvestment = data.totalInvestment;
        const lumpsumInvestment = data.lumpsumInvestment;
        const futureVacationCost = data.futureVacationCost;
        const sipInvestment = data.sipInvestment;
        const yearlyData = data.yearlyData;
        setResult({
          totalInvestment,
          futureValue: Math.round(futureVacationCost),
          lumpsumInvestment: Math.round(lumpsumInvestment),
          sipInvestment: Math.round(sipInvestment),
        });
        setChartData(yearlyData);
        setIsAuthorised(true);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorised(false);
    } finally {
      setLoading(false);
    }
  };
  // Update the calculation when any of the values change
  useEffect(() => {
    calculateVacationPlan();
  }, [totalInvestment, investmentDuration, expectedReturn, inflationRate]);


  const chartConfig = {
    invested: {
      label: "Current Cost of Vacation",
      color: "var(--rv-primary)",
    },
    return: {
      label: "Future Cost of Vacation",
      color: "var(--rv-secondary)",
    },
  }

  const chartConfig1 = {
    investedAmount: {
      label: "Current Cost of Vacation",
      color: "var(--rv-primary)",
    },
    growth: {
      label: "Future Cost of Vacation",
      color: "var(--rv-secondary)",
    },
  };

  const sliders = [
    {
      label: "Current Vacation Expenses (₹)",
      min: 10000,
      max: 200000,
      step: 100,
      value: totalInvestment,
      setValue: setCurrentExpenses,
      unit: "₹",
    },
    {
      label: "After How Many Years Do You Wish To Plan Your Holiday?",
      min: 1,
      max: 40,
      step: 1,
      value: investmentDuration,
      setValue: setInvestmentDuration,
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
      min: 0,
      max: 30,
      step: 1,
      value: inflationRate,
      setValue: setInflationRate,
      unit: "%",
    },
  ];

  return (
    <div className="">
      <InnerBanner title={"Vacation Plan Calculator"} />
      <div className="section main-section">
        <div className="max-w-screen-xl mx-auto p-2 md:p-0">
          <div className="">
            <div className="mb-2 flex flex-col md:flex-row justify-between">
              <div className="space-x-4">
                <span className="text-2xl md:text-3xl font-bold uppercase">
                  Vacation Plan Calculator
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
            <div>
              <div>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
                  <div className="col-span-1 border border-[var(--rv-primary)] rounded-2xl bg-white p-2 md:p-5">
                    <div className="sip-calculator container mx-auto p-3 sticky top-0 z-10">
                      <div className="input-fields mt-5 mb-10">
                        {sliders.map((slider, index) => (
                          <InputSlider
                            key={index}
                            label={slider.label}
                            min={slider.min}
                            max={slider.max}
                            step={slider.step}
                            value={slider.value}
                            setValue={slider.setValue}
                            unit={slider.unit}
                          />
                        ))}
                      </div>
                      {result && (
                        <div className="mt-5">
                          <div className="flex flex-col md:flex-row justify-between px-5 mb-3">
                            <p>Current Cost of Vacation</p>
                            <p className="font-bold text-lg">
                              ₹{Math.floor(result?.totalInvestment)?.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <hr className="mb-3" />
                          <div className="flex flex-col md:flex-row justify-between px-5 mb-3">
                            <p>Future Cost of Vacation</p>
                            <p className="font-bold text-lg">
                              ₹{Math.floor(result?.futureValue)?.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <hr className="mb-3" />
                          <div className="flex flex-col md:flex-row justify-between px-5 mb-3">
                            <p>Planning Through SIP</p>
                            <p className="font-bold text-lg">
                              ₹{Math.floor(result?.sipInvestment)?.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <hr className="mb-3" />
                          <div className="flex flex-col md:flex-row justify-between px-5 mb-3">
                            <p>Planning Through Lump Sum</p>
                            <p className="font-bold text-lg">
                              ₹{Math.floor(result?.lumpsumInvestment)?.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <hr />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div id="chartGraph">
                      <SippieChart
                        piedata={result}
                        title={"Current & Future Cost Of Vacation Breakup"}
                        chartConfig={chartConfig}
                      />
                    </div>
                    <div className="mt-4" id="barGraph">
                      <CalculatorReturnChart
                        data={chartData}
                        title={"Vacation Planning "}
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
