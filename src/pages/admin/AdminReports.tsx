import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import RadialChart from "@/components/chart/RadialChart";
import { Users, Briefcase, Package, Landmark } from "lucide-react";
import { formatNumberToPrice } from "@/utils/helpers/priceFormater";
import BarChartVertical from "@/components/chart/BarChartVertical";

// ---------------- Types ----------------
type WeeklyData = { day: string; count: number };
type ReportData = Record<string, any[]>;

type StatItem = {
    label: string;
    value: string | number;
    change: string;
    icon: React.ReactNode;
    price?: boolean; // for revenue formatting
};

const AdminReports: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("users");
    const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
    const [statsData, setStatsData] = useState<StatItem[]>([]);

    // ---------------- Chart Config ----------------
    const topBookingDaysChartConfig: Record<string, { label: string; color: string }> = {
        Monday: { label: "Monday", color: "#6366F1" },
        Tuesday: { label: "Tuesday", color: "#10B981" },
        Wednesday: { label: "Wednesday", color: "#F59E0B" },
        Thursday: { label: "Thursday", color: "#EF4444" },
        Friday: { label: "Friday", color: "#3B82F6" },
        Saturday: { label: "Saturday", color: "#8B5CF6" },
        Sunday: { label: "Sunday", color: "#EC4899" },
    };

    // ---------------- Weekly Data ----------------
    const weeklyUsersData: WeeklyData[] = [
        { day: "Monday", count: 120 },
        { day: "Tuesday", count: 90 },
        { day: "Wednesday", count: 100 },
        { day: "Thursday", count: 130 },
        { day: "Friday", count: 150 },
        { day: "Saturday", count: 170 },
        { day: "Sunday", count: 140 },
    ];

    const weeklyPackageData: WeeklyData[] = [
        { day: "Monday", count: 40 },
        { day: "Tuesday", count: 52 },
        { day: "Wednesday", count: 33 },
        { day: "Thursday", count: 49 },
        { day: "Friday", count: 61 },
        { day: "Saturday", count: 70 },
        { day: "Sunday", count: 55 },
    ];

    const weeklyApplicationData: WeeklyData[] = [
        { day: "Monday", count: 22 },
        { day: "Tuesday", count: 35 },
        { day: "Wednesday", count: 28 },
        { day: "Thursday", count: 31 },
        { day: "Friday", count: 44 },
        { day: "Saturday", count: 38 },
        { day: "Sunday", count: 29 },
    ];

    const weeklyRevenueData: WeeklyData[] = [
        { day: "Monday", count: 2000 },
        { day: "Tuesday", count: 2200 },
        { day: "Wednesday", count: 1800 },
        { day: "Thursday", count: 2500 },
        { day: "Friday", count: 3000 },
        { day: "Saturday", count: 3200 },
        { day: "Sunday", count: 2700 },
    ];

    // ---------------- Dummy Report Data ----------------
    const reportsData: ReportData = {
        users: [
            { date: "01-08-2025", newUsers: 12, oldUsers: 7 },
            { date: "02-08-2025", newUsers: 15, oldUsers: 11 },
        ],
        packages: [
            { package: "Dubai Premium", bookings: 34 },
            { package: "Abu Dhabi City Tour", bookings: 22 },
        ],
        applications: [
            { job: "Frontend Developer", applications: 12 },
            { job: "Backend Developer", applications: 9 },
        ],
        revenue: [
            { date: "01-08-2025", packageRevenue: 2000, hiringRevenue: 1200 },
            { date: "02-08-2025", packageRevenue: 2500, hiringRevenue: 1400 },
        ],
    };

    // ---------------- Stats Data ----------------
    const statsConfig: Record<string, StatItem[]> = {
        users: [
            { label: "Total Users", value: 2470, change: "+12%", icon: <Users /> },
            { label: "New Users", value: 1340, change: "+9%", icon: <Users /> },
            { label: "Old Users", value: 1130, change: "+5%", icon: <Users /> },
            { label: "Job Applications", value: 820, change: "+15%", icon: <Briefcase /> },
        ],
        packages: [
            { label: "Total Packages", value: 60, change: "+8%", icon: <Package /> },
            { label: "Top Package Bookings", value: 34, change: "+11%", icon: <Package /> },
            { label: "Users using Packages", value: 480, change: "+14%", icon: <Users /> },
        ],
        applications: [
            { label: "Total Applications", value: 210, change: "+18%", icon: <Briefcase /> },
            { label: "Successful Placements", value: 75, change: "+6%", icon: <Briefcase /> },
        ],
        revenue: [
            { label: "Total Revenue", value: 18000, change: "+22%", icon: <Landmark />, price: true },
            { label: "Package Revenue", value: 12000, change: "+18%", icon: <Landmark />, price: true },
            { label: "Hiring Revenue", value: 6000, change: "+10%", icon: <Landmark />, price: true },
        ],
    };

    // ---------------- Report Export Logic ----------------
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(reportsData[activeTab]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        XLSX.writeFile(workbook, `${activeTab}-report.xlsx`);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text(`${activeTab.toUpperCase()} REPORT`, 10, 10);
        const rows = reportsData[activeTab];
        let y = 20;
        rows.forEach((row: any) => {
            doc.text(JSON.stringify(row), 10, y);
            y += 10;
        });
        doc.save(`${activeTab}-report.pdf`);
    };

    // ---------------- Tabs ----------------
    const tabs = [
        { id: "users", label: "User Report", weekly: weeklyUsersData },
        { id: "packages", label: "Tour Package Report", weekly: weeklyPackageData },
        { id: "applications", label: "Application Report", weekly: weeklyApplicationData },
        { id: "revenue", label: "Revenue Report", weekly: weeklyRevenueData },
    ];

    // ---------------- Handle Tab Change ----------------
    useEffect(() => {
        const tab = tabs.find((t) => t.id === activeTab);
        if (tab) {
            setWeeklyData(tab.weekly);
            setStatsData(statsConfig[tab.id]);
        }
    }, [activeTab]);

    return (
        <div className="space-y-8 text-black dark:text-white mt-4">
            {/* Tabs */}
            <div className="flex space-x-4 border-b pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-t-lg ${activeTab === tab.id
                                ? "bg-gradient-to-r from-slate-300 to-slate-500 text-black font-semibold"
                                : "bg-slate-200 dark:bg-slate-700"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Active Tab Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Radial Chart */}
                <RadialChart
                    title="Weekly Distribution"
                    description={`Weekly ${activeTab} performance`}
                    chartData={weeklyData}
                    dataKeyOne="count"
                    dataKeyTwo="day"
                    chartConfig={topBookingDaysChartConfig}
                />
                </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {/* Stats Cards */}
                {statsData.map((stat, index) => (
                    <div
                        key={index}
                        className="shadow-md rounded-xl p-6 bg-white dark:bg-[#171717]"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="rounded-lg flex items-center justify-center">
                                <span className="text-xl">{stat.icon}</span>
                            </div>
                            <span className="text-sm font-medium">{stat.change}</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">
                            {stat.price ? formatNumberToPrice(stat.value as number) : stat.value}
                        </h3>
                        <p className="text-sm">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Report Generation */}

            <div className="p-4 border rounded-xl shadow bg-white dark:bg-[#171717]">
                <h2 className="font-semibold text-lg mb-4">Reports</h2>
                <hr className="my-2" />
                <h2 className="font-semibold text-lg mb-4">Generate Reports</h2>
                <div className="space-x-4">
                    <Button onClick={exportToPDF}>Generate PDF</Button>
                    <Button onClick={exportToExcel}>Generate Excel</Button>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;

