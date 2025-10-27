import { Card, CardContent } from "@/components/ui/card";
import {
  ChartLegend,
  ChartTooltip,
  ChartContainer,
  ChartLegendContent,
  ChartTooltipContent,
} from "@/components/ui/chart";
import * as React from "react";
import ChartHeader from "./ChartHeader";
import ChartDataNotAvailable from "./ChartDataNotAvailable";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { filterChartDataHelper } from "@/utils/helpers/chartDateFilter";
import type {
  AreaGroupChartProps,
  TimeRange,
} from "@/types/componentTypes/chartTypes";

const AreaGroupedChart: React.FC<AreaGroupChartProps> = ({
  title,
  description,
  chartData,
  dataKeyOne,
  dataKeyTwo,
  chartConfig,
}) => {
  const [timeRange, setTimeRange] = React.useState<TimeRange>("7d");
  const filteredData = filterChartDataHelper(chartData ?? [], timeRange);

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
            <AreaChart data={filteredData}>
              <defs>
                {[
                  { key: dataKeyOne, id: "fillOne" },
                  { key: dataKeyTwo, id: "fillTwo" },
                ].map(({ key, id }) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={chartConfig[key]?.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartConfig[key]?.color}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
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
                dataKey={dataKeyOne}
                type="natural"
                fill="url(#fillOne)"
                stroke={chartConfig[dataKeyOne]?.color}
                stackId="a"
              />
              <Area
                dataKey={dataKeyTwo}
                type="natural"
                fill="url(#fillTwo)"
                stroke={chartConfig[dataKeyTwo]?.color}
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AreaGroupedChart;
