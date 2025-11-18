import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import axios from "axios";
import Link from "next/link";


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
export const SipCalculator= ({ data }) => {
  const router = useRouter();
  const [roboUser, setRoboUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [monthlyInvestment, setMonthlyInvestment] = useState(500);
  const [oneTimeInvestment, setOneTimeInvestment] = useState(500);
  const [investmentDuration, setInvestmentDuration] = useState(1);
  const [expectedReturn] = useState(data?.si || data?.sinceInceptionReturn);
  const [investAmount, setInvestAmount] = useState("");
  const [showInvestPopup, setShowInvestPopup] = useState(false);
  const [result, setResult] = useState(null);
  const [isMonthlySip, setIsMonthlySip] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const fetchRoboUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/robo`
        );
        if (res.data.success) {
          setRoboUser(res.data.data);
        } else {
          console.warn("No Robo User found.");
        }
      } catch (error) {
        console.error("Error fetching Robo User:", error);
      }
    };
    fetchRoboUser();
  }, []);

  const calculateSip = () => {
    const monthlyRate = expectedReturn / 12 / 100;
    const months = investmentDuration * 12;
    let futureValue, totalInvestment;

    if (isMonthlySip) {
      futureValue =
        monthlyInvestment *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
        (1 + monthlyRate);
      totalInvestment = monthlyInvestment * months;
    } else {
      futureValue = oneTimeInvestment * Math.pow(1 + monthlyRate, months);
      totalInvestment = oneTimeInvestment;
    }

    setResult({
      futureValue: Number(futureValue.toFixed(2)),
      totalInvestment: Number(totalInvestment.toFixed(2)),
    });
  };

  useEffect(() => {
    calculateSip();
  }, [monthlyInvestment, oneTimeInvestment, investmentDuration, expectedReturn, isMonthlySip]);

  const handleInvestSubmit = async (result, pcode) => {
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
      router.push("/login");
    } catch (error) {
      console.error("Error fetching minimum amount:", error);
      alert("Failed to fetch minimum investment amount. Please try again.");
    }
  };

  return (
    <div className="sip-calculator container mx-auto p-3 sticky top-0 z-10">
      <h2 className="text-2xl font-bold text-center mb-2">SIP Calculator</h2>

      {/* Toggle SIP Type */}
      <div className="flex justify-center space-x-4 mb-8">
        <Button
          onClick={() => setIsMonthlySip(true)}
          className={`rounded-full ${
            isMonthlySip
              ? "bg-[var(--rv-primary)] text-white"
              : "bg-white text-[var(--rv-primary)] border border-[var(--rv-primary)]"
          }`}
        >
          Monthly SIP
        </Button>
        <Button
          onClick={() => setIsMonthlySip(false)}
          className={`rounded-full ${
            !isMonthlySip
              ? "bg-[var(--rv-primary)] text-white"
              : "bg-white text-[var(--rv-primary)] border border-[var(--rv-primary)]"
          }`}
        >
          One-Time Investment
        </Button>
      </div>

      {/* Input sliders */}
      {isMonthlySip ? (
        <InputSlider
          label="Monthly Investment (₹)"
          min={500}
          max={100000}
          step={100}
          value={monthlyInvestment}
          setValue={setMonthlyInvestment}
        />
      ) : (
        <InputSlider
          label="Total Investment (₹)"
          min={500}
          max={1000000}
          step={100}
          value={oneTimeInvestment}
          setValue={setOneTimeInvestment}
        />
      )}

      <InputSlider
        label="Investment Duration (Years)"
        min={1}
        max={90}
        step={1}
        value={investmentDuration}
        setValue={setInvestmentDuration}
      />

      {/* Calculation Results */}
      {result && (
        <div className="mt-5">
          <div className="flex justify-between px-5 mb-3">
            <p>Invested Amount</p>
            <p className="font-bold text-lg">
              ₹{result.totalInvestment.toLocaleString("en-IN")}
            </p>
          </div>
          <hr className="mb-3" />
          <div className="flex justify-between px-5 mb-3">
            <p>Wealth Gained</p>
            <p className="font-bold text-lg">
              ₹{Math.floor(result.futureValue - result.totalInvestment).toLocaleString("en-IN")}
            </p>
          </div>
          <hr className="mb-3" />
          <div className="flex justify-between px-5 mb-3">
            <p>Expected Amount</p>
            <p className="font-bold text-lg">
              ₹{result.futureValue.toLocaleString("en-IN")}
            </p>
          </div>
          <hr />
        </div>
      )}

      {/* Purchase Dialog */}
      <Dialog open={showInvestPopup} onOpenChange={setShowInvestPopup}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{data?.funddes}</DialogTitle>
            <DialogTitle className="text-lg">Enter Lumpsum Amount</DialogTitle>
          </DialogHeader>

          <div>
            <Input
              type="number"
              min={1}
              placeholder="Enter Amount"
              value={investAmount}
              onChange={(e) => setInvestAmount(e.target.value)}
            />
            {errorMessage && <p className="text-red-600 text-sm mt-2">{errorMessage}</p>}
          </div>

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

          <div className="flex justify-end gap-3 mt-6">
            <Button
              className="bg-[var(--rv-primary)] text-white"
              onClick={() => handleInvestSubmit(result, data?.pcode)}
               disabled={!isConfirmed}
            >
              Purchase
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Purchase Button */}
      {!isMonthlySip && (
        <div className="flex justify-center items-center mt-10">
          {roboUser ? (
            <Button
              onClick={() => setShowInvestPopup(true)}
              className="bg-[var(--rv-primary)] text-white px-6 py-2 rounded-lg"
            >
              Purchase Now
            </Button>
          ) : (
            <Link href="/login">
              <Button className="bg-[var(--rv-primary)] text-white px-6 py-2 rounded-lg">
                Purchase Now
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};


