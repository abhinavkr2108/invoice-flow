"use client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface GraphProps {
  data: { date: string; amount: number }[];
}
export default function Graph({ data }: GraphProps) {
  return (
    <ChartContainer
      className="mih-h-[300px]"
      config={{
        amount: {
          label: "Amount",
          color: "hsl(var(--primary))",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Line type="monotone" dataKey="amount" stroke="var(--color-amount)" />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
