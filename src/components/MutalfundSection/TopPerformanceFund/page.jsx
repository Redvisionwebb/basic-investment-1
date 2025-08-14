"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import CryptoJS from "crypto-js";
import styles from "./TopPerformer.module.css";
import HomeHeading from "@/components/landing/heading/heading";

export default function TopTaxSavingFunds() {
  const [activeTab, setActiveTab] = useState("Equity");
  const [subcategories, setSubCategories] = useState("Small Cap Fund");
  const [loading, setLoading] = useState(false);
  const [performanceData, setPerformanceData] = useState([]);
  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;
  const categories = ["Equity", "Hybrid", "Debt"];

  const fetchPerformanceData = async (subcategory) => {
    setLoading(true);
    try {
      const sanitizedSchemeType = subcategory.includes("&")
        ? subcategory.replace(/&/g, "%26")
        : subcategory;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/fund-performance/fp-data?categorySchemes=${sanitizedSchemeType}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`
      );

      if (response.status === 200) {
        const allFunds = response.data.data || [];

        const topFunds = allFunds
          .filter(
            (fund) =>
              fund.five_year &&
              !isNaN(parseFloat(fund.five_year)) &&
              parseFloat(fund.five_year) > 0
          )
          .sort((a, b) => parseFloat(b.five_year) - parseFloat(a.five_year))
          .slice(0, 5);

        setPerformanceData(topFunds);
      }
    } catch (error) {
      console.error("Error fetching performance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "Equity") {
      setSubCategories("Small Cap Fund");
    } else if (activeTab === "Hybrid") {
      setSubCategories("Aggressive Hybrid Fund");
    } else if (activeTab === "Debt") {
      setSubCategories("Gilt Fund");
    }
  }, [activeTab]);

  useEffect(() => {
    if (subcategories) {
      fetchPerformanceData(subcategories);
    }
  }, [subcategories]);

  const handleCategoryClick = (cat) => {
    setActiveTab(cat);
  };

  const handleSelectFunds = (fund) => {
    const dataToStore = {
      pcode: fund.pcode,
      ftype: subcategories,
      timestamp: Date.now(),
    };

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(dataToStore),
      SECRET_KEY
    ).toString();

    localStorage.setItem("encryptedFundPerormanceData", encrypted);
    window.location.href = "/performance/fund-performance/fund-details";
  };

  return (
    <section className={`${styles.sectionWrapper} section`}>
      <div className="max-w-screen-xl mx-auto px-4">
         <HomeHeading title={`Top Performing Funds`} center="true" />
        <div className="">
          <div className="text-center">
            <div className="flex justify-center mt-3 sm:space-x-6">
              {categories.map((cat, index) => (
                <button
                  key={index}
                  onClick={() => handleCategoryClick(cat)}
                  className={`${styles.tabButton} ${
                    activeTab === cat ? styles.activeTab : styles.inactiveTab
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className={` w-full overflow-x-auto ${styles.fundContainer}`}>
<div className="overflow-x-auto">
  <table className="min-w-[700px] md:min-w-full w-full text-left text-sm md:text-lg border-separate border-spacing-y-3">
    <thead className="sticky top-0 z-10">
      <tr className={styles.tableHeader}>
        <th className="p-3 md:p-4 text-center">Scheme Name</th>
        <th className="p-3 md:p-4 text-center">Nav</th>
        <th className="p-3 md:p-4 text-center">3-Year Return</th>
        <th className="p-3 md:p-4 text-center">5-Year Return</th>
      </tr>
    </thead>
    <tbody className={styles.tabelContetn}>
      {performanceData.map((fund, index) => (
        <tr
          key={index}
          className={`cursor-pointer bg-white  ${styles.row}`}
          onClick={() => handleSelectFunds(fund)}
        >
          <td className="p-3 md:p-5 rounded-l-xl">
            <div className="flex flex-col">
              <span className={styles.schemeName}>{fund.funddes}</span>
              <span className={styles.schemeCategory}>{fund.schemeCategory}</span>
            </div>
          </td>
          <td className="text-center p-3 md:p-5">
            ₹
            {fund?.fiveyear_navEndDate ||
              fund?.threeyear_navEndDate ||
              fund?.oneyear_navEndDate ||
              fund?.sixmonth_navEndDate ||
              fund?.onemonth_navEndDate ||
              fund?.oneweek_navEndDate ||
              "0.00"}
          </td>
          <td className={`text-center p-3 md:p-5 ${styles.returnValue}`}>
            {fund?.three_year ||
              fund?.one_year ||
              fund?.six_month ||
              fund?.one_month ||
              fund?.one_week ||
              "0.00"}
            %
          </td>
          <td className={`text-center p-3 md:p-5 rounded-r-xl ${styles.returnValue}`}>
            {fund?.five_year ||
              fund?.three_year ||
              fund?.one_year ||
              fund?.six_month ||
              fund?.one_month ||
              fund?.one_week ||
              "0.00"}
            %
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


            <p className="text-center text-sm mt-2 md:hidden text-gray-400">
              Swipe to view full table →
            </p>

            <div className="text-center p-4">
              <Link href="/performance/fund-performance">
                <button className={`btn btn-primary`}>
                  Show all top performing Funds
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
