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
  const [initialLoad, setInitialLoad] = useState(true); // Track first load
  const [sourceFundAmount, setSourceFundAmount] = useState(10000);
  const [transferToFundAmount, setTransferToFundAmount] = useState(500);
  const [transferPeriod, setTransferPeriod] = useState(5);
  const [expectedReturnSource, setExpectedReturnSource] = useState(5);
  const [expectedReturnDestination, setExpectedReturnDestination] = useState(5);
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [siteData, setSiteData] = useState();

  const handlePdf = async (result) => {
    let calResult = {
      labels: ['Invested Amount', 'Balance in Source Fund', 'Amount Transferred to Destination Fund', 'Expected Amount'],
      totalInvestment: result.totalInvestment,
      futureValue: result.balanceInSourceFund,
      sipInvestment: result.amountTransferredToDestinationFund,
      lumpsumInvestment: result.futureValue,
    }
    generateCalculatorsPDF(calResult, "STP Calculator", "2023-01-01", "2023-12-31", "chartGraph", "barGraph", siteData);
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

  const calculateSTP = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/calculators/stp-calculator?sourceFundAmount=${sourceFundAmount}&transferToFundAmount=${transferToFundAmount}&transferPeriod=${transferPeriod}&expectedReturnSource=${expectedReturnSource}&expectedReturnDestination=${expectedReturnDestination}`
      );
      if (res.status === 200) {
        const data = res.data;
        const investedAmount = data.investedAmount;
        const futureValueSourceFund = data.futureValueSourceFund;
        const totalTransferred = data.totalTransferred;
        const resultantAmount = data.resultantAmount;
        const yearlyData = data.yearlyData;

        setResult({
          totalInvestment: investedAmount,
          balanceInSourceFund: Math.round(futureValueSourceFund),
          amountTransferredToDestinationFund: totalTransferred,
          futureValue: Math.round(resultantAmount),
        });

        setChartData(yearlyData);
        setIsAuthorised(true);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorised(false);
    } finally {
      setLoading(false);
      setInitialLoad(false); // Disable skeleton after first load
    }
  };

  useEffect(() => {
    calculateSTP();
  }, []);

  useEffect(() => {
    if (!initialLoad) {
      calculateSTP(); // Only recalc after first load when inputs change
    }
  }, [sourceFundAmount, transferToFundAmount, transferPeriod, expectedReturnSource, expectedReturnDestination]);

  const handleCalculatorChange = (e) => {
    const selectedRoute = e.target.value;
    if (selectedRoute) router.push(selectedRoute);
  };

  // 🔹 Inline Slider Input Component
  const InputSlider = ({ label, min, max, step, value, setValue }) => {
    const formatNumber = (num) => (num || num === 0 ? num.toLocaleString("en-IN") : "");
    const handleChange = (e) => {
      const numericValue = parseFloat(e.target.value.replace(/,/g, "").replace(/[^\d.]/g, ""));
      setValue(!isNaN(numericValue) ? numericValue : 0);
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

  // 🔹 Inline Result Display Component
  const ResultDisplay = ({ result }) => (
    <div className="mt-5 space-y-3">
      {[
        { label: "Invested Amount", value: result.totalInvestment },
        { label: "Balance in Source Fund", value: result.balanceInSourceFund },
        { label: "Amount Transferred to Destination Fund", value: result.amountTransferredToDestinationFund },
        { label: "Expected Amount", value: result.futureValue },
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

  const chartConfig = {
    invested: { label: "Invested Amount", color: "var(--rv-primary)" },
    return: { label: "Resultant Amount", color: "var(--rv-secondary)" },
  };

  const chartConfig1 = {
    investedAmount: { label: "Invested Amount", color: "var(--rv-primary)" },
    growth: { label: "Resultant Amount", color: "var(--rv-secondary)" },
  };

  // 🔹 Skeleton Loader
  const SkeletonLoader = () => (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4 animate-pulse">
      <div className="col-span-1 border border-[var(--rv-primary)] rounded-2xl bg-white p-5 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-300 rounded w-full"></div>
        ))}
      </div>
      <div className="col-span-1 space-y-5">
        <div className="h-72 bg-gray-200 rounded-2xl"></div>
        <div className="h-72 bg-gray-200 rounded-2xl"></div>
      </div>
    </div>
  );

  return (
    <div>
      <InnerBanner title={"STP Calculator"} />
      <div className="section main-section">
        <div className="max-w-screen-xl mx-auto p-2 md:p-0">
          <div className="mb-2 flex flex-col md:flex-row gap-5 justify-between">
            <div className="space-x-4">
              <span className="text-2xl md:text-3xl font-bold uppercase">STP Calculator</span>
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
                {calculator.map((calc) => <option key={calc.title} value={calc.route}>{calc.title}</option>)}
              </select>
            </div>
          </div>

          {loading && initialLoad ? (
            <SkeletonLoader />
          ) : isAuthorised ? (
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
              <div className="col-span-1 border border-[var(--rv-primary)] rounded-2xl bg-white p-2 md:p-5">
                {/* Inputs */}
                <InputSlider label="I want to invest in Source Fund (₹)" min={500} max={10000000} step={500} value={sourceFundAmount} setValue={setSourceFundAmount} />
                <InputSlider label="I want to transfer to Destination Fund (₹)" min={500} max={1000000} step={500} value={transferToFundAmount} setValue={setTransferToFundAmount} />
                <InputSlider label="For a period of (years)" min={1} max={30} step={1} value={transferPeriod} setValue={setTransferPeriod} />
                <InputSlider label="Expected Rate of Return from Source Fund (%)" min={1} max={30} step={1} value={expectedReturnSource} setValue={setExpectedReturnSource} />
                <InputSlider label="Expected Rate of Return from Destination Fund (%)" min={1} max={30} step={1} value={expectedReturnDestination} setValue={setExpectedReturnDestination} />

                {/* Results */}
                {result && <ResultDisplay result={result} />}
              </div>

              {/* Charts */}
              <div className="col-span-1 space-y-4">
                <div className="" id="chartGraph">
                  <SippieChart piedata={{ totalInvestment: result?.totalInvestment, futureValue: result?.futureValue }} title="STP Calculator" customLabels={{ invested: "Household Expenses", return: "Loan Repayment" }} chartConfig={chartConfig} />
                </div>
                <div className="" id="barGraph">
                  <CalculatorReturnChart chartConfig={chartConfig1} data={chartData} title="STP Calculator" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <h3 className="font-bold text-red-600 text-4xl mb-3">Error 403</h3>
              <p className="font-medium text-xl">You're not Authorised</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
