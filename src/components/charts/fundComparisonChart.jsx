import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const parseChartData = (chartData) => {
  const seriesData = [];

  Object.entries(chartData).forEach(([fundName, dataString]) => {
    const fundData = dataString.split("$").map((entry) => {
      const [date, value] = entry.split(",");
      return [new Date(date).getTime(), parseFloat(value)];
    });

    seriesData.push({ name: fundName, data: fundData });
  });

  return seriesData;
};

export default function FundComparisonChart({ chartData }) {
  const parsedData = useMemo(() => parseChartData(chartData), [chartData]);

  const options = {
    chart: {
      zoomType: "x", // Enable zoom on the X-axis
      panning: true, // Allow dragging when zoomed
      panKey: "shift", // Hold Shift key to pan
      resetZoomButton: {
        position: { align: "right", verticalAlign: "top", x: -10, y: 10 }, // Position of reset button
        theme: { fill: "#f7f7f7", stroke: "#ccc", r: 3 },
      },
    },
    title: { text: "Fund Graph" },
    xAxis: {
      type: "datetime",
      title: { text: "Date" },
    },
    yAxis: {
      title: { text: "Value" },
    },
    tooltip: {
      shared: true,
      xDateFormat: "%Y-%m-%d", // Format date in tooltip
    },
    legend: { enabled: true },
    series: parsedData,
  };

  return (
    <div className="chart-container">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}