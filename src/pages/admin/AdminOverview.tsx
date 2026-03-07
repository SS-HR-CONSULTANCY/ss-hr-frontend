import React from "react";
import { useQuery } from "@tanstack/react-query";
import Heading from "@/components/common/Heading";
import GraphShimmer from "@/components/shimmer/GraphShimmer";
import { statsMapForAdminOverview } from "@/utils/constants";
import DashboardStats from "@/components/dashboard/dashboardStats";
import DataFetchingError from "@/components/common/DataFetchingError";
import type { AdminFetchOverviewStatsDataResponse } from "@/types/apiTypes/adminApiTypes";
import { paymentsGraphConfig } from "@/utils/chartConfig";
import {
  adminFetchReportPaymentsGraphData,
  adminFetchOverviewStatsData,
} from "@/utils/apis/adminApi";
import PaymentGraphChart from "@/components/chart/PaymentGraphChart";

const AdminOverview: React.FC = () => {
  const {
    data: dashboardGraphData,
    isLoading: isGraphLoading,
    isError: isGraphError,
    error: graphError,
  } = useQuery({
    queryKey: ["overviewPaymentsGraph"],
    queryFn: adminFetchReportPaymentsGraphData,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="space-y-6 text-black dark:text-white mt-4 w-full">
      <Heading
        heading="Stats"
        headingDescription="Detailed overall stats"
        mainDivClassName="w-6/12"
      />
      <DashboardStats<AdminFetchOverviewStatsDataResponse>
        queryFunction={adminFetchOverviewStatsData}
        queryKey="overviewStats"
        statsMap={statsMapForAdminOverview}
        shimmerCount={8}
      />

      <Heading
        heading="Graphs"
        headingDescription="Detailed financial data overview"
        mainDivClassName="w-6/12"
      />
      {isGraphLoading ? (
        <GraphShimmer count={1} />
      ) : isGraphError ? (
        <DataFetchingError
          message={"Failed to fetch graph data: " + graphError}
          className="bg-gray-200 dark:bg-gray-600 rounded-md text-red-500"
        />
      ) : dashboardGraphData ? (
        <div className="w-full">
          <PaymentGraphChart
            monthlyData={dashboardGraphData.monthlyData || []}
            yearlyData={dashboardGraphData.yearlyData || []}
            chartConfig={paymentsGraphConfig}
          />
        </div>
      ) : (
        <DataFetchingError
          message={"No graph data found"}
          className="bg-gray-200 dark:bg-gray-600 rounded-md text-red-500"
        />
      )}
    </div>
  );
};

export default AdminOverview;
