import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Briefcase, Activity, Clock, CheckCircle } from "lucide-react";

import DataFetchingError from "@/components/common/DataFetchingError";
import GraphShimmer from "@/components/shimmer/GraphShimmer";
import { adminFetchEnquiryAnalyticsData, adminFetchEnquiryStatusDistribution, adminFetchEnquirySummaryStats } from "@/utils/apis/adminApi";
import { adminFetchAllCategories } from "@/utils/apis/adminCategoryApi";
import { ENQUIRY_STATUS_CONFIG } from "@/utils/enquiryStatusConfig";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, PieChart, Pie, Legend, Tooltip as RechartsTooltip, LabelList } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#F4A460', '#DDA0DD'];

const AdminOverview: React.FC = () => {
  const [period, setPeriod] = useState<string>("weekly");
  const [status, setStatus] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");

  const {
    data: analyticsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["enquiryAnalytics", period, status, category],
    queryFn: () => adminFetchEnquiryAnalyticsData(period, status, category),
    refetchOnWindowFocus: false,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: adminFetchAllCategories,
  });
  const categories = categoriesData?.data ?? [];

  const {
    data: statusDistributionData,
    isLoading: isStatusLoading,
  } = useQuery({
    queryKey: ["enquiryStatusDistribution", period],
    queryFn: () => adminFetchEnquiryStatusDistribution(period),
    refetchOnWindowFocus: false,
  });

  const {
    data: summaryStatsData,
    isLoading: isSummaryStatsLoading,
  } = useQuery({
    queryKey: ["enquirySummaryStats"],
    queryFn: adminFetchEnquirySummaryStats,
    refetchOnWindowFocus: false,
  });

  const pieData = React.useMemo(() => {
    if (!statusDistributionData) return [];
    
    let pendingCount = 0;
    let completedCount = 0;
    let otherCount = 0;
    
    statusDistributionData.forEach(item => {
      if (item.status === 'pending') {
        pendingCount += item.count;
      } else if (item.status === 'completed') {
        completedCount += item.count;
      } else {
        otherCount += item.count;
      }
    });
    
    return [
      { name: 'Pending', value: pendingCount, color: '#ef4444' },
      { name: 'Completed', value: completedCount, color: '#22c55e' },
      { name: 'In Progress', value: otherCount, color: '#eab308' },
    ].filter(item => item.value > 0);
  }, [statusDistributionData]);

  const chartConfig = {
    count: {
      label: "Enquiries",
      color: "#3b82f6", // blue-500
    },
  };

  return (
    <div className="space-y-8 text-black dark:text-white mt-6 w-full pb-10">
      
      {/* Stats Cards Row */}
      {isSummaryStatsLoading ? (
        <div className="w-full">
          <GraphShimmer count={1} />
        </div>
      ) : summaryStatsData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
          <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Enquiries</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{summaryStatsData.total}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50/50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Visiting Package</CardTitle>
              <Briefcase className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">{summaryStatsData.visitingPackage}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-100 dark:border-yellow-900 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">In Progress</CardTitle>
              <Activity className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">{summaryStatsData.inProgress}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-900 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending</CardTitle>
              <Clock className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{summaryStatsData.pending}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50/50 dark:bg-green-950/20 border-green-100 dark:border-green-900 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{summaryStatsData.completed}</div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mt-2">
        <Card className="w-full lg:col-span-2">
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
              
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c: any) => (
                    <SelectItem key={c._id} value={c.name}>{c.name}</SelectItem>
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
                    <BarChart
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
                  <Bar
                    dataKey="count"
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList dataKey="count" position="top" fill="currentColor" offset={10} fontSize={12} />
                    {
                      displayData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))
                    }
                  </Bar>
                </BarChart>
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

        <Card className="w-full lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Lead Follow Up Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isStatusLoading ? (
              <div className="w-full mt-4 flex items-center justify-center min-h-[300px]">
                <p>Loading...</p>
              </div>
            ) : pieData.length > 0 ? (
              <div className="h-[300px] w-full flex items-center justify-center mt-4">
                <PieChart width={300} height={300}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number) => [`${value} Enquiries`, 'Count']}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[300px]">
                <p className="text-slate-500">No status data available.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
