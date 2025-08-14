"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

// Default chart data (used if no data is provided)
const defaultChartData = [
    { month: "January", mobile: 80 },
    { month: "February", mobile: 200 },
    { month: "March", mobile: 120 },
    { month: "April", mobile: 190 },
    { month: "May", mobile: 130 },
    { month: "June", mobile: 140 },
];

const chartConfig = {
    mobile: {
        label: "Mobile",
        color: "var(--rv-gray)",
    },
};

export function BseReturnChart({ data }) {
    // Use provided data or fall back to default data
    const chartData = data && data.length > 0 ? data : defaultChartData;

    // Calculate the highest value of sensex_close (or mobile if using default data)
    const highestValue = Math.max(
        ...chartData.map((item) => item.sensex_close || item.mobile)
    );

    // Add some padding to the highest value for better visualization (e.g., 10% more)
    const maxYValue = highestValue * 1.1;

    return (
        <Card>
            <CardHeader>
                <CardTitle>BSE Data</CardTitle>
                <CardDescription>
                    Sensex Data from Inception to Present Date: A Comprehensive Overview
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-64 w-full">
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 20,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={true} />
                        <XAxis
                            dataKey={data && data.length > 0 ? "sensex_date" : "month"}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 4)}
                        />
                        <YAxis
                            dataKey={data && data.length > 0 ? "sensex_close" : "mobile"}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            domain={[0, 100000]} // Set the Y-axis domain to show the highest value
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <defs>
                            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="25%"
                                    stopColor="var(--color-mobile)"
                                    stopOpacity={1}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-mobile)"
                                    stopOpacity={0.5}
                                />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey={data && data.length > 0 ? "sensex_close" : "mobile"}
                            type="natural"
                            fill="url(#fillMobile)"
                            fillOpacity={1}
                            stroke="var(--color-mobile)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}