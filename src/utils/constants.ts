import wevDev from '../assets/servicesImages/webDevService.jpg';
import type { Route, statsMapIntrface } from '@/types/commonTypes';
import visaService from '../assets/servicesImages/visaService.png';
import cvWriting from '../assets/servicesImages/cvWritingService.jpg';
import type { ContactItem } from '@/types/componentTypes/contactTypes';
import travelService from '../assets/servicesImages/travelService.jpg';
import ticketService from '../assets/servicesImages/ticketService.png';
import type { PackageProps } from '@/types/componentTypes/packageTypes';
import type { ContentCardProps } from '@/types/componentTypes/servicesTypes';
import jobRecruitment from '../assets/servicesImages/jobRecruitmentService.png';
import type { CallToActionProps } from '@/types/componentTypes/callToActionTypes';
import type { dataSelectListItemInterface } from '@/types/componentTypes/chartTypes';
import medicalRecruitment from '../assets/servicesImages/medicalRecruitmentService.jpg';
import type { navLinkProps, SiteUrlConfigProps } from '@/types/componentTypes/headerTypes';
import certificateAttestationService from '../assets/servicesImages/certificateAttestationService.png';
import { Briefcase, Building2, ClipboardList, CreditCard, FileText, Landmark, Mail, MapPin, Package, Phone, Users } from 'lucide-react';
import type { AdminFetchApplicationsReportStatsDataResponse, AdminFetchOverviewStatsDataResponse, AdminFetchRevenueReportStatsDataResponse, AdminFetchUserReportStatsDataResponse } from '@/types/apiTypes/admin';

export const companyName = "ShahaalamGroups";

// Header compoenent constants
export const siteUrlConfig: SiteUrlConfigProps = {
  home: '/',
  aboutus: "/#aboutus",
  travelpackages: "/toursandtravels",
  reviews: "/#reviews",
  contact: "/contact",
  services: '/#services',
  signIn: "/login",
  signUp: "/register"
};

export const navLinks: navLinkProps[] = [
  { text: "Home", href: siteUrlConfig.home, content: "default", isLink: true, isForDesk: true, isForMob: true },
  { text: "About Us", href: siteUrlConfig.aboutus, isLink: true, isForDesk: true, isForMob: true },
  { text: "Services", href: siteUrlConfig.services, content: "components", isForDesk: true },
  { text: "Services", href: siteUrlConfig.services, isForMob: true },
  { text: "Tours & Travels", href: siteUrlConfig.travelpackages, isLink: true, isForDesk: true, isForMob: true },
  { text: "Reviews", href: siteUrlConfig.reviews, isLink: true, isForDesk: true, isForMob: true },
  { text: "Contact", href: siteUrlConfig.contact, isLink: true, isForDesk: true, isForMob: true },
  { text: "SignIn", href: siteUrlConfig.signIn, isLink: true, isForMob: true },
  { text: "SignUp", href: siteUrlConfig.signUp, isLink: true, isForMob: true },
];

// Services component constants
export const services: ContentCardProps[] = [
  {
    title: "Tours & Travels",
    description: "Comprehensive travel planning and support for your international needs.",
    hoverDescription: "Our comprehensive travel services cover everything from flight bookings and hotel arrangements to itinerary planning and travel insurance. We ensure a smooth and stress-free journey by handling all the essential details, so you can focus on enjoying your trip. Benefit: End-to-end travel support for a seamless experience.",
    imageUrl: travelService,
    href: "#services",
  },
  {
    title: "Visa Service",
    description: "Fast, reliable visa processing with complete documentation support.",
    hoverDescription: "Our specialized team efficiently processes various visa types, ensuring minimal hassle and fast turnaround times. We handle all the necessary documentation and communication with immigration authorities. Benefit: Quick and efficient visa processing.",
    imageUrl: visaService,
    href: "#services"
  },
  {
    title: "Ticket Service",
    description: "Affordable and hassle-free flight ticket booking for your journeys.",
    hoverDescription: "Secure your flights and other transportation with our simple and convenient booking service. We compare prices and options from multiple providers to find the best deals, saving you time and money. Relax and let us handle the details.",
    imageUrl: ticketService,
    href: "#services"
  },
  {
    title: "Certificate Attestation",
    description: "Hassle-free document attestation for smooth international processing.",
    hoverDescription: "We provide expert certificate attestation services for a wide range of documents and destinations worldwide. Our experienced team is familiar with the specific requirements of various embassies and consulates, ensuring a smooth and successful attestation process.",
    imageUrl: certificateAttestationService,
    href: "#services"
  },
  {
    title: "Medical Recruitment",
    description: "Specialized hiring solutions for healthcare professionals across the globe.",
    hoverDescription: "We specialize in placing highly skilled medical professionals in rewarding positions within reputable healthcare facilities. Our rigorous screening process ensures we connect the right candidates with the right roles, benefiting both employers and employees.",
    imageUrl: medicalRecruitment,
    href: "#services"
  },
  {
    title: "Job Recruitment",
    description: "Helping professionals find rewarding career opportunities across industries.",
    hoverDescription: "We connect highly skilled professionals with rewarding career opportunities in Dubai's thriving job market. Our personalized approach and extensive network guarantee increased chances of securing your ideal role.",
    imageUrl: jobRecruitment,
    href: "#services"
  },
  {
  title: "CV Writing",
  description: "Crafting impactful CVs that highlight your strengths and career achievements.",
  hoverDescription: "Our expert CV writing service ensures your resume stands out to recruiters. We tailor each CV to showcase your skills, experience, and accomplishments in a way that maximizes your chances of landing interviews and advancing your career.",
  imageUrl: cvWriting,
  href: "#services"
},
{
  title: "Web Development",
  description: "Building modern, responsive, and scalable websites tailored to your needs.",
  hoverDescription: "Our web development service helps businesses establish a strong online presence. From sleek portfolio sites to dynamic web applications, we deliver custom solutions that are fast, user-friendly, and optimized for performance and growth.",
  imageUrl: wevDev,
  href: "#services"
}
];


// About component constants
export const words: string = "Established in 2021, SS Human Resource Consultancy & Tours & Travels has quickly become a leader in providing comprehensive HR and travel solutions. Our experienced team boasts extensive knowledge of the Dubai job market and travel industry. We pride ourselves on delivering personalized service and exceeding client expectations, making us your trusted partner for both career advancement and memorable travel experiences."


// Package compoenent constants
export const packages: PackageProps[] = [
  {
    id: 1,
    name: "Dubai Starter Pack (Men)",
    description: "A complete all-in-one package tailored for men, offering comfort, convenience, and hassle-free living during your 2-month stay in Dubai.",
    features: [
      "2 Months Visit Visa",
      "2 Months Accommodation",
      "2 Months Food (Served Twice a Day)",
      "Airport Pickup (Dubai Only)",
      "Metro & Bus Card",
      "Free Wi-Fi",
      "Free Water",
    ],
    price: 100000,
    popular: true,
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: {
      title: "House in the woods",
      description: "A serene and tranquil retreat, this house in the woods offers a peaceful escape from the hustle and bustle of city life."
    }
    ,
  },
  {
    id: 2,
    name: "Dubai Starter Pack (Women)",
    description:
      "Designed exclusively for women, this package ensures a safe, comfortable, and worry-free experience while enjoying your 2-month stay in Dubai.",
    features: [
      "2 Months Visit Visa",
      "2 Months Accommodation",
      "2 Months Food (Served Twice a Day)",
      "Airport Pickup (Dubai Only)",
      "Metro & Bus Card",
      "Free Wi-Fi",
      "Free Water",
    ],
    price: 100000,
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1464457312035-3d7d0e0c058e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: {
      title: "House above the clouds",
      description: "Perched high above the world, this house offers breathtaking views and a unique living experience. It’s a place where the sky meets home, and tranquility is a way of life."
    }
  },
  {
    id: 3,
    name: "Premium Explorer Pack",
    description:
      "For those who want a little more luxury, this package combines travel essentials with premium comfort and added benefits for a smooth Dubai experience.",
    features: [
      "3 Months Visit Visa",
      "3 Months Premium Accommodation",
      "Daily Meals (Breakfast, Lunch, Dinner)",
      "Airport Pickup & Drop",
      "Metro & Bus Card + Taxi Credits",
      "Free Wi-Fi",
      "Laundry Services",
    ],
    price: 150000,
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: {
      title: "Greens all over",
      description: "A house surrounded by greenery and nature’s beauty. It’s the perfect place to relax, unwind, and enjoy life."
    }
  },
  {
    id: 4,
    name: "Luxury Elite Pack",
    description:
      "The ultimate all-inclusive package with premium living, unlimited convenience, and exclusive services for a stress-free and luxurious Dubai stay.",
    features: [
      "6 Months Visit Visa",
      "Luxury Hotel Accommodation",
      "All Meals & Beverages",
      "Private Airport Pickup & Drop",
      "Chauffeur Service",
      "Free Wi-Fi & Premium Support",
      "Wellness & Fitness Membership",
    ],
    price: 300000,
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1475070929565-c985b496cb9f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: {
      title: "Rivers are serene",
      description: "A house by the river is a place of peace and tranquility. It’s the perfect place to relax, unwind, and enjoy life."
    },
  },
];


// Footer compoenent constants
export const footerData = [
  {
    title: "Quick Links",
    links: [
      { text: "Home", href: "/" },
      { text: "About Us", href: "#aboutus" },
      { text: "Services", href: "#services" },
      { text: "Packages", href: "#packages" },
      { text: "Reviews", href: "#reviews" },
      { text: "Contact", href: "#contact" },
    ]
  },
  {
    title: "Contact",
    links: [
      { text: "Instagram", href: "" },
      { text: "Facebook", href: "" },
      { text: "X", href: "" },
      { text: "Phone IN - +91 971543274799", href: "tel:+91 971543274799" },
      { text: "Phone UAE - +97 0523664492", href: "tel:+970523664492" },
      { text: "Email - aalamconsultancy0@gmail.com", href: "mailto:aalamconsultancy0@gmail.com" },
    ],
  },
]

export const footerPoliciesData = [
  { text: "Privacy Policy", href: "" },
  { text: "Terms of Service", href: "" },
]

export const footerCopyright = "© 2025 shahaalamGroups.com All rights reserved";
export const footerAddress = "Al Qiyadah Metro Station Exit2, Old Labour Office Al Kazim Building Entrance B, Dubai, UAE"


// Reviews compoenent constats
export const reviews = [
  {
    quote:
      "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
    name: "Charles Dickens",
    title: "A Tale of Two Cities",
  },
  {
    quote:
      "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
    name: "William Shakespeare",
    title: "Hamlet",
  },
  {
    quote: "All that we see or seem is but a dream within a dream.",
    name: "Edgar Allan Poe",
    title: "A Dream Within a Dream",
  },
  {
    quote:
      "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    name: "Jane Austen",
    title: "Pride and Prejudice",
  },
  {
    quote:
      "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
    name: "Herman Melville",
    title: "Moby-Dick",
  },
];


// Contact component constants
export const contactData: ContactItem[] = [
  {
    icon: Phone,
    label: "Phone (IN)",
    value: "+91 97154 3274799",
    href: "tel:+91971543274799",
  },
  {
    icon: Phone,
    label: "Phone (UAE)",
    value: "+97 0523664492",
    href: "tel:0523664492",
  },
  {
    icon: Mail,
    label: "Email",
    value: "aalamconsultancy0@gmail.com",
    href: "mailto:aalamconsultancy0@gmail.com",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "Dubai & India",
  },
];
export const businessHours = "Mon–Sat, 9:30 AM – 6:30 PM";


// CallToAction compoenent constats
export const callToActionData: CallToActionProps = {
  title: "Ready to get started?",
  description: "From seamless travel arrangements to visa support, job opportunities, and medical recruitment we provide everything you need for a successful international experience. Let us handle the details so you can focus on your future.",
  buttons: [
    { href: "/register", text: "Get Started", variant: "default" },
    { href: "/travel-packages", text: "Travel Packages", variant: "outline" },
  ],
}


// Routes
export const applicationRoutes: Route[] = [
  { path: "profile", name: "Profile", roles: ["user"] },
  { path: "overview", name: "Overview", roles: ["admin", "superAdmin"] },
  { path: "users", name: "Users", roles: ["admin", "superAdmin"] },
  { path: "companies", name: "Companies", roles: ["admin", "superAdmin"] },
  { path: "jobs", name: "Jobs", roles: ["admin", "superAdmin", "admin", "user"] },
  { path: "packages", name: "Packages", roles: ["admin", "superAdmin", "user"] },
  { path: "applications", name: "Applications", roles: ["admin", "superAdmin", "user"] },
  { path: "chat", name: "Chat", roles: ["superAdmin", "user"] },
  { path: "payments", name: "Payments", roles: ["admin", "superAdmin", "user"] },
  { path: "reviews", name: "Reviews", roles: ["admin", "superAdmin"] },
  { path: "reports", name: "Reports", roles: ["admin", "superAdmin"] },
  { path: "settings", name: "Settings", roles: ["admin", "superAdmin"] },
];


// Chat component shimmer constants
export const shimmerMessages: { align: string, height: string, width: string }[] = [
  { align: "end", height: "h-10", width: "w-64" },
  { align: "start", height: "h-24", width: "w-60" },
  { align: "end", height: "h-36", width: "w-72" },
  { align: "start", height: "h-12", width: "w-44" },
  { align: "end", height: "h-14", width: "w-56" },
  { align: "start", height: "h-10", width: "w-60" },
  { align: "end", height: "h-28", width: "w-64" },
  { align: "start", height: "h-32", width: "w-72" },
  { align: "end", height: "h-24", width: "w-56" },
];


// Chart Date Data
export const dateSelectList: dataSelectListItemInterface[] = [
  { value: "7d", content: "Last 7 days" },
  { value: "14d", content: "Last 14 days" },
  { value: "30d", content: "Last month" },
  { value: "60d", content: "Last 2 months" },
  { value: "90d", content: "Last 3 months" },
  { value: "180d", content: "Last 6 months" },
  { value: "365d", content: "Last year" },
]


// report page tabs
export const reportPageTabs = [
  {
    id: "users",
    label: "User Report",
    // weekly: weeklyUsersData,
  },
  {
    id: "applications",
    label: "Application Report",
    // weekly: weeklyApplicationData,
  },
  {
    id: "revenue",
    label: "Revenue Report",
    // weekly: weeklyRevenueData,
  },
];




//  stats card data \\
// ✅ Admin users Stats Map
export const statsMapForAdminUserStats: Array<statsMapIntrface<AdminFetchUserReportStatsDataResponse>> = [
  {
    title: "Total Users",
    key: "totalUsers",
    icon: Users,
  },
  {
    title: "New Users",
    key: "newUsers",
    icon: Users,
  },
  {
    title: "Old Users",
    key: "oldUsers",
    icon: Users,
  },
  {
    title: "Job Applications",
    key: "jobApplications",
    icon: Briefcase,
  },
  {
    title: "Package Used Users",
    key: "packageUsedUsers",
    icon: Package,
  },
]

// ✅ Admin Applications Stats Map
export const statsMapForApplications: Array<statsMapIntrface<AdminFetchApplicationsReportStatsDataResponse>> = [
  {
    title: "Total Applications",
    key: "totalApplications",
    icon: Briefcase,
  },
  {
    title: "Successful Placements",
    key: "successfulPlacements",
    icon: Briefcase,
  },
];

// ✅ Admin Revenue Stats Map
export const statsMapForRevenue: Array<statsMapIntrface<AdminFetchRevenueReportStatsDataResponse>> = [
  {
    title: "Total Revenue",
    key: "totalRevenue",
    icon: Landmark,
    price: true,
  },
  {
    title: "Package Revenue",
    key: "packageRevenue",
    icon: Landmark,
    price: true,
  },
  {
    title: "Hiring Revenue",
    key: "hiringRevenue",
    icon: Landmark,
    price: true,
  },
];

export const statsMapForAdminOverview: Array<statsMapIntrface<AdminFetchOverviewStatsDataResponse>> = [
  {
    title: "Total Users",
    key: "totalUsers",
    icon: Users,
  },
  {
    title: "Total Packages",
    key: "totalPackages",
    icon: Package,
  },
  {
    title: "Jobs Available",
    key: "totalJobsAvailable",
    icon: Briefcase,
  },
  {
    title: "Companies",
    key: "totalCompanies",
    icon: Building2,
  },
  {
    title: "Total Positions",
    key: "totalPostions",
    icon: ClipboardList,
  },
  {
    title: "Payments",
    key: "totalPayments",
    icon: CreditCard,
  },
  {
    title: "Total Revenue",
    key: "totalRevenue",
    icon: Landmark,
    price: true,
  },
  {
    title: "Applications",
    key: "totalApplications",
    icon: FileText,
  },
];

