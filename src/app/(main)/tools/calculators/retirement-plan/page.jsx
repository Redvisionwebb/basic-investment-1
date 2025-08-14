"use client";

import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { SippieChart } from "@/components/charts/sippiechart"; // Ensure you have the chart component
import { CalculatorReturnChart } from "@/components/charts/calculatorReturnChart"; // Ensure you have the chart component
import { calculators } from "@/data/calculators";
import { useRouter } from "next/navigation";
import axios from "axios";
import { formatValue } from "react-currency-input-field";
import CurrencyInput from "react-currency-input-field";
import { RetirementChart } from "@/components/charts/retirementpiechart";
import RetrementBarChart from "@/components/charts/retirementReturnChart";

const amountToCommaSeperated = (value) => {
  const newValue = formatValue({
    value: value?.toString(),
    groupSeparator: ",",
    decimalSeparator: ".",
    prefix: "₹",
    intlConfig: { locale: "en-IN", currency: "INR" },
  });
  return newValue;
};

export default function RetirementCalculator() {
  const router = useRouter();

  const [curentAge, setCurrentAge] = useState("30");
  const [RetirementAge, setRetirementAge] = useState("60");
  const [lifeExpectancy, setLifeExpectancy] = useState("85");
  const [currentlyMonth, setCurrentlyMonth] = useState("40000");
  const [InflationRate, setInflationRate] = useState("7");
  const [pretrement, setPretrement] = useState("14");
  const [postretrement, setPostretrement] = useState("7");

  const [inflationpostretrement, setInflationpostretrement] = useState("5");
  // Table graph
  const [table, setTable] = useState(false);
  const [graph, setgraph] = useState(true);
  const [data, setData] = useState();
  const [namerow, setRowName] = useState();
  //double sip Amount
  const [totalMonthlyExpences, setTotalMonthlyExpences] = useState();
  const [totalLumpsumCorpuss, setTotalLumpsumCorpuss] = useState();
  const [totalThroughSips, setTotalThroughSips] = useState();
  const [totalThroughLumpsums, setTotalThroughLumpsums] = useState();
  //piec chart data
  const [principalAmount, setPrincipalAmount] = useState();
  const [intrestAmount, setIntrestAmount] = useState();

  // barChart graph

  const [years, setYears] = useState();
  const [principalBarAmount, setPrincipalBarAmount] = useState();
  const [Intrested, setIntrested] = useState();
  const [balance, setBalance] = useState();

  const handleCalculatorChange = (e) => {
    const selectedRoute = e.target.value;
    if (selectedRoute) {
      router.push(selectedRoute); // Navigate to selected route
    }
  };

  const handleCurrentAge = (e) => {
    let { value, min, max } = e.target;
    value = Math.max(Number(min), Math.min(Number(max), Number(value)));
    setCurrentAge(value);
  };

  const handleRetrimentAge = (e) => {
    let { value, min, max } = e.target;
    value = Math.max(Number(min), Math.min(Number(max), Number(value)));
    setRetirementAge(value);
  };

  const handleLifeExpectancy = (e) => {
    let { value, min, max } = e.target;
    value = Math.max(Number(min), Math.min(Number(max), Number(value)));
    setLifeExpectancy(value);
  };

  const handleCurrentMonth = (e) => {
    e.preventDefault();
    let { value, min, max } = e.target;
    value = Math.max(
      Number(min),
      Math.min(Number(max), Number(value?.replace(/[^\d.]/gi, "")))
    );
    setCurrentlyMonth(value);
  };

  const handleInflationRate = (e) => {
    e.preventDefault();
    const { value } = e.target;
    if (value >= 0 && value <= 30) {
      setInflationRate(value);
    } else {
      setInflationRate("0");
    }
  };

  const handlePreretrement = (e) => {
    e.preventDefault();
    const { value } = e.target;
    if (value >= 0 && value <= 30) {
      setPretrement(value);
    } else {
      setPretrement(0);
    }
  };

  const handlePostretrement = (e) => {
    e.preventDefault();
    const { value } = e.target;
    if (value >= 0 && value <= 30) {
      setPostretrement(value);
    } else {
      setPostretrement(0);
    }
  };

  useEffect(() => {
    const calculateCorpus = () => {
      const amount = parseInt(currentlyMonth);
      const rate = parseInt(InflationRate) / 100;
      const G = parseInt(inflationpostretrement) / 100;
      const R = parseInt(postretrement) / 100;
      const duration = parseInt(RetirementAge) - parseInt(curentAge);
      const lifeExpectancyage =
        parseInt(lifeExpectancy) - parseInt(RetirementAge);
      const yearlyfinal_amounts = amount * Math.pow(1 + rate, duration);
      const Monthlyexpense = Math.round(yearlyfinal_amounts);
      const Principal = parseInt(Monthlyexpense) * 12;
      const numerator = 1 - Math.pow((1 + G) / (1 + R), lifeExpectancyage);
      const denominator = R - G;
      const CorpusAmount = Math.round(Principal * (numerator / denominator));
      const monthlyRates = parseInt(pretrement) / 100;
      const sipAmounts =
        CorpusAmount /
        (((Math.pow(1 + monthlyRates / 12, duration * 12) - 1) /
          (monthlyRates / 12)) *
          (1 + monthlyRates / 12));

      var cage = parseInt(curentAge);
      var mage = parseInt(RetirementAge);
      var eage = parseInt(lifeExpectancy);
      var cmexp = parseInt(currentlyMonth);
      var inte = parseInt(InflationRate) / 400;
      var infla = parseInt(InflationRate);
      var exret = parseInt(pretrement) / 400;
      var intre = parseInt(pretrement);
      var expextintre = parseInt(postretrement);
      var amut = cmexp;
      var year = mage - cage;
      var interest = infla / 400;
      var infrete = infla / 100;
      var retexp = expextintre / 100;
      var durations = (year * 12) / 3;
      var amut = amut * 12;
      var a = 1 + interest;
      a = Math.pow(a, durations);
      a = Math.round(amut * a);
      var nper = eage - (mage - 1);
      var net_returns = (1 + retexp) / (1 + infrete) - 1;
      if (net_returns != 0)
        var pv =
          (a *
            (1 + net_returns * 1) *
            ((Math.pow(1 + net_returns, nper) - 1) / net_returns)) /
          Math.pow(1 + net_returns, nper);
      else pv = a * nper;
      var fuvalue = Math.round(pv);
      setTotalLumpsumCorpuss(fuvalue);
      var n = (year * 12) / 3;
      var i = intre / 400;
      var ana = 1 + i;
      ana = Math.pow(ana, n);
      ana = ana - 1;
      var b = 1 + i;
      b = Math.pow(b, -1 / 3);
      b = 1 - b;
      var mon = Math.round((b * fuvalue) / ana);
      setTotalThroughSips(mon);
      var al = 1 + i;
      al = Math.pow(al, durations);
      var amut = Math.round(fuvalue / al);
      setTotalThroughLumpsums(amut);
      setTotalMonthlyExpences(Math.round(a / 12));
      var d = new Date();
      var n_year = d.getFullYear();
      var yearArr = [];
      var principalArr = [];
      var balanceArr = [];
      var monthArr = [];
      var tableData = [];
      var exportData = [];
      var rowname = [];
      var mage = parseInt(RetirementAge);
      var retexps = parseInt(postretrement) / 100;
      var ann_exp = a;
      var corpus1 = fuvalue;
      var rage = 0;
      var balance = corpus1 - ann_exp;

      var balancess = corpus1 - ann_exp;
      var blnc_grwth = Math.round(balance + balance * retexps);
      var bintr = Math.round(balance * retexp);

      while (fuvalue > 0 && rage <= lifeExpectancyage) {
        if (balance < 20) {
          balance = 0;
          bintr = 0;
          blnc_grwth = 0;
        }
        var age = parseInt(mage);

        var balances = formatValue({
          value: balance?.toString(),
          groupSeparator: ",",
          decimalSeparator: ".",
          prefix: "₹",
          intlConfig: { locale: "en-IN", currency: "INR" },
        });
        var corpus = corpus1;
        var corpus = formatValue({
          value: corpus1?.toString(),
          groupSeparator: ",",
          decimalSeparator: ".",
          prefix: "₹",
          intlConfig: { locale: "en-IN", currency: "INR" },
        });

        var MonthlyExpences = Math.round(ann_exp / 12);
        var MonthlyExpence = formatValue({
          value: MonthlyExpences?.toString(),
          groupSeparator: ",",
          decimalSeparator: ".",
          prefix: "₹",
          intlConfig: { locale: "en-IN", currency: "INR" },
        });

        var AnnualExpense = Math.round(ann_exp);
        var AnnualExpenses = formatValue({
          value: AnnualExpense?.toString(),
          groupSeparator: ",",
          decimalSeparator: ".",
          prefix: "₹",
          intlConfig: { locale: "en-IN", currency: "INR" },
        });
        // var interest = bintr
        var interest = formatValue({
          value: bintr?.toString(),
          groupSeparator: ",",
          decimalSeparator: ".",
          prefix: "₹",
          intlConfig: { locale: "en-IN", currency: "INR" },
        });
        // var BalanceGrowth = blnc_grwth
        var BalanceGrowth = formatValue({
          value: blnc_grwth?.toString(),
          groupSeparator: ",",
          decimalSeparator: ".",
          prefix: "₹",
          intlConfig: { locale: "en-IN", currency: "INR" },
        });

        tableData.push({
          age: age,
          corpus: amountToCommaSeperated(parseInt(corpus1).toFixed(0)),
          MonthlyExpence: amountToCommaSeperated(
            parseInt(MonthlyExpences).toFixed(0)
          ),
          AnnualExpenses: amountToCommaSeperated(
            parseInt(AnnualExpense).toFixed(0)
          ),
          balance: amountToCommaSeperated(parseInt(balance).toFixed(0)),
          interest: amountToCommaSeperated(parseInt(bintr).toFixed(0)),
          BalanceGrowth: amountToCommaSeperated(
            parseInt(blnc_grwth).toFixed(0)
          ),
        });

        exportData.push({
          age: age,
          corpus: corpus1,
          MonthlyExpence: MonthlyExpences,
          AnnualExpenses: AnnualExpense,
          balances: balance,
          interest: bintr,
          BalanceGrowth: blnc_grwth,
        });

        principalArr.push(ann_exp);
        n_year = parseInt(n_year) + 1;
        yearArr.push(`Age-${mage} Years`);
        balanceArr.push(blnc_grwth);
        monthArr.push(Math.round(ann_exp / 12));
        rage = rage + 1;
        var mage = parseInt(mage) + 1;
        corpus1 = blnc_grwth;
        ann_exp = Math.round(ann_exp + ann_exp * infrete);
        balance = corpus1 - ann_exp;
        // console.log(balance, "balance");
        blnc_grwth = Math.round(balance + balance * retexp);
        bintr = Math.round(balance * retexp);
      }

      setYears(yearArr);
      setPrincipalBarAmount(principalArr);
      setIntrested(monthArr);
      setBalance(balanceArr);


      var p = sipAmounts;
      var n = ((duration + 1) * 12) / 3;
      var i_rate = parseInt(postretrement) / 400;
      var amount1 = 1 + i_rate;
      amount1 = Math.pow(amount1, n);
      amount1 = amount1 - 1;
      amount1 = p * amount1;
      var amount2 = 1 + i_rate;
      amount2 = Math.pow(amount2, -1 / 3);
      amount2 = 1 - amount2;
      var final_amount = amount1 / amount2;
      var sipAmount = parseInt(p);
      var sipMonth = parseInt(n);
      var rateofReturn = Math.round(i_rate, 10);
      final_amount = Math.round(final_amount);
      var invest_amount = sipAmount * ((duration + 1) * 12);
      setPrincipalAmount(invest_amount);
      var interest_total = final_amount - invest_amount;
      setIntrestAmount(interest_total);
      setData(tableData);
    };
    calculateCorpus();
  }, [
    InflationRate,
    RetirementAge,
    curentAge,
    currentlyMonth,
    lifeExpectancy,
    postretrement,
    pretrement,
    inflationpostretrement,
  ]);

  console.log(
    totalLumpsumCorpuss,
    totalThroughSips,
    totalThroughLumpsums,
    totalMonthlyExpences,
    currentlyMonth
  );

  return (
    <div className="pt-20">
      <div className="max-w-screen-xl mx-auto main_section">
        <div>
          <div>
            <div className="mb-5 flex flex-col md:flex-row gap-5 justify-between ">
              <div className="">
                <span className="text-2xl md:text-3xl font-bold uppercase">
                  Retirement Planning Calculator
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Explore other calculators</span>
                <select
                  className="w-full border border-gray-500 rounded-lg p-2"
                  onChange={handleCalculatorChange}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {calculators.map((calc) => (
                    <option key={calc.title} value={calc.route}>
                      {calc.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-4">
              <div className="col-span-1 border border-gray-200 rounded-2xl bg-white p-5">
                <div className="sip-calculator container mx-auto p-3 sticky top-0 z-10">
                  <div className="input-fields mt-5 mb-10">
                    <div>
                      <div className="flex justify-between">
                        <span>Current Age (Y)</span>
                        <div>
                          <input
                            type="text"
                            value={curentAge || ""}
                            min="0"
                            max="100"
                            placeholder="0"
                            onChange={handleCurrentAge}
                            className="font-semibold text-var(--rv-primary) w-20 border px-2 py-2 rounded"
                          />
                        </div>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        step="1"
                        value={isNaN(curentAge) ? 0 : curentAge}
                        onChange={handleCurrentAge}
                        className="customRange w-full"
                        style={{
                          "--progress":
                            (((isNaN(curentAge) ? 0 : curentAge) - 1) /
                              (100 - 1)) *
                            100 +
                            "%",
                        }}
                      />
                    </div>
                    <div className="items-center mt-5">
                      <div className="flex justify-between">
                        <span>Retirement Age(Y)</span>
                        <input
                          min="0"
                          max="100"
                          type="text"
                          placeholder="0"
                          value={RetirementAge || ""}
                          onChange={handleRetrimentAge}
                          className="font-semibold text-var(--rv-primary) w-20 border px-2 py-2 rounded"
                        />
                      </div>
                      <input
                        type="range"
                        min="35"
                        max="100"
                        step="1"
                        value={isNaN(RetirementAge) ? 0 : RetirementAge}
                        onChange={handleRetrimentAge}
                        className="customRange w-full"
                        style={{
                          "--progress":
                            (((isNaN(RetirementAge) ? 0 : RetirementAge) - 35) /
                              (100 - 35)) *
                            100 +
                            "%",
                        }}
                      />
                    </div>

                    <div className="items-center mt-5">
                      <div className="flex justify-between">
                        <span>Life Expectancy (Y)</span>
                        <input
                          min="0"
                          max="100"
                          type="text"
                          value={lifeExpectancy || ""}
                          onChange={handleLifeExpectancy}
                          className="font-semibold text-var(--rv-primary) w-20 border px-2 py-2 rounded"
                        />
                      </div>
                      <input
                        type="range"
                        min="35"
                        max="100"
                        step="1"
                        value={isNaN(lifeExpectancy) ? 0 : lifeExpectancy}
                        onChange={handleLifeExpectancy}
                        className="customRange w-full"
                        style={{
                          "--progress":
                            (((isNaN(lifeExpectancy) ? 0 : lifeExpectancy) - 35) /
                              (100 - 35)) *
                            100 +
                            "%",
                        }}
                      />
                    </div>

                    <div className="items-center mt-5">
                      <div className="flex justify-between">
                        <span>Current Monthly Expenses (₹)</span>
                        <div>
                          <span className="font-semibold text-var(--rv-primary)">

                          </span>
                          <input
                            Max="10000000"
                            Min="0"
                            type="text"
                            placeholder="0"
                            value={currentlyMonth || ""}
                            onChange={handleCurrentMonth}
                            className="font-semibold text-var(--rv-primary) w-30 border px-2 py-2 rounded"
                          />
                        </div>
                      </div>
                      <input
                        type="range"
                        min="1000"
                        max="10000000"
                        step="1000"
                        value={isNaN(currentlyMonth) ? 0 : currentlyMonth}
                        onChange={handleCurrentMonth}
                        className="customRange w-full"
                        style={{
                          "--progress":
                            (((isNaN(currentlyMonth) ? 0 : currentlyMonth) - 1000) /
                              (10000000 - 1000)) *
                            100 +
                            "%",
                        }}
                      />
                    </div>

                    <div className="items-center mt-5">
                      <div className="flex justify-between">
                        <span>Inflation Rate (%)</span>
                        <input
                          max="30"
                          min="0"
                          type="text"
                          placeholder="0"
                          value={InflationRate}
                          onChange={handleInflationRate}
                          className="font-semibold text-[var(--rv-primary)] w-20 border px-2 py-2 rounded"
                        />
                      </div>

                      <input
                        type="range"
                        min="1"
                        max="30"
                        step="1"
                        value={isNaN(Number(InflationRate)) ? 0 : Number(InflationRate)}
                        onChange={handleInflationRate}
                        className="customRange w-full"
                        style={{
                          "--progress":
                            ((isNaN(Number(InflationRate)) ? 0 : Number(InflationRate) - 1) /
                              (30 - 1)) *
                            100 +
                            "%",
                        }}
                      />
                    </div>


                    <div className="items-center mt-5">
                      <div className="flex justify-between">
                        <span>Expected Return Pre-Retirement (%)</span>
                        <input
                          max="30"
                          min="0"
                          type="text"
                          placeholder="0"
                          value={pretrement === "" ? "" : Number(pretrement)}
                          onChange={handlePreretrement}
                          className="font-semibold text-[var(--rv-primary)] w-20 border px-2 py-2 rounded"
                        />
                      </div>

                      <input
                        type="range"
                        min="1"
                        max="30"
                        step="1"
                        value={isNaN(Number(pretrement)) ? 0 : Number(pretrement)}
                        onChange={handlePreretrement}
                        className="customRange w-full"
                        style={{
                          "--progress":
                            ((isNaN(Number(pretrement)) ? 0 : Number(pretrement) - 1) /
                              (30 - 1)) *
                            100 +
                            "%",
                        }}
                      />
                    </div>

                    <div className="items-center mt-5">
                      <div className="flex justify-between">
                        <span>Expected Return Post-Retirement (%)</span>
                        <input
                          max="30"
                          min="0"
                          type="text"
                          placeholder="0"
                          value={postretrement === "" ? "" : Number(postretrement)}
                          onChange={handlePostretrement}
                          className="font-semibold text-[var(--rv-primary)] w-20 border px-2 py-2 rounded"
                        />
                      </div>

                      <input
                        type="range"
                        min="1"
                        max="30"
                        step="1"
                        value={isNaN(Number(postretrement)) ? 0 : Number(postretrement)}
                        onChange={handlePostretrement}
                        className="customRange w-full"
                        style={{
                          "--progress":
                            ((isNaN(Number(postretrement)) ? 0 : Number(postretrement) - 1) /
                              (30 - 1)) *
                            100 +
                            "%",
                        }}
                      />
                    </div>


                    {/* Display Results */}

                    <div className="mt-5">
                      <div className="flex justify-between px-5 mb-3">
                        <p>Future Monthly Expenses</p>
                        <p className="font-bold text-lg">
                          {amountToCommaSeperated(totalMonthlyExpences)}
                        </p>
                      </div>
                      <hr className="mb-3" />
                      <div className="flex justify-between px-5 mb-3">
                        <p>Required Corpus At Retirement</p>
                        <p className="font-bold text-lg">
                          {amountToCommaSeperated(totalLumpsumCorpuss)}
                        </p>
                      </div>
                      <hr className="mb-3" />
                      <div className="flex justify-between px-5 mb-3">
                        <p>Planning Through SIP</p>
                        <p className="font-bold text-lg">{amountToCommaSeperated(totalThroughSips)}</p>
                      </div>
                      <hr className="mb-3" />
                      <div className="flex justify-between px-5 mb-3">
                        <p>Planning Through Lump Sum</p>
                        <p className="font-bold text-lg">
                          {amountToCommaSeperated(totalThroughLumpsums)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-1 space-y-5">
                <RetirementChart
                  piedata={{
                    CurrentMonthlyExpenses: Number(
                      parseFloat(currentlyMonth)?.toFixed(2)
                    ),
                    FutureMonthlyExpenses: Number(
                      totalMonthlyExpences?.toFixed(2)
                    ),
                  }}
                  title={"Future & Current Monthly Expenses Breakup"}
                  customLabels={{
                    FutureMonthlyExpenses: "Future Monthly Expenses",
                    CurrentMonthlyExpenses: "Current Monthly Expenses",
                  }}
                  className="h-full"
                />
                <RetrementBarChart
                  years={years}
                  Intrested={Intrested}
                  principalBarAmount={principalBarAmount}
                  balance={balance}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
