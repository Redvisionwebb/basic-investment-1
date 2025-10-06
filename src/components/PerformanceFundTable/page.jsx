"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CryptoJS from "crypto-js";

export default function MutualFundTable({ performanceData, schemeName }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [fundList, setFundList] = useState(performanceData);
  const [filteredFunds, setFilteredFunds] = useState([]);
  const router = useRouter();
  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

  // Set fund list from performanceData
  useEffect(() => {
    if (performanceData && Array.isArray(performanceData)) {
      setFundList(performanceData);
    }
  }, [performanceData]);
  // console.log(fundList)

  // Apply search and sorting
  useEffect(() => {
    let result = [...fundList];

    if (searchQuery) {
      result = result.filter((f) =>
        f?.funddes?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === "fundSize") {
      result.sort((a, b) => b.Corpus - a.Corpus);
    } else if (sortBy === "returns") {
      const getReturnValue = (fund) => {
        return parseFloat(
          fund?.five_year !== "0.00" ? fund.five_year :
            fund?.three_year !== "0.00" ? fund.three_year :
              fund?.one_year !== "0.00" ? fund.one_year :
                fund?.nine_month !== "0.00" ? fund.nine_month :
                  fund?.six_month !== "0.00" ? fund.six_month :
                    fund?.three_month !== "0.00" ? fund.three_month :
                      fund?.one_month !== "0.00" ? fund.one_month :
                        fund?.one_week !== "0.00" ? fund.one_week :
                          "0"
        );
      };

      result.sort((a, b) => getReturnValue(b) - getReturnValue(a));
    } else if (sortBy === "nav") {
      const getNavValue = (fund) => {
        return parseFloat(
          fund?.fiveyear_navEndDate !== "0.00" ? fund.fiveyear_navEndDate :
            fund?.threeyear_navEndDate !== "0.00" ? fund.threeyear_navEndDate :
              fund?.one_year !== "0.00" ? fund.one_year :
                fund?.nine_month !== "0.00" ? fund.nine_month :
                  fund?.six_month !== "0.00" ? fund.six_month :
                    fund?.three_month !== "0.00" ? fund.three_month :
                      fund?.onemonth_navEndDate !== "0.00" ? fund.onemonth_navEndDate :
                        fund?.oneweek_navEndDate !== "0.00" ? fund.oneweek_navEndDate :
                          "0"
        );
      };

      result.sort((a, b) => getNavValue(b) - getNavValue(a));
    }

    setFilteredFunds(result);
  }, [searchQuery, sortBy, fundList]);


  const handleSelectFunds = (fund) => {
    const dataToStore = {
      pcode: fund.pcode,
      ftype: schemeName,
      timestamp: Date.now(),
    };

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(dataToStore),
      SECRET_KEY
    ).toString();

    localStorage.setItem("encryptedFundPerormanceData", encrypted);

    router.push("/performance/fund-performance/fund-details");
  };

  return (
    <div className="max-w-screen-xl mx-auto section">
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <input
          type="text"
          placeholder="Search fund name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3 bg-white"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded w-full md:w-1/4 bg-white"
        >
          <option value="">Sort by</option>
          <option value="fundSize">Sort by Fund Size</option>
          <option value="returns">Sort by Returns</option>
          <option value="nav">Sort by NAV</option>
        </select>
      </div>

      {/* Fund List */}
      <div className="bg-[var(--rv-third)] shadow rounded  overflow-hidden">
        {filteredFunds.length > 0 ? (
          filteredFunds.map((fund, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectFunds(fund)}
              className="flex flex-col md:flex-row justify-between items-center border-b border-[var(--rv-primary)] gap-4 p-4 hover:bg-[var(--rv-primary)] text-[var(--rv-black)] hover:text-[var(--rv-white)]  cursor-pointer"
            >
              <div className="flex items-center gap-3 w-full md:w-1/2">
                {/* <Image
                  src={fund.logo || "/default-logo.png"}
                  alt="Logo"
                  width={36}
                  height={36}
                  className="rounded"
                /> */}
                <div>
                  <p className="font-semibold">{fund.funddes}</p>
                  <p className="text-sm text-gray-700">
                    {fund.schemeCategory}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-center text-center w-full md:w-1/2">
                <div className="md:text-right">
                  <p className="text-sm text-gray-700">Corpus</p>
                  <p className="font-medium text-gray-600">
                    ₹{fund?.Corpus} Cr
                  </p>
                </div>
                <div className="md:text-right">
                  {fund?.fiveyear_navEndDate &&
                    fund.fiveyear_navEndDate !== "0.00" && (
                      <div>
                        <p className="text-sm text-gray-700">NAV</p>
                        <p className="font-medium text-gray-600">
                          ₹{fund?.fiveyear_navEndDate}
                        </p>
                      </div>
                    ) || (fund?.threeyear_navEndDate &&
                      fund.threeyear_navEndDate !== "0.00" && (
                        <div>
                          <p className="text-sm text-gray-700">NAV</p>
                          <p className="text-lg font-medium text-gray-600">
                            ₹ {fund?.threeyear_navEndDate}
                          </p>
                        </div>
                      ))
                    || (fund?.oneyear_navEndDate
                      &&
                      fund.oneyear_navEndDate !== "0.00" && (
                        <div>
                          <p className="text-sm text-gray-700">NAV</p>
                          <p className="text-lg font-medium text-gray-600">
                            ₹ {fund?.oneyear_navEndDate}
                          </p>
                        </div>
                      )) || (/* Add six_month check here if available */
                      fund?.sixmonth_navEndDate &&
                      fund.sixmonth_navEndDate !== "0.00" && (
                        <div>
                          <h3 className="text-sm text-gray-700">NAV</h3>
                          <p className="text-lg font-medium text-gray-600">
                            ₹ {fund?.sixmonth_navEndDate}
                          </p>
                        </div>
                      ))
                    || (/* Add six_month check here if available */
                      fund?.three_month - navEndDate &&
                      fund.three_month - navEndDate !== "0.00" && (
                        <div>
                          <h3 className="text-sm text-gray-700">NAV: 6 Month Data</h3>
                          <p className="text-lg font-medium text-gray-600">
                            ₹ {fund?.three_month - navEndDate}
                          </p>
                        </div>
                      ))
                    || (/* Add six_month check here if available */
                      fund?.onemonth_navEndDate &&
                      fund.onemonth_navEndDate !== "0.00" && (
                        <div>
                          <h3 className="text-sm text-gray-700">NAV: 6 Month Data</h3>
                          <p className="text-lg font-medium text-gray-600">
                            ₹ {fund?.onemonth_navEndDate}
                          </p>
                        </div>
                      ))
                    || (/* Add six_month check here if available */
                      fund?.oneweek_navEndDate &&
                      fund.oneweek_navEndDate !== "0.00" && (
                        <div>
                          <h3 className="text-sm text-gray-700">NAV: 6 Month Data</h3>
                          <p className="text-lg font-medium text-gray-600">
                            ₹ {fund?.oneweek_navEndDate}
                          </p>
                        </div>
                      ))}

                </div>
                <div className="md:text-right">
                  {(() => {
                    const {
                      five_year,
                      three_year,
                      one_year,
                      nine_month,
                      six_month,
                      three_month,
                      one_month,
                      one_week,
                    } = fund || {};

                    let value = "0.00";
                    let label = "";

                    if (five_year !== "0.00") {
                      value = five_year;
                      label = "5Y";
                    } else if (three_year !== "0.00") {
                      value = three_year;
                      label = "3Y";
                    } else if (one_year !== "0.00") {
                      value = one_year;
                      label = "1Y";
                    } else if (nine_month !== "0.00") {
                      value = nine_month;
                      label = "9M";
                    } else if (six_month !== "0.00") {
                      value = six_month;
                      label = "6M";
                    } else if (three_month !== "0.00") {
                      value = three_month;
                      label = "3M";
                    } else if (one_month !== "0.00") {
                      value = one_month;
                      label = "1M";
                    } else if (one_week !== "0.00") {
                      value = one_week;
                      label = "1W";
                    } else {
                      value = "0";
                      label = "1D";
                    }

                    return (
                      <>
                        <p className="text-sm text-gray-700">
                          {label} CAGR returns
                        </p>
                        <p className="font-medium text-green-600">{value}%</p>
                      </>
                    );
                  })()}
                </div>
                <div className="md:text-right">
                  <Link href="/contact-us" className="">
                    <button

                      className="bg-[var(--rv-secondary)]  text-[var(--rv-white)]  font-bold px-6 py-2 rounded-lg   transition-all"
                    >
                      Invest
                    </button>
                  </Link>
                </div>
              </div>


            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No funds match your search.
          </div>
        )}
      </div>
    </div>
  );
}
