"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CryptoJS from "crypto-js";
import axios from "axios";
import { Toast } from "./ui/toast";

export default function TopSuggestedFund({
  performanceData,
  schemeName,
  roboUser,
  answers,
  questions,
}) {
  const [fundList, setFundList] = useState(performanceData);
  const [filteredFunds, setFilteredFunds] = useState([]);
  const [investAmount, setInvestAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
const [isConfirmed, setIsConfirmed] = useState(false);
  const [showInvestPopup, setShowInvestPopup] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);

  const router = useRouter();
  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

  useEffect(() => {
    if (performanceData && Array.isArray(performanceData)) {
      const topData = performanceData;
      setFundList(topData);
    }
  }, [performanceData]);

  useEffect(() => {
    let result = [...fundList];
    const getReturnValue = (fund) => {
      return parseFloat(
        fund?.five_year !== "0.00"
          ? fund.five_year
          : fund?.three_year !== "0.00"
          ? fund.three_year
          : fund?.one_year !== "0.00"
          ? fund.one_year
          : fund?.nine_month !== "0.00"
          ? fund.nine_month
          : fund?.six_month !== "0.00"
          ? fund.six_month
          : fund?.three_month !== "0.00"
          ? fund.three_month
          : fund?.one_month !== "0.00"
          ? fund.one_month
          : fund?.one_week !== "0.00"
          ? fund.one_week
          : "0"
      );
    };
    result.sort((a, b) => getReturnValue(b) - getReturnValue(a));
    setFilteredFunds(result);
  }, [fundList]);

  // Scroll lock when popup is open
  useEffect(() => {
    if (showInvestPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showInvestPopup]);

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

  const handleInvestSubmit = async (pcode) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/robo/get-minimum-amount`,
        {
          schemeCode: pcode,
          arn_id: roboUser?.arnId,
        }
      );

      const minAmount = res?.data?.data?.data[pcode] || 0;
      const enteredAmount = parseFloat(investAmount);

      if (!enteredAmount || enteredAmount <= 0) {
        setErrorMessage("Please enter a valid investment amount.");
        return;
      }

      if (enteredAmount < minAmount) {
        setErrorMessage(`Minimum investment amount is ₹${minAmount}.`);
        return;
      }

      const funds = [
        {
          pcode,
          allocation: "100",
          allocationAmount: enteredAmount,
        },
      ];

      const investmentData = {
        arnid: roboUser?.arnId,
        arnnumber: roboUser?.arnNumber,
        totalAmount: enteredAmount,
        funds,
      };

      localStorage.setItem("investmentData", JSON.stringify(investmentData));
      setShowInvestPopup(false);
      setInvestAmount("");

       if (
  answers &&
  Array.isArray(answers) &&
  answers.every(
    (ans) =>
      ans?.selectedAnswerText != null && ans?.selectedAnswerMarks != null
  )
) {
  // ✅ Only run this if all answers are valid
  const payload = {
    arnId: roboUser?.arnId,
    clientId: "6",
    all_questions_ans: answers.map((ans) => {
      const question = questions.find((q) => q._id === ans.questionId);
      const answerIndex =
        question?.answers.findIndex(
          (a) => a.marks == ans.selectedAnswerMarks
        ) ?? 0;

      return {
        question_id: ans.questionId,
        answer_id: `ans_${answerIndex}_${ans.questionId}`,
        answer: ans.selectedAnswerText,
        marks: ans.selectedAnswerMarks,
      };
    }),
    risk_profile: "true",
  };

  localStorage.setItem("riskProfilePayload", JSON.stringify(payload));
}
      router.push("/login");
    } catch (error) {
      console.error("Error fetching minimum amount:", error);
      alert("Failed to fetch minimum investment amount. Please try again.");
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="bg-[var(--rv-primary)] text-[var(--rv-white)] shadow rounded overflow-hidden">
        {filteredFunds.length > 0 ? (
          filteredFunds.map((fund, idx) => (
            <div
              key={idx}
              className="
                group
                flex flex-col md:flex-row justify-between items-center 
                border-b border-[var(--rv-primary)] gap-4 p-4 
                hover:bg-[var(--rv-secondary-dark)] cursor-pointer
                transition-all duration-300
              "
            >
              {/* Left Section */}
              <div
                className="flex items-center gap-3 w-full md:w-1/2"
                onClick={() => handleSelectFunds(fund)}
              >
                <div>
                  <p className="font-semibold group-hover:text-[var(--rv-primary)] transition-all">
                    {fund.funddes}
                  </p>
                  <p className="text-sm text-gray-100 group-hover:text-[var(--rv-primary)] transition-all">
                    {fund.schemeCategory}
                  </p>
                </div>
              </div>

              {/* Right Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1 items-center text-center w-full md:w-1/2">
                {/* Corpus */}
                <div
                  className="md:text-right"
                  onClick={() => handleSelectFunds(fund)}
                >
                  <p className="text-sm text-gray-100 group-hover:text-[var(--rv-primary)] transition-all">
                    Corpus
                  </p>
                  <p className="font-medium text-gray-100 group-hover:text-[var(--rv-primary)] transition-all">
                    ₹{fund?.Corpus} Cr
                  </p>
                </div>

                {/* NAV Section */}
                <div
                  className="md:text-right"
                  onClick={() => handleSelectFunds(fund)}
                >
                  {(() => {
                    const navValue =
                      fund?.fiveyear_navEndDate !== "0.00"
                        ? fund.fiveyear_navEndDate
                        : fund?.threeyear_navEndDate !== "0.00"
                        ? fund.threeyear_navEndDate
                        : fund?.oneyear_navEndDate !== "0.00"
                        ? fund.oneyear_navEndDate
                        : fund?.sixmonth_navEndDate !== "0.00"
                        ? fund.sixmonth_navEndDate
                        : fund?.three_month !== "0.00"
                        ? fund.three_month
                        : fund?.onemonth_navEndDate !== "0.00"
                        ? fund.onemonth_navEndDate
                        : fund?.oneweek_navEndDate !== "0.00"
                        ? fund.oneweek_navEndDate
                        : null;

                    return navValue ? (
                      <>
                        <p className="text-sm text-gray-100 group-hover:text-[var(--rv-primary)] transition-all">
                          NAV
                        </p>
                        <p className="font-medium text-gray-100 group-hover:text-[var(--rv-primary)] transition-all">
                          ₹{navValue}
                        </p>
                      </>
                    ) : null;
                  })()}
                </div>

                {/* Returns */}
                <div
                  className="md:text-right"
                  onClick={() => handleSelectFunds(fund)}
                >
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
                    }

                    return (
                      <>
                        <p className="text-sm text-gray-100 group-hover:text-[var(--rv-primary)] transition-all">
                          {label} CAGR returns
                        </p>
                        <p className="font-medium text-green-700 group-hover:text-[var(--rv-primary)] transition-all">
                          {value}%
                        </p>
                      </>
                    );
                  })()}
                </div>

                {/* Invest Button */}
                <div className="md:text-right">
                  {roboUser ? (
                    <button
                      onClick={() => {
                        setSelectedFund(fund);
                        setShowInvestPopup(true);
                      }}
                      className="
                        bg-[var(--rv-secondary)]
                        text-[var(--rv-primary)] hover:bg-[var(--rv-primary)] hover:text-[var(--rv-secondary)]
                        font-bold px-6 py-2 rounded-lg transition-all
                      "
                    >
                      Purchase Now
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="
                        bg-[var(--rv-secondary)]
                        text-[var(--rv-primary)] hover:bg-[var(--rv-primary)] hover:text-[var(--rv-secondary)]
                        font-bold px-1 py-2 rounded-lg transition-all
                      "
                    >
                      Purchase Now
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No funds match your search.
          </div>
        )}

        {/* ✅ Popup outside map */}
        {showInvestPopup && selectedFund && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
            <div className="bg-white text-black rounded-lg shadow-xl max-w-md w-full px-7 py-6 relative">
              <button
                onClick={() => setShowInvestPopup(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>

              <h2 className="text-xl font-bold mb-3">{selectedFund.funddes}</h2>
              <p className="text-start mb-2 font-medium">
                Enter Lumpsum Amount
              </p>

              <input
                type="number"
                min={1}
                value={investAmount}
                 onChange={(e) => {
                  setInvestAmount(e.target.value);
                  setErrorMessage(""); // ✅ clear error when typing new amount
                }}
                placeholder="Enter amount"
                className="border rounded-lg w-full p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[var(--rv-primary)]"
              />

              {errorMessage && (
                <p className="text-red-600 text-sm mb-2">{errorMessage}</p>
              )}

                <div className="flex items-start gap-2">
                        <input
                            id="disclaimerCheckbox"
                            type="checkbox"
                            className="mt-1 w-4 h-4 text-[var(--rv-primary)] border-gray-300 rounded focus:ring-[var(--rv-primary)]"
                            checked={isConfirmed}
                            onChange={(e) => setIsConfirmed(e.target.checked)}
                        />
                        <label
                            htmlFor="disclaimerCheckbox"
                            className="text-start text-sm text-gray-700 leading-snug"
                        >
                            I understand this is factual information only and I am investing at my own discretion.
                            <br />
                            This transaction is execution-only, and the distributor has not provided investment advice.
                        </label>
                    </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
  onClick={() => handleInvestSubmit(selectedFund.pcode)}
  disabled={!isConfirmed}
  className={`btn btn-secondary ${
    !isConfirmed ? "opacity-50 cursor-not-allowed" : ""
  }`}
>
  Purchase
</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
