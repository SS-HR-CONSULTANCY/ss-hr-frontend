import React from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ChartHeader from './ChartHeader';
import ChartDataNotAvailable from './ChartDataNotAvailable';
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { filterChartDataHelper } from '@/utils/helpers/chartDateFilter';
import type { ChartConfig, TimeRange } from '@/types/componentTypes/chartTypes';

export interface ChartLineMultipleProps<T extends { date: string }> {
  title: string;
  description: string;
  chartData: T[];
  dataKeys: string[];
  chartConfig: ChartConfig;
  isLocked?: boolean;
}

export type BaseChartData = {
  date: string;
  [key: string]: number | string | undefined;
};

const ChartLineMultiple = <T extends BaseChartData>({
  title,
  description,
  chartData,
  dataKeys,
  chartConfig,
}: ChartLineMultipleProps<T>) => {

  const [timeRange, setTimeRange] = React.useState<TimeRange>("7d");
  const filteredData = filterChartDataHelper(chartData, timeRange);

  return (
    <Card className="relative overflow-hidden">
      <ChartHeader title={title} description={description} onValueChange={setTimeRange} value={timeRange} />
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="min-h-[200px]" >
          {chartData.length === 0 ? (
            <ChartDataNotAvailable />
          ) : (
            <LineChart
              accessibilityLayer
              data={filteredData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
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
  )
}

export default ChartLineMultiple;
