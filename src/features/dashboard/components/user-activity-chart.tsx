"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { date: "2025-08-15", active: 127, inactive: 48 },
  { date: "2025-08-16", active: 123, inactive: 52 },
  { date: "2025-08-17", active: 136, inactive: 42 },
  { date: "2025-08-18", active: 121, inactive: 55 },
  { date: "2025-08-19", active: 143, inactive: 38 },
  { date: "2025-08-20", active: 117, inactive: 63 },
  { date: "2025-08-21", active: 98, inactive: 74 },
  { date: "2025-08-22", active: 108, inactive: 62 },
  { date: "2025-08-23", active: 145, inactive: 39 },
  { date: "2025-08-24", active: 139, inactive: 42 },
  { date: "2025-08-25", active: 130, inactive: 50 },
  { date: "2025-08-26", active: 141, inactive: 37 },
  { date: "2025-08-27", active: 132, inactive: 46 },
  { date: "2025-08-28", active: 138, inactive: 41 },
  { date: "2025-08-29", active: 97, inactive: 73 },
  { date: "2025-08-30", active: 144, inactive: 38 },
  { date: "2025-08-31", active: 117, inactive: 63 },
  { date: "2025-09-01", active: 127, inactive: 50 },
  { date: "2025-09-02", active: 147, inactive: 41 },
  { date: "2025-09-03", active: 110, inactive: 66 },
  { date: "2025-09-04", active: 148, inactive: 38 },
  { date: "2025-09-05", active: 108, inactive: 64 },
  { date: "2025-09-06", active: 119, inactive: 65 },
  { date: "2025-09-07", active: 142, inactive: 37 },
  { date: "2025-09-08", active: 148, inactive: 42 },
  { date: "2025-09-09", active: 148, inactive: 38 },
  { date: "2025-09-10", active: 115, inactive: 60 },
  { date: "2025-09-11", active: 109, inactive: 65 },
  { date: "2025-09-12", active: 146, inactive: 42 },
  { date: "2025-09-13", active: 128, inactive: 53 },
];

const chartConfig = {
  users: {
    label: "Users",
  },
  active: {
    label: "Active Users",
    color: "var(--chart-2)",
  },
  inactive: {
    label: "Inactive Users",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function UserActivityChart() {
  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle>User Activity</CardTitle>
        <CardDescription>
          Active vs inactive users over time
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillActive" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-active)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-active)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillInactive" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-inactive)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-inactive)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="inactive"
              type="natural"
              fill="url(#fillInactive)"
              stroke="var(--color-inactive)"
              stackId="a"
            />
            <Area
              dataKey="active"
              type="natural"
              fill="url(#fillActive)"
              stroke="var(--color-active)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
