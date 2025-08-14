"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import React from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An area chart with gradient fill for scheme and Sensex data";

const chartConfig = {
    amount: {
        label: "Scheme Amount",
        color: "var(--rv-gray)", // Primary color for scheme data
    },
    sensexAmount: {
        label: "Sensex Amount",
        color: "var(--rv-primary)", // Different color for Sensex data
    },
};

const filterDataByRange = (sipData, sensexData) => {
    if (!sipData || !Array.isArray(sipData)) return [];
    const filteredData = sipData.map((item, index) => {
        const dataPoint = {
            date: item.date || new Date().toISOString(),
            amount: item.currentValue || 0,
        };
        if (sensexData && Array.isArray(sensexData) && sensexData[index]) {
            dataPoint.sensexAmount = sensexData[index].currentValue || 0;
        }
        return dataPoint;
    });
    return filteredData;
};

export function SchemePerformanceChart({ data, startDate, endDate, title }) {
    const [chartData, setChartData] = React.useState([]);
    const [valuation, setValuation] = React.useState({});

    const getMinValue = () => {
        const values = chartData
            .flatMap((item) => [item.amount, item.sensexAmount])
            .filter((v) => v !== undefined && !isNaN(v) && v !== null);
        return values.length > 0 ? Math.min(...values) * 0.95 : 0;
    };

    const getMaxValue = () => {
        const values = chartData
            .flatMap((item) => [item.amount, item.sensexAmount])
            .filter((v) => v !== undefined && !isNaN(v) && v !== null);
        return values.length > 0 ? Math.max(...values) * 1.05 : 100;
    };

    React.useEffect(() => {
        if (data && data.graphData) {
            const filteredData = filterDataByRange(data.graphData, data.sensexGraphData);
            setChartData(filteredData);
            setValuation(data);
        }
    }, [data]);

    const hasValidData = chartData.length > 0 && chartData.some((item) => item.amount > 0);

    if (!hasValidData) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>No data available</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    {startDate} to {endDate} (Current Value As on {endDate})
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-80 w-full">
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ top: 10, right: 0, left: -10, bottom: 0 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) =>
                                new Date(value).toLocaleDateString("en-US", {
                                    month: "short",
                                    year: "numeric",
                                })
                            }
                        />
                        {/* <YAxis
                            domain={[getMinValue(), getMaxValue()]}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={2}
                            tick={{ fill: "#D1D5DB" }}
                            tickFormatter={(value) => Math.round(value).toLocaleString()}
                        /> */}
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <defs>
                            <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-amount)"
                                    stopOpacity={1}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-amount)"
                                    stopOpacity={0.6}
                                />
                            </linearGradient>
                            <linearGradient id="fillSensexAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-sensexAmount)"
                                    stopOpacity={1}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-sensexAmount)"
                                    stopOpacity={0.6}
                                />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="amount"
                            type="natural"
                            fill="url(#fillAmount)"
                            fillOpacity={0.7}
                            stroke="var(--color-amount)"
                            stackId="a"
                        />
                        <Area
                            dataKey="sensexAmount"
                            type="natural"
                            fill="url(#fillSensexAmount)"
                            fillOpacity={0.7}
                            stroke="var(--color-sensexAmount)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Trending up by {valuation?.absoluteReturns || 0}%<TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            {startDate} to {endDate}
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}