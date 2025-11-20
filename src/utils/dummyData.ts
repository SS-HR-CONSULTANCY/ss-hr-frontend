import type { WeeklyData } from "@/types/componentTypes/areportTypes";
import type {
  AdminFetchApplicationsReportStatsDataResponse,
  AdminFetchOverviewStatsDataResponse,
  AdminFetchReportTableDataResponse,
  AdminFetchRevenueReportStatsDataResponse,
  AdminFetchUserReportStatsDataResponse,
} from "@/types/apiTypes/adminApiTypes";
import type { Testimonial } from "@/types/entities/testimonial";

// Overview page
export const overviewUserDummyData = [
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
  { date: "01-08-2025", users: 12, applications: 8 },
  { date: "02-08-2025", users: 15, applications: 11 },
  { date: "03-08-2025", users: 9, applications: 5 },
  { date: "04-08-2025", users: 18, applications: 14 },
  { date: "05-08-2025", users: 22, applications: 17 },
  { date: "06-08-2025", users: 14, applications: 9 },
  { date: "07-08-2025", users: 19, applications: 13 },
  { date: "08-08-2025", users: 25, applications: 20 },
  { date: "09-08-2025", users: 11, applications: 7 },
  { date: "10-08-2025", users: 16, applications: 12 },
];

// Report page
// ✅ Dummy user Report Stats
export const dummyAdminUserReportStats: AdminFetchUserReportStatsDataResponse =
  {
    totalUsers: 1200,
    newUsers: 150,
    oldUsers: 1050,
    jobApplications: 320,
    packageUsedUsers: 480,
  };

// ✅ Dummy Applications Report Stats
export const dummyAdminApplicationsReportStats: AdminFetchApplicationsReportStatsDataResponse =
  {
    totalApplications: 210,
    successfulPlacements: 75,
  };

// ✅ Dummy Revenue Report Stats
export const dummyAdminRevenueReportStats: AdminFetchRevenueReportStatsDataResponse =
  {
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

export const reportTableDataDummyData: AdminFetchReportTableDataResponse[] = [
  {
    date: "2025-08-01",
    jobApplications: 120,
    packagesTaken: 45,
    revenueFromJobApplications: 60000,
    revenueFromPackages: 180000,
    totalRevenue: 240000,
  },
  {
    date: "2025-08-02",
    jobApplications: 90,
    packagesTaken: 30,
    revenueFromJobApplications: 45000,
    revenueFromPackages: 120000,
    totalRevenue: 165000,
  },
  {
    date: "2025-08-03",
    jobApplications: 140,
    packagesTaken: 50,
    revenueFromJobApplications: 70000,
    revenueFromPackages: 200000,
    totalRevenue: 270000,
  },
  {
    date: "2025-08-04",
    jobApplications: 110,
    packagesTaken: 35,
    revenueFromJobApplications: 55000,
    revenueFromPackages: 140000,
    totalRevenue: 195000,
  },
  {
    date: "2025-08-05",
    jobApplications: 180,
    packagesTaken: 60,
    revenueFromJobApplications: 90000,
    revenueFromPackages: 240000,
    totalRevenue: 330000,
  },
  {
    date: "2025-08-06",
    jobApplications: 95,
    packagesTaken: 25,
    revenueFromJobApplications: 47500,
    revenueFromPackages: 100000,
    totalRevenue: 147500,
  },
  {
    date: "2025-08-07",
    jobApplications: 130,
    packagesTaken: 55,
    revenueFromJobApplications: 65000,
    revenueFromPackages: 220000,
    totalRevenue: 285000,
  },
  {
    date: "2025-08-08",
    jobApplications: 160,
    packagesTaken: 70,
    revenueFromJobApplications: 80000,
    revenueFromPackages: 280000,
    totalRevenue: 360000,
  },
  {
    date: "2025-08-09",
    jobApplications: 100,
    packagesTaken: 40,
    revenueFromJobApplications: 50000,
    revenueFromPackages: 160000,
    totalRevenue: 210000,
  },
  {
    date: "2025-08-10",
    jobApplications: 150,
    packagesTaken: 65,
    revenueFromJobApplications: 75000,
    revenueFromPackages: 260000,
    totalRevenue: 335000,
  },
];

export const revenueDummyData = [
  {
    date: "01-08-2025",
    totalRevenue: 12000,
    packageRevenue: 8000,
    hiringRevenue: 4000,
  },
  {
    date: "02-08-2025",
    totalRevenue: 15000,
    packageRevenue: 9500,
    hiringRevenue: 5500,
  },
  {
    date: "03-08-2025",
    totalRevenue: 11000,
    packageRevenue: 7000,
    hiringRevenue: 4000,
  },
  {
    date: "04-08-2025",
    totalRevenue: 17000,
    packageRevenue: 11000,
    hiringRevenue: 6000,
  },
  {
    date: "05-08-2025",
    totalRevenue: 14000,
    packageRevenue: 9000,
    hiringRevenue: 5000,
  },
  {
    date: "06-08-2025",
    totalRevenue: 18000,
    packageRevenue: 12000,
    hiringRevenue: 6000,
  },
  {
    date: "07-08-2025",
    totalRevenue: 16000,
    packageRevenue: 10000,
    hiringRevenue: 6000,
  },
  {
    date: "08-08-2025",
    totalRevenue: 20000,
    packageRevenue: 13000,
    hiringRevenue: 7000,
  },
  {
    date: "09-08-2025",
    totalRevenue: 19000,
    packageRevenue: 12500,
    hiringRevenue: 6500,
  },
  {
    date: "10-08-2025",
    totalRevenue: 22000,
    packageRevenue: 14000,
    hiringRevenue: 8000,
  },
];

export const applicationDummyData = [
  { date: "10-08-2025", totalApplicants: 120, successfulPlacements: 30 },
  { date: "11-08-2025", totalApplicants: 140, successfulPlacements: 40 },
  { date: "12-08-2025", totalApplicants: 135, successfulPlacements: 38 },
  { date: "13-08-2025", totalApplicants: 150, successfulPlacements: 45 },
  { date: "14-08-2025", totalApplicants: 160, successfulPlacements: 50 },
  { date: "15-08-2025", totalApplicants: 170, successfulPlacements: 55 },
  { date: "16-08-2025", totalApplicants: 165, successfulPlacements: 52 },
  { date: "17-08-2025", totalApplicants: 180, successfulPlacements: 60 },
  { date: "18-08-2025", totalApplicants: 190, successfulPlacements: 62 },
  { date: "19-08-2025", totalApplicants: 200, successfulPlacements: 70 },
];

// Report user dummy data
export const reportUserDummyData = [
  {
    date: "01-08-2025",
    totalUsers: 597,
    oldUsers: 266,
    newUsers: 331,
    jobApplicants: 239,
    packageUsedUsers: 141,
  },
  {
    date: "02-08-2025",
    totalUsers: 738,
    oldUsers: 446,
    newUsers: 292,
    jobApplicants: 112,
    packageUsedUsers: 126,
  },
  {
    date: "03-08-2025",
    totalUsers: 591,
    oldUsers: 445,
    newUsers: 146,
    jobApplicants: 299,
    packageUsedUsers: 52,
  },
  {
    date: "04-08-2025",
    totalUsers: 586,
    oldUsers: 436,
    newUsers: 150,
    jobApplicants: 269,
    packageUsedUsers: 105,
  },
  {
    date: "05-08-2025",
    totalUsers: 622,
    oldUsers: 452,
    newUsers: 170,
    jobApplicants: 152,
    packageUsedUsers: 25,
  },
  {
    date: "06-08-2025",
    totalUsers: 781,
    oldUsers: 512,
    newUsers: 269,
    jobApplicants: 199,
    packageUsedUsers: 175,
  },
  {
    date: "07-08-2025",
    totalUsers: 829,
    oldUsers: 488,
    newUsers: 341,
    jobApplicants: 173,
    packageUsedUsers: 87,
  },
  {
    date: "08-08-2025",
    totalUsers: 754,
    oldUsers: 389,
    newUsers: 365,
    jobApplicants: 221,
    packageUsedUsers: 142,
  },
  {
    date: "09-08-2025",
    totalUsers: 623,
    oldUsers: 355,
    newUsers: 268,
    jobApplicants: 283,
    packageUsedUsers: 67,
  },
  {
    date: "10-08-2025",
    totalUsers: 695,
    oldUsers: 400,
    newUsers: 295,
    jobApplicants: 142,
    packageUsedUsers: 132,
  },
  {
    date: "11-08-2025",
    totalUsers: 842,
    oldUsers: 576,
    newUsers: 266,
    jobApplicants: 214,
    packageUsedUsers: 151,
  },
  {
    date: "12-08-2025",
    totalUsers: 715,
    oldUsers: 419,
    newUsers: 296,
    jobApplicants: 187,
    packageUsedUsers: 124,
  },
  {
    date: "13-08-2025",
    totalUsers: 605,
    oldUsers: 310,
    newUsers: 295,
    jobApplicants: 198,
    packageUsedUsers: 91,
  },
  {
    date: "14-08-2025",
    totalUsers: 774,
    oldUsers: 432,
    newUsers: 342,
    jobApplicants: 168,
    packageUsedUsers: 139,
  },
  {
    date: "15-08-2025",
    totalUsers: 692,
    oldUsers: 401,
    newUsers: 291,
    jobApplicants: 207,
    packageUsedUsers: 112,
  },
];

// Reviews compoenent constats
export const dummyTestimonials: Testimonial[] = [
  {
    _id: "1",
    clientName: "Charles Dickens",
    clientPhoto: "/images/charles-dickens.jpg", // placeholder image
    designation: "Author - A Tale of Two Cities",
    testimonial:
      "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
    isVisible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    clientName: "William Shakespeare",
    clientPhoto: "/images/shakespeare.jpg",
    designation: "Playwright - Hamlet",
    testimonial:
      "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
    isVisible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    clientName: "Edgar Allan Poe",
    clientPhoto: "/images/poe.jpg",
    designation: "Poet - A Dream Within a Dream",
    testimonial: "All that we see or seem is but a dream within a dream.",
    isVisible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "4",
    clientName: "Jane Austen",
    clientPhoto: "/images/jane-austen.jpg",
    designation: "Author - Pride and Prejudice",
    testimonial:
      "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    isVisible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "5",
    clientName: "Herman Melville",
    clientPhoto: "/images/melville.jpg",
    designation: "Author - Moby-Dick",
    testimonial:
      "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
    isVisible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
