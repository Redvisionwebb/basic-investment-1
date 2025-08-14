"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { FaFilePdf } from "react-icons/fa6";
// import SipPerformanceTable from "@/components/SipPerformanceTable";
import { generateSchemePDF } from "@/lib/generatePdf";
import { SchemePerformanceChart } from "@/components/charts/schemePerformanceChart";
import SchemePerformanceTable from "@/components/schemePerformanceTable";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function Page() {
    function getTodayDate() {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }
    const [schemesData, setSchemesData] = useState([]);
    const [result, setResult] = useState(null);
    const [isMonthlyScheme, setIsMonthlyScheme] = useState(true);
    const [allAcmdata, setAllAcmdata] = useState([]);
    const [selectedAcms, setSelectedAcms] = useState([]);
    const [funds, setFunds] = useState([]);
    const [startSchemeDate, setStartSchemeDate] = useState('2021-10-14');
    const [endSchemeDate, setEndSchemeDate] = useState(getTodayDate());
    const [valuationDate, setValuationDate] = useState(getTodayDate());
    const [SchemeAmount, setSchemeAmount] = useState(10000);
    const [pcode, setPcode] = useState('');
    const [title, setTitle] = useState('');
    const [viewby, setViewBy] = useState('graph');
    const [assetCategory, setAssetCategory] = useState([]);
    const [selectedAssets, setSelectedAssets] = useState(new Set());
    const [graphData, setGraphData] = useState(false);
    const [sensex, setSensex] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [siteData, setSiteData] = useState([]);

    // Constants for time calculations
    const TWENTY_DAYS_IN_MS = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds

    useEffect(() => {
        // Check if the form has already been submitted (stored in localStorage)
        const formSubmitted = localStorage.getItem("formSubmitted");
        const submissionTimestamp = localStorage.getItem("submissionTimestamp");

        if (formSubmitted === "true" && submissionTimestamp) {
            const currentTime = Date.now();
            const timeDifference = currentTime - submissionTimestamp;

            // If 20 days have passed since submission, clear the localStorage
            if (timeDifference > TWENTY_DAYS_IN_MS) {
                localStorage.removeItem("formSubmitted");
                localStorage.removeItem("submissionTimestamp");
            }
        }
    }, []);

    const fetcAcm = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/all-amc?apikey=${process.env.NEXT_PUBLIC_API_KEY}`);
            setAllAcmdata(response.data);
        } catch (error) {
            console.error("Error fetching AMC data:", error);
        }
    };

    const fetcAssetCategory = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/get-assets?apikey=${process.env.NEXT_PUBLIC_API_KEY}`);
            setAssetCategory(response.data);
        } catch (error) {
            console.error("Error fetching AMC data:", error);
        }
    };

    useEffect(() => {
        fetchSchemes();
    }, [selectedAcms])

    React.useEffect(() => {
        fetcAcm();
        fetcAssetCategory();
    }, []);

    const handleAssetSelect = (scheme) => {
        const assetClass = scheme?.assets_class;
        if (assetClass) {
            setSelectedAssets((prevSelected) => {
                const updatedSelection = new Set(prevSelected);

                if (updatedSelection.has(assetClass)) {
                    // If already selected, remove it
                    updatedSelection.delete(assetClass);
                } else {
                    // If not selected, add it
                    updatedSelection.add(assetClass);
                }

                return updatedSelection; // Return updated Set
            });
        } else {
            console.warn('No valid assets_class found in selectedAcm');
        }
    };

    useEffect(() => {
        // Convert the Set back to an array and filter out undefined values
        const updatedFunds = Array.from(selectedAssets)
            .filter(fund => fund !== undefined); // Remove undefined values
        // Fetch asset data after updating funds
        if (updatedFunds.length > 0) {
            fetchAsset(updatedFunds);
        }
    }, [selectedAssets]);

    const fetchAsset = async (funds) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/get-sub-assets?subAssetClass=${funds}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`);
            setSchemesData(response); // Update the state with fetched schemes
        } catch (error) {
            console.error("Error fetching schemes data:", error);
        }
    };

    const fetchSchemes = async (selectedAcm) => {
        // Check if the fund is already in the array to avoid duplicates
        if (!funds?.includes(selectedAcm?.fund)) {
            // Append the new fund to the existing array
            setFunds((prevFunds) => [...prevFunds, selectedAcm?.fund]);
        }
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/all-scheme?fund=${funds}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`);
            setSchemesData(response);  // Update the state with fetched schemes
        } catch (error) {
            console.error("Error fetching schemes data:", error);
        }
    };

    // Handle selecting/deselecting AMCs
    const handleAcmSelect = (scheme) => {
        if (selectedAcms.includes(scheme)) {
            setSelectedAcms(selectedAcms.filter((s) => s !== scheme));
        } else {
            setSelectedAcms([...selectedAcms, scheme]);
            fetchSchemes(scheme);  // Fetch schemes when an AMC is selected
        }
    };

    const handleSubmit = async () => {
        if (
            pcode.length === 0 ||
            (selectedAcms.length === 0 && selectedAssets.size === 0)
        ) {
            toast({
                variant: "destructive",
                title: "Please select scheme",
            });
            setGraphData(false);
        } else {
            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_DATA_API}/api/research-calculator/scheme-performance`,
                    {
                        fundPcode: pcode,
                        investedAmount: Number(SchemeAmount),
                        startDate: startSchemeDate,
                        endDate: endSchemeDate,
                        sensex: sensex,
                        ppf: true,
                        eventFlag: false,
                    }
                );
                if (response.data.data == null) {
                    setGraphData(false);
                    setError(response.data)
                } else {
                    setGraphData(true);
                    setResult(response.data.data);
                    setError(null)
                }
            } catch (error) {
                console.error("Error fetching schemes data:", error);
            }
        }
    };

    useEffect(() => {
        const fetchSiteData = async () => {
            const res = await fetch("/api/admin/site-settings");
            if (res.ok) {
                const data = await res.json();
                setSiteData(data[0]);
            } else {
                console.error("Failed to fetch site settings");
            }
        };
        fetchSiteData();
    }, []);

    const tableResult = result?.sensex
        ? [
            { ...result, sensex: undefined, sensexGraphData: undefined, title: title },
            {
                ...result.sensex,
                buyUnit: result.sensex.units,
                units: undefined,
                investedAmount: result.investedAmount,
                maturityDate: result.maturityDate,
                maturityValue: result.sensex.maturityAmount,
                maturityAmount: undefined,
                title: "Sensex"
            },
        ]
        : [{ ...result, sensex: undefined, sensexGraphData: undefined, title: title }];

    const handlePdf = async (tableResult, title, startSchemeDate, valuationDate) => {
        generateSchemePDF(tableResult, title, startSchemeDate, valuationDate, 'graphId', siteData);
    }

    return (
        <div className="pt-20">

            <div className="px-3 lg:px-2 max-w-screen-xl mx-auto main_section ">
                <Toaster /><div className="mb-5 flex flex-col md:flex-row gap-5 justify-between ">
                  <div className="">
                    <span className="text-2xl md:text-3xl font-bold uppercase">
                      Scheme Performance
                    </span>
                  </div>
                  
                </div>
                <div>
                    <div className='col-span-1 border border-gray-200 rounded-2xl bg-white p-2 mb-3'>
                        <div className="Scheme-calculator container mx-auto p-3 sticky top-0 z-10">
                            <div className="flex space-x-4 mb-8">
                                <Button
                                    onClick={() => (setIsMonthlyScheme(true), setSchemesData([]), setGraphData(false), setSelectedAcms([]))}
                                    className={`text-sm rounded-full hover:bg-[var(--rv-primary)] hover:text-white ${isMonthlyScheme ? "bg-[var(--rv-primary)] text-[var(--rv-secondary)]"
                                        : "bg-[var(--rv-secondary)] text-black border"
                                        }`}
                                >
                                    Fund House
                                </Button>
                                <Button
                                    onClick={() => (setIsMonthlyScheme(false), setSchemesData([]), setGraphData(false), setSelectedAssets(new Set()))}
                                    className={`text-sm rounded-full hover:bg-[var(--rv-primary)] hover:text-white ${!isMonthlyScheme ? "bg-[var(--rv-primary)] text-[var(--rv-secondary)]"
                                        : "bg-[var(--rv-secondary)] text-black border"
                                        }`}
                                >
                                    Asset Category
                                </Button>
                            </div>
                            <div className="input-fields mt-5 mb-5">
                                {isMonthlyScheme ? (
                                    <div className="w-full">
                                        <h4 className="font-semibold text-gray-700">Select AMC</h4>
                                        <div className="max-w-full mt-2 border border-gray-300 p-3 rounded h-60 overflow-y-auto">
                                            <input
                                                type="text"
                                                placeholder="Search Scheme"
                                                className="w-full px-3 py-2 border rounded mb-1 text-gray-800"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value.toLowerCase())} // Update search query
                                            />
                                            {/* Render filtered checkboxes for each AMC */}
                                            {allAcmdata
                                                ?.filter((scheme) =>
                                                    scheme?.funddes?.toLowerCase().includes(searchQuery)
                                                ).map((scheme, index) => (
                                                    <div key={index} className="flex items-center mb-1">
                                                        <input
                                                            type="checkbox"
                                                            id={`acm-${index}`}
                                                            checked={selectedAcms.includes(scheme)}
                                                            onChange={() => handleAcmSelect(scheme)}
                                                            className="mr-2"
                                                        />
                                                        <label htmlFor={`acm-${index}`} className="text-stone-900 text-sm">
                                                            {scheme?.funddes}
                                                        </label>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4">
                                        <div>
                                            <p className="font-semibold text-gray-700">
                                                Select Equity Funds
                                            </p>
                                            {/* {console.log(assetCategory)} */}
                                            <div className="mt-2 border border-gray-300 p-3 rounded h-60 overflow-y-auto">
                                                {/* Equity Funds checkboxes here */}
                                                {assetCategory
                                                    ?.filter((item) => item.nav_c2 === "Equity")
                                                    .map((scheme, index) => (
                                                        <div key={index} className="flex items-center mb-1">
                                                            <input
                                                                type="checkbox"
                                                                id={`asset-equity-${index}`}
                                                                checked={selectedAssets.has(
                                                                    scheme.assets_class
                                                                )}
                                                                onChange={() => handleAssetSelect(scheme)}
                                                                className="mr-2"
                                                            />
                                                            <label
                                                                htmlFor={`asset-equity-${index}`}
                                                                className="text-stone-900 text-sm"
                                                            >
                                                                Equity - {scheme?.assets_class}
                                                            </label>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-700">
                                                Select Debt Funds
                                            </p>
                                            <div className="mt-2 border border-gray-300 p-3 rounded h-60 overflow-y-auto">
                                                {assetCategory
                                                    ?.filter((item) => item.nav_c2 === "Debt")
                                                    .map((scheme, index) => (
                                                        <div key={index} className="flex items-center mb-1">
                                                            <input
                                                                type="checkbox"
                                                                id={`asset-debt-${index}`}
                                                                checked={selectedAssets.has(
                                                                    scheme.assets_class
                                                                )}
                                                                onChange={() => handleAssetSelect(scheme)}
                                                                className="mr-2"
                                                            />
                                                            <label
                                                                htmlFor={`asset-debt-${index}`}
                                                                className="text-stone-900 text-sm"
                                                            >
                                                                Debt - {scheme?.assets_class}
                                                            </label>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-700">
                                                Select Hybrid Funds
                                            </p>
                                            <div className="mt-2 border border-gray-300 p-3 rounded h-60 overflow-y-auto">
                                                {/* Hybrid Funds checkboxes here */}
                                                {assetCategory
                                                    ?.filter((item) => item.nav_c2 === "Hybrid")
                                                    .map((scheme, index) => (
                                                        <div key={index} className="flex items-center mb-1">
                                                            <input
                                                                type="checkbox"
                                                                id={`asset-hybrid-${index}`}
                                                                checked={selectedAssets.has(
                                                                    scheme.assets_class
                                                                )}
                                                                onChange={() => handleAssetSelect(scheme)}
                                                                className="mr-2"
                                                            />
                                                            <label
                                                                htmlFor={`asset-hybrid-${index}`}
                                                                className="text-stone-900 text-sm"
                                                            >
                                                                Hybrid - {scheme?.assets_class}
                                                            </label>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-700">
                                                Select Commodity Funds/ Others
                                            </p>
                                            <div className="mt-2 border border-gray-300 p-3 rounded h-60 overflow-y-auto">
                                                {assetCategory
                                                    ?.filter(
                                                        (item) =>
                                                            item.nav_c2 === "Other " ||
                                                            item.nav_c2 === "Others" ||
                                                            item.nav_c2 === "Sol Oriented"
                                                    )
                                                    .map((scheme, index) => (
                                                        <div key={index} className="flex items-center mb-1">
                                                            <input
                                                                type="checkbox"
                                                                id={`asset-other-${index}`}
                                                                checked={selectedAssets.has(
                                                                    scheme.assets_class
                                                                )}
                                                                onChange={() => handleAssetSelect(scheme)}
                                                                className="mr-2"
                                                            />
                                                            <label
                                                                htmlFor={`asset-other-${index}`}
                                                                className="text-stone-900 text-sm"
                                                            >
                                                                Other - {scheme?.assets_class}
                                                            </label>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <hr />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="mb-4">
                                    <label htmlFor="schemeSelect" className="text-sm block font-semibold text-gray-700 mb-1">
                                        Select Scheme
                                    </label>
                                    <select
                                        id="schemeSelect"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        onChange={(e) => {
                                            const selectedScheme = schemesData?.data.find(
                                                (scheme) => scheme.funddes === e.target.value
                                            );
                                            setPcode(selectedScheme?.pcode);
                                            setTitle(selectedScheme?.funddes);
                                        }}
                                    >
                                        <option value="" selected>
                                            Choose a scheme
                                        </option>
                                        {!isMonthlyScheme ?
                                            schemesData
                                                ? schemesData &&
                                                schemesData?.data?.map((scheme, index) => (
                                                    <option key={index} value={scheme?.funddes}>
                                                        {scheme?.funddes}
                                                    </option>
                                                ))
                                                : "Loading..."
                                            :
                                            selectedAcms &&
                                                selectedAcms.length > 0 &&
                                                schemesData?.data ? (
                                                schemesData.data
                                                    .filter((scheme) =>
                                                        selectedAcms.some(
                                                            (acm) => acm.fund === scheme.fund
                                                        )
                                                    )
                                                    .map((scheme, index) => (
                                                        <option key={index} value={scheme.funddes}>
                                                            {scheme.funddes}
                                                        </option>
                                                    ))
                                            ) : (
                                                <option disabled>Loading...</option>
                                            )}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="schemeName" className="text-sm block font-semibold text-gray-700 mb-1">Scheme Amount (Monthly)</label>
                                    <input
                                        type="number"
                                        id="schemeName"
                                        placeholder="Enter scheme name"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        value={SchemeAmount}
                                        onChange={(e) => setSchemeAmount(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="schemeDate" className="text-sm block font-semibold text-gray-700 mb-1"> Start Date</label>
                                    <input
                                        type="date"
                                        id="schemeDate"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        value={startSchemeDate}
                                        onChange={(e) => setStartSchemeDate(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="schemeDate" className="text-sm block font-semibold text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        id="schemeDate"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        min={startSchemeDate}
                                        value={endSchemeDate}
                                        onChange={(e) => setEndSchemeDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* Date input for selecting a date */}
                            <div className="p-2">
                                <label htmlFor="sensex" className="text-md block font-semibold text-gray-700 mb-1">Compare Fund</label>
                                <div className="mb-4 flex">
                                    <input
                                        type="checkbox"
                                        id="sensex"
                                        checked={sensex}
                                        onChange={(e) => setSensex((prev) => !prev)}
                                    />
                                    <label htmlFor="sensex" className="text-sm block font-semibold text-gray-700 mb-1 ml-1 mr-5">SENSEX</label>
                                </div>
                            </div>
                            <Button className="bg-[var(--rv-primary)] hover:text-black text-[var(--rv-secondary)] disabled:opacity-50 hover:bg-[var(--rv-secondary)]" onClick={() => handleSubmit()}>Show</Button>
                        </div>
                    </div>
                    <div className='col-span-1'>
                        {graphData &&
                            <div className="mb-5 flex justify-between">
                                <div className="space-x-2">
                                    <Button variant="outline" className={`border-2 ${viewby === 'graph' ? 'border-blue-600' : 'border-gray-600'} uppercase font-semibold text-gray-800`} onClick={() => setViewBy('graph')}>Graph</Button>
                                    <Button variant="outline" className={`border-2 ${viewby === 'table' ? 'border-blue-600' : 'border-gray-600'} uppercase font-semibold text-gray-800`} onClick={() => setViewBy('table')}>Table</Button>
                                </div>
                                <div className="cursor-pointer" onClick={() => handlePdf(tableResult, title, startSchemeDate, valuationDate)}>
                                    <h1 className="text-2xl">{viewby === 'graph' && <FaFilePdf />}</h1>
                                </div>
                            </div>
                        }
                        <div className="">
                            {result && viewby === 'graph' ?
                            graphData && 
                                <div className="">
                                    <div className="grid lg:grid-cols-7 md:grid-cols-4 gap-x-3 gap-y-2 my-10">
                                        <div className="py-2 px-3 border border-stone-600 shadow shadow-emerald-100 rounded-sm text-center">
                                            <h1 className="font-semibold text-gray-800 text-sm">Amount Invested</h1>
                                            <h1 className="font-medium text-gray-900 text-sm">{result?.investedAmount || 0}</h1>
                                        </div>
                                        <div className="py-2 px-3 border border-stone-600 shadow shadow-emerald-100 rounded-sm text-center">
                                            <h1 className="font-semibold text-gray-800 text-sm">Buy Units</h1>
                                            <h1 className="font-medium text-gray-900 text-sm">{result?.buyUnit || 0}</h1>
                                        </div>
                                        <div className="py-2 px-3 border border-stone-600 shadow shadow-emerald-100 rounded-sm text-center">
                                            <h1 className="font-semibold text-gray-800 text-sm">Profit/Loss</h1>
                                            <h1 className="font-medium text-gray-900 text-sm">
                                                {result?.maturityValue && result?.investedAmount
                                                    ? Math.floor(result.maturityValue - result.investedAmount)
                                                    : 0}
                                            </h1>
                                        </div>
                                        <div className="py-2 px-3 border border-stone-600 shadow shadow-emerald-100 rounded-sm text-center">
                                            <h1 className="font-semibold text-gray-800 text-sm">Maturity Rate</h1>
                                            <h1 className="font-medium text-gray-900 text-sm">{result?.RateAtMaturity || 0}</h1>
                                        </div>
                                        <div className="py-2 px-3 border border-stone-600 shadow shadow-emerald-100 rounded-sm text-center">
                                            <h1 className="font-semibold text-gray-800 text-sm">Maturity Value</h1>
                                            <h1 className="font-medium text-gray-900 text-sm">{result?.maturityValue || 0}</h1>
                                        </div>
                                        <div className="py-2 px-3 border border-stone-600 shadow shadow-emerald-100 rounded-sm text-center">
                                            <h1 className="font-semibold text-gray-800 text-sm">Absolute Return(%)</h1>
                                            <h1 className="font-medium text-gray-900 text-sm">{result?.absoluteReturns || 0}</h1>
                                        </div>
                                        <div className="py-2 px-3 border border-stone-600 shadow shadow-emerald-100 rounded-sm text-center">
                                            <h1 className="font-semibold text-gray-800 text-sm">XIRR (%)</h1>
                                            <h1 className="font-medium text-gray-900 text-sm">{result?.xirrRate || 0}</h1>
                                        </div>
                                    </div>
                                    <div id="graphId">
                                        {graphData && <SchemePerformanceChart data={result} startDate={startSchemeDate} endDate={valuationDate} title={title} />}
                                    </div>
                                </div>
                                :
                                <div>
                                    {graphData && <SchemePerformanceTable data={tableResult} title={title} />}
                                </div>
                            }
                        </div>
                        {error && (
                            <div>No Data Found</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}