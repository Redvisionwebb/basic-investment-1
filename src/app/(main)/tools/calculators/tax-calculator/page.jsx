"use client";
import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
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
import { useRouter } from "next/navigation";

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
  const [primaryColor, setPrimaryColor] = useState("124a7b");
  const [secondaryColor, setSecondaryColor] = useState("f0d310");
  const [loading, setLoading] = useState(true); // ✅ Show skeleton initially
  const [siteData, setSiteData] = useState();

  const handlePdf = async (result) => {
    generateCalculatorsPDF(result, "Car Planning", "2023-01-01", "2023-12-31", "carChart", "carBar", siteData);
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
  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const primary =
      rootStyle.getPropertyValue("--rv-primary").trim() || "#124a7b";
    const secondary =
      rootStyle.getPropertyValue("--rv-secondary").trim() || "#f0d310";

    setPrimaryColor(primary.replace("#", "").toLowerCase());
    setSecondaryColor(secondary.replace("#", "").toLowerCase());
  }, []);

  const iframeSrc = `https://www.redvisiontechnologies.com/iframe/calculator/calculator.php?apikey=&primarycolor=${primaryColor}&secondarycolor=${secondaryColor}&primaryactive=fff&bgcolo=000000`;

  return (
    <div>
      <InnerBanner title={"Tax Calculator"} />
      <div className="section main-section ">
        <div className="max-w-screen-xl mx-auto main-section lg:px-1 px-3">
          <div className="mb-5 flex flex-col md:flex-row gap-5 justify-between p-2 md:p-0">
            <span className="text-2xl md:text-3xl font-bold uppercase">Tax Calculator</span>
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
            <div className="flex md:flex-row flex-col justify-between gap-4">
              <span>Explore other calculators</span>
              <select className="w-full border border-gray-500 rounded-lg p-2" onChange={handleCalculatorChange} defaultValue="">
                <option value="" disabled>Select</option>
                {calculator.map((calc) => (
                  <option key={calc.title} value={calc.route}>{calc.title}</option>
                ))}
              </select>
            </div>
          </div>
          <Toaster />

          {/* Skeleton shown only while iframe is loading */}
          {loading && <FullPageSkeleton />}

          <div
            className={`w-full max-w-full overflow-hidden mt-5 ${loading ? "hidden" : "block"
              }`}
          >
            <iframe
              src={iframeSrc}
              className="w-full h-[600px] md:h-[800px] lg:h-[900px] border-none border border-[var(--rv-primary)] p-5 rounded-xl"
              title="Financial Calculator"
              allowFullScreen
              onLoad={() => setLoading(false)} // ✅ Hide skeleton after load
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
