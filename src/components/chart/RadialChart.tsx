import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ChartHeader from "./ChartHeader";
import ChartDataNotAvailable from "./ChartDataNotAvailable";
import { LabelList, RadialBar, RadialBarChart } from "recharts";
import type {
  ChartDataItem,
  RadialChartInterface,
} from "@/types/componentTypes/chartTypes";

const RadialChart = <T extends ChartDataItem>({
  title,
  description,
  chartData,
  dataKeyOne,
  dataKeyTwo,
  chartConfig,
}: RadialChartInterface<T>) => {
  const coloredChartData = chartData.map((item) => {
    const key = item[dataKeyTwo];
    const keyString = String(key);
    const fill = chartConfig[keyString]?.color || "#8884d8";
    return {
      ...item,
      fill,
    };
  });

  return (
    <Card className="relative overflow-hidden h-full">
      <ChartHeader title={title} description={description} />
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="">
          {chartData.length === 0 ? (
            <ChartDataNotAvailable />
          ) : (
            <RadialBarChart
              data={coloredChartData}
              startAngle={-90}
              endAngle={380}
              innerRadius={30}
              outerRadius={110}
            >
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent hideLabel nameKey={String(dataKeyTwo)} />
                }
              />
              <RadialBar
                dataKey={String(dataKeyOne)}
                background
                isAnimationActive
                label
              >
                <LabelList
                  dataKey={String(dataKeyTwo)}
                  position="insideStart"
                  className="fill-white capitalize mix-blend-luminosity"
                  fontSize={11}
                />
              </RadialBar>
            </RadialBarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RadialChart;
