import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import type { ChartConfig } from "@/types/componentTypes/chartTypes";
import ChartDataNotAvailable from "./ChartDataNotAvailable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export interface PaymentGraphChartProps {
  monthlyData: Array<{ name: string; expense: number; invoice: number; receipt: number }>;
  yearlyData: Array<{ name: string; expense: number; invoice: number; receipt: number }>;
  chartConfig: ChartConfig;
}

const PaymentGraphChart: React.FC<PaymentGraphChartProps> = ({
  monthlyData,
  yearlyData,
  chartConfig,
}) => {
  const [viewMode, setViewMode] = useState<"monthly" | "yearly">("monthly");
  const chartData = viewMode === "monthly" ? monthlyData : yearlyData;
  const dataKeys = ["expense", "invoice", "receipt"];

  return (
    <Card className="relative overflow-hidden w-full">
      <div className="flex flex-col md:flex-row items-center justify-between p-4 sm:px-6 sm:py-5 border-b gap-4">
        <div>
          <h2 className="text-lg font-semibold leading-none tracking-tight">Payments Chart</h2>
          <p className="text-sm text-muted-foreground mt-1">Expenses, invoices, and receipts</p>
        </div>
        <div>
          <Select value={viewMode} onValueChange={(v: "monthly" | "yearly") => setViewMode(v)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full max-h-[400px]">
          {!chartData || chartData.length === 0 ? (
            <ChartDataNotAvailable />
          ) : (
            <LineChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={10}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

              {dataKeys.map((key) => (
                <Line
                  key={key}
                  dataKey={key}
                  type="monotone"
                  stroke={chartConfig[key]?.color ?? "#888"}
                  strokeWidth={2}
                  dot={false}
                />
              ))}

              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PaymentGraphChart;
