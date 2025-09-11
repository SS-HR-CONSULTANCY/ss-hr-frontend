import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import Heading from "@/components/common/Heading";
import RadialChart from "@/components/chart/RadialChart";
import CommonTable from "@/components/common/CommonTable";
import GraphShimmer from "@/components/shimmer/GraphShimmer";
import DashboardStats from "@/components/dashboard/dashboardStats";
import ChartLineMultiple from "@/components/chart/ChartLineMultiple";
import DataFetchingError from "@/components/common/DataFetchingError";
import { handleExportExcel, handleExportPDF } from "@/utils/helpers/report";
import { AdminReportDataTableColumns } from "@/components/table/tableColumns/AdminTableColums";
import { reportPageTabs, statsMapForAdminUserStats, statsMapForApplications, statsMapForRevenue } from "@/utils/constants";
import { applicationConfig, radialChartConfig, reportUserDummyDataConfig, revenueDummyDataConfig } from "@/utils/chartConfig";
import { adminFetchApplicationsReportStatsData, adminFetchReportApplicationGraphData, adminFetchReportPaymentsGraphData, AdminFetchReportTableData, adminFetchReportUserGraphData, adminFetchRevenueReportStatsData, adminFetchUserReportStatsData } from "@/utils/apis/adminApi";
import { applicationDummyData, dummyAdminApplicationsReportStats, dummyAdminRevenueReportStats, dummyAdminUserReportStats, reportTableDataDummyData, reportUserDummyData, revenueDummyData, weeklyApplicationDummyData, weeklyPaymentsDummyData, weeklyUsersDummyData } from "@/utils/dummyData";
import { type AdminFetchApplicationsReportStatsDataResponse, type AdminFetchReportApplicationsGraphsDataResponse, type AdminFetchReportPaymentsGraphsDataResponse, type AdminFetchReportTableDataResponse, type AdminFetchReportUserswGraphsDataResponse, type AdminFetchRevenueReportStatsDataResponse, type AdminFetchUserReportStatsDataResponse } from "@/types/apiTypes/adminApiTypes";

const AdminReports: React.FC = () => {

    const [activeTab, setActiveTab] = useState<string>("users");
    const { reportData } = useSelector((store: RootState) => store.admin);

    const {
        data: reportGraphData,
        isLoading: isGraphLoading,
        isError: isGraphError,
        error: graphError,
    } = useQuery<
        AdminFetchReportUserswGraphsDataResponse |
        AdminFetchReportApplicationsGraphsDataResponse |
        AdminFetchReportPaymentsGraphsDataResponse
    >({
        queryKey: ['reportGraph', activeTab],
        queryFn: async () => {
            switch (activeTab) {
                case "users":
                    return await adminFetchReportUserGraphData();
                case "applications":
                    return await adminFetchReportApplicationGraphData();
                case "payments":
                    return await adminFetchReportPaymentsGraphData();
                default:
                    throw new Error("Invalid activeTab value");
            }
        },
        refetchOnWindowFocus: false,
    });

    return (
        <div className="space-y-8 text-black dark:text-white mt-4">

            {/* Tabs */}
            <div className="flex space-x-4 border-b pb-2">
                {reportPageTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-t-lg cursor-pointer ${activeTab === tab.id
                            ? "bg-gradient-to-r from-slate-300 to-slate-500 text-black font-semibold"
                            : "bg-slate-200 dark:bg-slate-700"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>


            {/* Stats */}
            {activeTab == "users" && (
                <>
                    <Heading heading="Stats" headingDescription="Detailed user stats" mainDivClassName="w-6/12" />
                    <DashboardStats<AdminFetchUserReportStatsDataResponse>
                        queryFunction={adminFetchUserReportStatsData}
                        queryKey='userReportStats'
                        statsMap={statsMapForAdminUserStats}
                        shimmerCount={5}
                        showDummyData
                        dummyData={dummyAdminUserReportStats}
                    />
                </>
            )}
            {activeTab == "applications" && (
                <>
                    <Heading heading="Stats" headingDescription="Detailed applications stats" mainDivClassName="w-6/12" />
                    <DashboardStats<AdminFetchApplicationsReportStatsDataResponse>
                        queryFunction={adminFetchApplicationsReportStatsData}
                        queryKey='applicationReportStats'
                        statsMap={statsMapForApplications}
                        shimmerCount={2}
                        showDummyData
                        dummyData={dummyAdminApplicationsReportStats}
                    />
                </>
            )}
            {activeTab == "revenue" && (
                <>
                    <Heading heading="Stats" headingDescription="Detailed payment and revenue stats" mainDivClassName="w-6/12" />
                    <DashboardStats<AdminFetchRevenueReportStatsDataResponse>
                        queryFunction={adminFetchRevenueReportStatsData}
                        queryKey='revenueReportStats'
                        statsMap={statsMapForRevenue}
                        shimmerCount={3}
                        showDummyData
                        dummyData={dummyAdminRevenueReportStats}
                    />
                </>
            )}

            {/* Graphs */}
            <Heading heading="Graphs" headingDescription="Detailed report graph data" mainDivClassName="w-6/12" />
            {isGraphLoading ? (
                <GraphShimmer count={2} />
            ) : isGraphError ? (
                <DataFetchingError message={"Failed to fetch graph data" + graphError} className="bg-gray-200 dark:bg-gray-600 rounded-md text-red-500" />
            ) : reportGraphData ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {activeTab == "users" && (
                        <>
                            <RadialChart
                                title="Weekly Distribution"
                                description={`Weekly users data`}
                                chartData={(reportGraphData as AdminFetchReportUserswGraphsDataResponse).usersRadialGragphData}
                                dataKeyOne="count"
                                dataKeyTwo="day"
                                chartConfig={radialChartConfig}
                            />
                            <ChartLineMultiple
                                title="User data graph"
                                description="Aggregated user report line graph"
                                chartData={(reportGraphData as AdminFetchReportUserswGraphsDataResponse).usersLineGraphData}
                                chartConfig={reportUserDummyDataConfig}
                                dataKeys={["totalUsers", "newUsers", "oldUsers", "jobApplicants", "packageUsedUsers"]}
                            />
                        </>
                    )}

                    {activeTab === "applications" && (
                        <>
                            <RadialChart
                                title="Weekly Distribution"
                                description={`Weekly application data`}
                                chartData={(reportGraphData as AdminFetchReportApplicationsGraphsDataResponse).applicationRadialGragphData}
                                dataKeyOne="count"
                                dataKeyTwo="day"
                                chartConfig={radialChartConfig}
                            />
                            <ChartLineMultiple
                                title="Application data graph"
                                description="Aggregated application report line chart"
                                chartData={(reportGraphData as AdminFetchReportApplicationsGraphsDataResponse).applicationsLineGraphData}
                                chartConfig={applicationConfig}
                                dataKeys={["totalApplicants", "successfulPlacements"]}
                            />
                        </>
                    )}

                    {activeTab === "revenue" && (
                        <>
                            <RadialChart
                                title="Weekly Distribution"
                                description={`Weekly payment data`}
                                chartData={(reportGraphData as AdminFetchReportPaymentsGraphsDataResponse).paymentsRadialGragphData}
                                dataKeyOne="count"
                                dataKeyTwo="day"
                                chartConfig={radialChartConfig}
                            />
                            <ChartLineMultiple
                                title="Revenue data graph"
                                description="Aggregated revenue report line chart"
                                chartData={(reportGraphData as AdminFetchReportPaymentsGraphsDataResponse).revenueLineGraphData}
                                chartConfig={revenueDummyDataConfig}
                                dataKeys={["totalRevenue", "packageRevenue", "hiringRevenue"]}
                            />
                        </>
                    )}
                </div>
            ) : (
                <DataFetchingError message={"No graph data found"} className="bg-gray-200 dark:bg-gray-600 rounded-md text-red-500" />
            )}

            {/* Graphs Dummy Data */}
            <Heading heading="Graphs" headingDescription="Detailed report graph data" mainDivClassName="w-6/12" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeTab == "users" && (
                    <>
                        <RadialChart
                            title="Weekly Distribution"
                            description={`Weekly users data`}
                            chartData={weeklyUsersDummyData}
                            dataKeyOne="count"
                            dataKeyTwo="day"
                            chartConfig={radialChartConfig}
                        />
                        <ChartLineMultiple
                            title="User data graph"
                            description="Aggregated user report line graph"
                            chartData={reportUserDummyData}
                            chartConfig={reportUserDummyDataConfig}
                            dataKeys={["totalUsers", "newUsers", "oldUsers", "jobApplicants", "packageUsedUsers"]}
                        />
                    </>
                )}

                {activeTab === "applications" && (
                    <>
                        <RadialChart
                            title="Weekly Distribution"
                            description={`Weekly application data`}
                            chartData={weeklyApplicationDummyData}
                            dataKeyOne="count"
                            dataKeyTwo="day"
                            chartConfig={radialChartConfig}
                        />
                        <ChartLineMultiple
                            title="Application data graph"
                            description="Aggregated application report line chart"
                            chartData={applicationDummyData}
                            chartConfig={applicationConfig}
                            dataKeys={["totalApplicants", "successfulPlacements"]}
                        />
                    </>
                )}

                {activeTab === "revenue" && (
                    <>
                        <RadialChart
                            title="Weekly Distribution"
                            description={`Weekly payment data`}
                            chartData={weeklyPaymentsDummyData}
                            dataKeyOne="count"
                            dataKeyTwo="day"
                            chartConfig={radialChartConfig}
                        />
                        <ChartLineMultiple
                            title="Revenue data graph"
                            description="Aggregated revenue report line chart"
                            chartData={revenueDummyData}
                            chartConfig={revenueDummyDataConfig}
                            dataKeys={["totalRevenue", "packageRevenue", "hiringRevenue"]}
                        />
                    </>
                )}
            </div>
            {/* Graph dummy data over */}


            {/* Report table and generate report */}
            <Heading heading="Reports table data" headingDescription="Detailed report table data" mainDivClassName="w-6/12" />
            <div className="p-4 border rounded-xl shadow bg-white dark:bg-[#171717]">
                <CommonTable<AdminFetchReportTableDataResponse>
                    fetchApiFunction={AdminFetchReportTableData}
                    queryKey="reportData"
                    heading="Report Data"
                    description='List of the report data aggregated from database'
                    column={AdminReportDataTableColumns}
                    columnsCount={5}
                    dummyData={reportTableDataDummyData}
                    showDummyData={true}
                    showDatePicker
                    saveDataInStore
                />
                <hr className="my-2" />
                {/* {reportData && ( */}
                    <>
                        <h2 className="font-semibold text-lg mb-4">Generate Reports</h2>
                        <div className="space-x-4">
                            <Button variant={"outline"} onClick={(e) => handleExportExcel(e, reportData!, activeTab)}>Generate PDF</Button>
                            <Button variant={"outline"} onClick={(e) => handleExportPDF(e, reportData!, activeTab)}>Generate Excel</Button>
                        </div>
                    </>
                {/* )} */}
            </div>
        </div>
    );
};

export default AdminReports;

