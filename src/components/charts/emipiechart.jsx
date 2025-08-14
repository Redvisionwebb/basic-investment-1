"use client"

import { Pie, PieChart, Sector } from "recharts"

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

export const description = "A pie chart with a legend";

const chartConfig = {
    principal: {
        label: "Principal Amount",
        color: "hsl(var(--chart-3))",
    },
    intrest: {
        label: "Intrest Amount",
        color: "#00aeef",
    },
}

export function EmipieChart({ piedata, title, customLabels }) {
    const chartData = [
        { browser: "principal", visitors: piedata?.principalamount, fill: "var(--color-principal)" },
        { browser: "intrest", visitors: piedata?.intrestamount, fill: "var(--color-intrest)" },
    ]

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title ? title : "Data"} - Pie Chart</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                   className="mx-auto max-h-[400px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="visitors" hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="visitors"
                            labelLine={false}
                            nameKey="browser"
                            innerRadius={60}
                            strokeWidth={5}
                            activeIndex={0}
                            activeShape={({
                                outerRadius = 0,
                                ...props
                            }) => (
                                <Sector {...props} outerRadius={outerRadius + 10} />
                            )}
                        />
                        <ChartLegend
                            content={<ChartLegendContent nameKey="browser" />}
                            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}