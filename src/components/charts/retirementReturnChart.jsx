"use client";
import EChartsReact from "echarts-for-react";
import React, { useMemo } from "react";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const RetrementBarChart = ({
  years,
  Intrested,
  principalBarAmount,
  balance,
}) => {
  const option = useMemo(
    () => ({
      tooltip: {
        trigger: "axis",
        valueFormatter: (value) => formatCurrency(value),
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        orient: "horizontal",
        top: "top",
        left: "center",
        itemGap: 20,
        padding: [10, 10],
        type: "scroll",
        textStyle: {
          fontSize: 14,
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: years,
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            formatter: (value) => formatCurrency(value),
          },
        },
        {
          type: "value",
          axisLabel: {
            formatter: (value) => formatCurrency(value),
          },
        },
      ],
      series: [
        {
          name: "Future Monthly Expense",
          type: "line",
          smooth: true,
          yAxisIndex: 1,
          data: Intrested,
          itemStyle: { color: "#A4D035" },
        },
        {
          name: "Future Yearly  Expense",
          type: "bar",
          stack: "Ad",
          emphasis: {
            focus: "series",
          },
          data: principalBarAmount,
          itemStyle: { color: "#0e1323" },
        },
        {
          name: "Retirement Corpus Value",
          type: "line",
          smooth: true,
          yAxisIndex: 1,
          data: balance,
          itemStyle: { color: "#aaa8a4" },
        },
      ],
    }),
    [Intrested, principalBarAmount, balance, years]
  );

  return (
    <div className="col-12">
      <div
        className="w-auto mt-5 position-relative overflow-hidden bar-graph"
        id="echarts-containers"
      >
        <EChartsReact option={option}   />
      </div>
    </div>
  );
};

export default RetrementBarChart;
