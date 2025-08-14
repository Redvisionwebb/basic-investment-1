"use client"

import { Label, Pie, PieChart } from "recharts"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A pie chart with a legend"

const chartConfig = {
    invested: {
        label: "",
        color: "var(--rv-primary)",
    },
    return: {
        label: "",
        color: "var(--rv-gray)",
    },
}

export function SipHomeChart({ piedata, title, customLabels }) {

    const chartData = [
        { browser: "invested", visitors: piedata?.totalInvestment, fill: "var(--color-invested)" },
        { browser: "return", visitors: piedata?.futureValue, fill: "var(--color-return)" },
    ]

    // Use custom labels if provided; otherwise, fall back to the default labels.
    const labels = customLabels || {
        invested: chartConfig.invested.label,
        return: chartConfig.return.label,
    }
    return (
        <Card className="bg-transparent border-none shadow-none">
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto pb-0 "
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="visitors"
                            nameKey="browser"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
