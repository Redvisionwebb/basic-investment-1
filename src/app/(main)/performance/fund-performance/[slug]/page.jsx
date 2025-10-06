"use client";
import InnerBanner from "@/components/innerBanner/InnerBanner";
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import MutualFundTable from "@/components/PerformanceFundTable/page";

const Page = () => {
  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;
  const [schemeName, setSchemeName] = useState("");
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchPerformanceData = async (schemeType) => {
    setLoading(true);
    try {
      const sanitizedSchemeType = schemeType.includes("&")
        ? schemeType.replace(/&/g, "%26")
        : schemeType;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/fund-performance/fp-data?categorySchemes=${sanitizedSchemeType}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      if (response.status === 200) {
        setPerformanceData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching performance data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const encrypted = localStorage.getItem("encryptedscheme");
    if (!encrypted) return;
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) throw new Error("Decryption failed");
    const data = JSON.parse(decrypted);
    const isExpired = Date.now() - data.timestamp > 2 * 60 * 60 * 1000;

    if (isExpired) {
      localStorage.removeItem("encryptedscheme");
    } else {
      setSchemeName(data.schemeName);
      fetchPerformanceData(data.schemeName);
    }
  }, []);

  return (
    <div>
      <InnerBanner title={schemeName} subpages="Performance" />
      <div className="px-4">
        <div className="max-w-screen-xl mx-auto section ">
          <MutualFundTable
            performanceData={performanceData}
            schemeName={schemeName}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
