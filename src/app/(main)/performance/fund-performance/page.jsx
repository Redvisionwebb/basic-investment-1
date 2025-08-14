"use client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "./loading";
import PageLoading from "./loadingpage";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import CryptoJS from "crypto-js";

export default function MarketUpdate() {
  const [categories, setCategories] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]); // For filtering schemes
  const [performanceData, setPerformanceData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Equity");
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [loading, setLoading] = useState(false);
  const [pageloading, setPageLoading] = useState(false);
  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;
  const router = useRouter()

  const fetchCategories = async () => {
    setPageLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/fund-performance/fpmain-category?apikey=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      if (response.status === 200) {
        setCategories(response.data[0].categories);
        fetchSchemes(response.data[0].categories[0]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setPageLoading(false);
    }
  };

  const fetchSchemes = async (category) => {
    // console.log("category:", category);
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/fund-performance/fpsub-category?categorySchemes=${category}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      if (response.status === 200) {
        setSchemes(response.data.data);
        setFilteredSchemes(response.data.data);
        if (response.data && response.data.data.length > 0) {
          const firstScheme = response.data.data[0];
          setSelectedScheme(firstScheme);
          fetchPerformanceData(firstScheme);
        }
      }
    } catch (error) {
      console.error("Error fetching schemes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformanceData = async (schemeType) => {
    setLoading(true);
    try {
      const sanitizedSchemeType = schemeType.includes("&") ? schemeType.replace(/&/g, "%26") : schemeType;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/fund-performance/fp-data?categorySchemes=${sanitizedSchemeType}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      if (response.status === 200) {
        setPerformanceData(response.data.data);
        // console.log("Schemes response:", response);
      }
    } catch (error) {
      console.error("Error fetching performance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    fetchSchemes(category);
  };

  const handleSchemeSelect = (scheme) => {
    setSelectedScheme(scheme);
    fetchPerformanceData(scheme);
  };

  const handlePerformanceClick = (performance) => {
    const dataToStore = {
      pcode: performance.pcode,
      ftype: selectedScheme,
      timestamp: Date.now(),
    };


    const encrypted = CryptoJS.AES.encrypt(

      JSON.stringify(dataToStore),
      SECRET_KEY
    ).toString();

    localStorage.setItem("encryptedFundPerormanceData", encrypted);
    // Navigate to the performance page with slug and query parameters
    window.location.href = `/performance/fund-performance/fund-details`;
  };

  // Search filter logic for schemes
  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = schemes?.filter((scheme) =>
      scheme.toLowerCase().includes(searchValue)
    );
    setFilteredSchemes(filtered);
  };


  return (
    <div className="pt-20">

      <div className="max-w-screen-xl mx-auto main_section lg:px-1 px-3">
        <div className="mb-5 flex flex-col md:flex-row gap-5 justify-between ">
          <div className="">
            <span className="text-2xl md:text-3xl font-bold uppercase">
              Fund Performance
            </span>
          </div>

        </div>
        {pageloading ? (
          <PageLoading />
        ) : (
          <div>
            <div className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-5 mb-5">
              {categories?.map((item, index) => (
                <div
                  key={index}
                  className={`px-3 py-3 bg-white border ${selectedCategory === item
                    ? "border-[var(--rv-secondary)]"
                    : "border-gray-300"
                    } rounded shadow cursor-pointer flex flex-col items-center`}
                  onClick={() => handleCategorySelect(item)}
                >
                  <Image
                    src={`/images/${item}.svg`}
                    width={70}
                    height={70}
                    className="mb-5 text-teal-500 "
                    alt=""
                  />
                  <h1 className="font-bold text-gray-700 text-2xl text-center uppercase">
                    {item}
                  </h1>
                </div>
              ))}
            </div>
            <div className="grid lg:grid-cols-4 md:grid-cols-1 grid-cols-1 gap-5 overflow-y-auto">
              <div className="lg:col-span-1 h-screen">
                {/* Search bar */}
                <input
                  type="text"
                  placeholder="Search Scheme"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full px-3 py-2 border rounded mb-1"
                />

                {/* Display filtered schemes */}
                {filteredSchemes?.map((scheme, index) => (
                  <div
                    key={index}
                    className={`px-3 py-3 ${selectedScheme === scheme ? "bg-[var(--rv-primary)]" : "bg-white"
                      } border border-gray-200 rounded shadow cursor-pointer my-2`}
                    onClick={() => handleSchemeSelect(scheme)}
                  >
                    <h1
                      className={`font-bold ${selectedScheme === scheme ? "text-white" : "text-gray-800"
                        } text-sm text-center`}
                    >
                      {scheme}
                    </h1>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-3 h-screen">
                {loading ? (
                  <Loading items={performanceData.length} />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded text-sm">
                      <thead>
                        <tr className="bg-gray-100 text-gray-800 whitespace-nowrap">
                          <th className="py-2 px-4 border-b text-left w-1">Fund Name</th>
                          <th className="py-2 px-4 border-b text-center">1 Week</th>
                          <th className="py-2 px-4 border-b text-center">1 Month</th>
                          <th className="py-2 px-4 border-b text-center">3 Month</th>
                          <th className="py-2 px-4 border-b text-center">6 Month</th>
                          <th className="py-2 px-4 border-b text-center">9 Month</th>
                          <th className="py-2 px-4 border-b text-center">1 Year</th>
                          <th className="py-2 px-4 border-b text-center">3 Year</th>
                          <th className="py-2 px-4 border-b text-center">5 Year</th>
                        </tr>
                      </thead>
                      <tbody>
                        {performanceData?.map((performance, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-100 cursor-pointer whitespace-nowrap"
                            onClick={() => handlePerformanceClick(performance)}
                          >
                            <td className="py-2 px-4 border-b w-1">{performance.funddes}</td>
                            <td className="py-2 px-4 border-b text-center">{performance.oneweek}</td>
                            <td className="py-2 px-4 border-b text-center">{performance.onemonth || "N/A"}</td>
                            <td className="py-2 px-4 border-b text-center">{performance.three_month || "N/A"}</td>
                            <td className="py-2 px-4 border-b text-center">{performance.six_month || "N/A"}</td>
                            <td className="py-2 px-4 border-b text-center">{performance.nine_month || "N/A"}</td>
                            <td className="py-2 px-4 border-b text-center">{performance.one_year || "N/A"}</td>
                            <td className="py-2 px-4 border-b text-center">{performance.three_year || "N/A"}</td>
                            <td className="py-2 px-4 border-b text-center">{performance.five_year || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}