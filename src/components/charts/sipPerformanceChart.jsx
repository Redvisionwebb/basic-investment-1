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
export const description = "An area chart with gradient fill";

const chartConfig = {
    currentvalue: {
        label: "Current Value",
        color: "var(--rv-gray)",
    },
    amount: {
        label: "Amount",
        color: "var(--rv-primary)",
    },
};

// Function to filter data based on the given range
const filterDataByRange = (sipData) => {
    if (!sipData || !Array.isArray(sipData)) return [];
    return sipData.map((item) => ({
        date: item.navDate || new Date().toISOString(), // Use current date if navDate is not defined
        amount: item.amount || 0, // Default to 0 if amount is undefined
        currentvalue: item.currentValue || 0, // Default to 0 if currentValue is undefined
    }));
};

export function SipPerformanceChart({ piedata, startDate, endDate, title }) {
    const [chartData, setChartData] = React.useState([]);
    const [valuation, setValuation] = React.useState([]);

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

    // Effect to update chart data whenever piedata changes
    React.useEffect(() => {
        setChartData(filterDataByRange(piedata?.sipData));
        setValuation(piedata?.valuation);
    }, [piedata]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    {startDate} to {endDate} (Current Value As on {endDate})
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-60 w-full">
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date" // Use the correct key for date
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
                        <YAxis
                            domain={[getMinValue(), getMaxValue()]}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickCount={8}
                        />
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
                            <linearGradient id="fillCurrentvalue" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="0%"
                                    stopColor="var(--color-currentvalue)"
                                    stopOpacity={1}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-currentvalue)"
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
                            dataKey="currentvalue"
                            type="natural"
                            fill="url(#fillCurrentvalue)"
                            fillOpacity={0.7}
                            stroke="var(--color-currentvalue)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Trending up by {valuation?.absoluteReturns}%<TrendingUp className="h-4 w-4" />
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