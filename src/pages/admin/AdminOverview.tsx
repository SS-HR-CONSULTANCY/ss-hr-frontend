import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Heading from '@/components/common/Heading';
import GraphShimmer from '@/components/shimmer/GraphShimmer';
import { statsMapForAdminOverview } from '@/utils/constants';
import AreaGroupedChart from '@/components/chart/AreaGroupedChart';
import BarChartVertical from '@/components/chart/BarChartVertical';
import DashboardStats from '@/components/dashboard/dashboardStats';
import DataFetchingError from '@/components/common/DataFetchingError';
import type { AdminFetchOverviewStatsDataResponse } from "@/types/apiTypes/admin";
import { overviewPaymentsDataChartConfig, overviewUserDataChartConfig } from '@/utils/chartConfig';
import { adminFetchOverviewGrraphData, adminFetchOverviewStatsData } from '@/utils/apis/adminApi';
import { dummyAdminOverviewStats, overviewPaymentsDummyData, overviewUserDummyData } from '@/utils/dummyData';

const AdminOverview: React.FC = () => {

    const {
        data: dashboardGraphData,
        isLoading: isGraphLoading,
        isError: isGraphError,
        error: graphError,
    } = useQuery({
        queryKey: ['overviewGraph'],
        queryFn: adminFetchOverviewGrraphData,
        refetchOnWindowFocus: false,
    });

    return (
        <div className="space-y-6 text-black dark:text-white mt-4">
            <Heading heading="Stats" headingDescription="Detailed overall stats" mainDivClassName="w-6/12" />
            <DashboardStats<AdminFetchOverviewStatsDataResponse>
                queryFunction={adminFetchOverviewStatsData}
                queryKey='overviewStats'
                statsMap={statsMapForAdminOverview}
                shimmerCount={8}
                showDummyData
                dummyData={dummyAdminOverviewStats}
            />

            <Heading heading="Graphs" headingDescription="Detailed graphs data" mainDivClassName="w-6/12" />
            {isGraphLoading ? (
                <GraphShimmer count={2} />
            ) : isGraphError ? (
                <DataFetchingError message={"Failed to fetch graph data" + graphError} className="bg-gray-200 dark:bg-gray-600 rounded-md text-red-500" />
            ) : dashboardGraphData ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AreaGroupedChart
                        title="Users data graph"
                        description="New and old users comparison"
                        chartData={dashboardGraphData?.usersGragphData}
                        dataKeyOne="newUsers"
                        dataKeyTwo="oldUsers"
                        chartConfig={overviewUserDataChartConfig}
                    />

                    <BarChartVertical
                        title="Applications Chart"
                        description="Application count detail chart"
                        chartData={dashboardGraphData?.applicationsGraphData}
                        dataKeyOne="users"
                        dataKeyTwo="applications"
                        chartConfig={overviewPaymentsDataChartConfig}
                    />
                </div>
            ) : (
                <DataFetchingError message={"No graph data found"} className="bg-gray-200 dark:bg-gray-600 rounded-md text-red-500" />
            )}

            {/* graph Dummy Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AreaGroupedChart
                    title="Users data graph"
                    description="New and old users comparison"
                    chartData={overviewUserDummyData}
                    dataKeyOne="newUsers"
                    dataKeyTwo="oldUsers"
                    chartConfig={overviewUserDataChartConfig}
                />

                <BarChartVertical
                    title="Applications Chart"
                    description="Application count detail chart"
                    chartData={overviewPaymentsDummyData}
                    dataKeyOne="users"
                    dataKeyTwo="applications"
                    chartConfig={overviewPaymentsDataChartConfig}
                />
            </div>
            {/* graph Dummy Data end */}
        </div>
    )
}

export default AdminOverview;