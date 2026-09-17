import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Heading from "@/components/common/Heading";
import DataFetchingError from "@/components/common/DataFetchingError";
import GraphShimmer from "@/components/shimmer/GraphShimmer";
import { adminFetchEnquiryAnalyticsData } from "@/utils/apis/adminApi";
import { ENQUIRY_STATUS_CONFIG } from "@/utils/enquiryStatusConfig";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminOverview: React.FC = () => {
  const [period, setPeriod] = useState<string>("weekly");
  const [status, setStatus] = useState<string>("all");

  const {
    data: analyticsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["enquiryAnalytics", period, status],
    queryFn: () => adminFetchEnquiryAnalyticsData(period, status),
    refetchOnWindowFocus: false,
  });

  const chartConfig = {
    count: {
      label: "Enquiries",
      color: "#3b82f6", // blue-500
    },
  };

  return (
    <div className="space-y-8 text-black dark:text-white mt-4 w-full pb-10">
      <div className="w-full mt-2">
        <Card className="w-full">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-medium">Enquiry Trends</CardTitle>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[140px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.entries(ENQUIRY_STATUS_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="w-full mt-4">
                <GraphShimmer count={1} />
              </div>
            ) : isError ? (
              <DataFetchingError
                message={"Failed to fetch analytics data: " + (error as Error).message}
                className="bg-gray-200 dark:bg-gray-600 rounded-md text-red-500 mt-4"
              />
            ) : analyticsData && analyticsData.length > 0 ? (
              (() => {
                let displayData = [];
                const now = new Date();

                if (period === 'weekly') {
                  const dayOfWeek = now.getDay();
                  const diffToMonday = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                  
                  for (let i = 0; i < 7; i++) {
                    const d = new Date(now.getFullYear(), now.getMonth(), diffToMonday + i);
                    const dateStr = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
                    const found = analyticsData?.find(item => item.date === dateStr);
                    
                    displayData.push({
                      date: dateStr,
                      dayName: days[i],
                      count: found ? found.count : 0
                    });
                  }
                } else if (period === 'monthly') {
                  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                  for (let i = 1; i <= daysInMonth; i++) {
                    const d = new Date(now.getFullYear(), now.getMonth(), i);
                    const dateStr = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
                    const found = analyticsData?.find(item => item.date === dateStr);
                    
                    displayData.push({
                      date: dateStr,
                      dayName: i.toString(),
                      count: found ? found.count : 0
                    });
                  }
                }

                return (
                  <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full mt-4">
                    <LineChart
                      accessibilityLayer
                      data={displayData}
                  margin={{
                    left: 0,
                    right: 20,
                    top: 20,
                    bottom: 20
                  }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="dayName"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    allowDecimals={false}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="var(--color-count)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "var(--color-count)" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            );
            })()
          ) : (
              <div className="flex items-center justify-center min-h-[300px]">
                <p className="text-slate-500">No analytics data available for the selected filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
