import React from "react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import ChartHeader from "./ChartHeader";
import { Card, CardContent } from "../ui/card";
import ChartDataNotAvailable from "./ChartDataNotAvailable";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { filterChartDataHelper } from "@/utils/helpers/chartDateFilter";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type {
  BarChartVerticalProps,
  TimeRange,
} from "@/types/componentTypes/chartTypes";

const BarChartVertical: React.FC<BarChartVerticalProps> = ({
  title,
  description,
  chartData,
  dataKeyOne,
  dataKeyTwo,
  chartConfig,
}) => {
  const [timeRange, setTimeRange] = React.useState<TimeRange>("7d");
  const filteredData = filterChartDataHelper(chartData, timeRange);

  return (
    <Card className="relative overflow-hidden">
      <ChartHeader
        title={title}
        description={description}
        onValueChange={setTimeRange}
        value={timeRange}
      />
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="min-h-[200px]">
          {chartData.length === 0 ? (
            <ChartDataNotAvailable />
          ) : (
            <BarChart accessibilityLayer data={filteredData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey={dataKeyOne}
                fill="#ffd93e"
                radius={[8, 8, 0, 0]}
                barSize={20}
                label={{ position: "top", fill: "#ffffff", fontSize: 12 }}
                animationDuration={500}
              />
              <Bar
                dataKey={dataKeyTwo}
                fill="#01487e"
                radius={[8, 8, 0, 0]}
                barSize={20}
                label={{ position: "top", fill: "#ffffff", fontSize: 12 }}
                animationDuration={700}
              />
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BarChartVertical;
