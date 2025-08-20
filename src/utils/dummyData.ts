import type { AdminFetchApplicationsReportStatsDataResponse, AdminFetchOverviewStatsDataResponse, AdminFetchRevenueReportStatsDataResponse, AdminFetchUserReportStatsDataResponse } from "@/types/apiTypes/admin";
import type { WeeklyData } from "@/types/componentTypes/areportTypes";

// Overview page
export   const overviewUserDummyData = [
        { date: "01-08-2025", newUsers: 12, oldUsers: 40 },
        { date: "02-08-2025", newUsers: 15, oldUsers: 42 },
        { date: "03-08-2025", newUsers: 9, oldUsers: 38 },
        { date: "04-08-2025", newUsers: 14, oldUsers: 41 },
        { date: "05-08-2025", newUsers: 18, oldUsers: 44 },
        { date: "06-08-2025", newUsers: 20, oldUsers: 46 },
        { date: "07-08-2025", newUsers: 11, oldUsers: 39 },
        { date: "08-08-2025", newUsers: 17, oldUsers: 45 },
        { date: "09-08-2025", newUsers: 13, oldUsers: 40 },
        { date: "10-08-2025", newUsers: 22, oldUsers: 48 },
        { date: "11-08-2025", newUsers: 10, oldUsers: 37 },
        { date: "12-08-2025", newUsers: 19, oldUsers: 43 },
        { date: "13-08-2025", newUsers: 15, oldUsers: 42 },
        { date: "14-08-2025", newUsers: 21, oldUsers: 47 },
        { date: "15-08-2025", newUsers: 16, oldUsers: 41 },
        { date: "16-08-2025", newUsers: 23, oldUsers: 49 },
        { date: "17-08-2025", newUsers: 12, oldUsers: 39 },
        { date: "18-08-2025", newUsers: 14, oldUsers: 42 },
        { date: "19-08-2025", newUsers: 20, oldUsers: 45 },
    ];

    export const overviewPaymentsDummyData = [
        { date: "01-08-2025", package: 12, hiring: 8 },
        { date: "02-08-2025", package: 15, hiring: 11 },
        { date: "03-08-2025", package: 9, hiring: 5 },
        { date: "04-08-2025", package: 18, hiring: 14 },
        { date: "05-08-2025", package: 22, hiring: 17 },
        { date: "06-08-2025", package: 14, hiring: 9 },
        { date: "07-08-2025", package: 19, hiring: 13 },
        { date: "08-08-2025", package: 25, hiring: 20 },
        { date: "09-08-2025", package: 11, hiring: 7 },
        { date: "10-08-2025", package: 16, hiring: 12 },
    ];


    // Report page
    // ✅ Dummy user Report Stats
export const dummyAdminUserReportStats: AdminFetchUserReportStatsDataResponse = {
  totalUsers: 1200,
  newUsers: 150,
  oldUsers: 1050,
  jobApplications: 320,
  packageUsedUsers: 480,
};

// ✅ Dummy Applications Report Stats
export const dummyAdminApplicationsReportStats: AdminFetchApplicationsReportStatsDataResponse = {
  totalApplications: 210,
  successfulPlacements: 75,
};

// ✅ Dummy Revenue Report Stats
export const dummyAdminRevenueReportStats: AdminFetchRevenueReportStatsDataResponse = {
  totalRevenue: 18000,
  packageRevenue: 12000,
  hiringRevenue: 6000,
};

// ✅ Dummy overview Report Stats
export const dummyAdminOverviewStats: AdminFetchOverviewStatsDataResponse = {
  totalUsers: 2450,
  totalPackages: 120,
  totalJobsAvailable: 340,
  totalCompanies: 85,
  totalPostions: 420,
  totalPayments: 1750,
  totalRevenue: 985000,
  totalApplications: 3100,
};

export const weeklyUsersDummyData: WeeklyData[] = [
  { day: "Monday", count: 120 },
  { day: "Tuesday", count: 90 },
  { day: "Wednesday", count: 100 },
  { day: "Thursday", count: 130 },
  { day: "Friday", count: 150 },
  { day: "Saturday", count: 170 },
  { day: "Sunday", count: 140 },
];

export const weeklyApplicationDummyData: WeeklyData[] = [
  { day: "Monday", count: 22 },
  { day: "Tuesday", count: 35 },
  { day: "Wednesday", count: 28 },
  { day: "Thursday", count: 31 },
  { day: "Friday", count: 44 },
  { day: "Saturday", count: 38 },
  { day: "Sunday", count: 29 },
];

export const weeklyPaymentsDummyData: WeeklyData[] = [
  { day: "Monday", count: 2000 },
  { day: "Tuesday", count: 2200 },
  { day: "Wednesday", count: 1800 },
  { day: "Thursday", count: 2500 },
  { day: "Friday", count: 3000 },
  { day: "Saturday", count: 3200 },
  { day: "Sunday", count: 2700 },
];