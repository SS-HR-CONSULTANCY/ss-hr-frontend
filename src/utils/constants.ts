import md1 from '../assets/aboutImages/md1.jpg';
import md2 from '../assets/aboutImages/md2.jpg';
import webDev from '../assets/svgs/serviceSvg/webDev.svg';
import visaService from '../assets/svgs/serviceSvg/visa.svg';
import cvWriting from '../assets/svgs/serviceSvg/cvWriting.svg';
import ticketService from '../assets/svgs/serviceSvg/ticket.svg';
import jobRecruitment from '../assets/svgs/serviceSvg/hiring.svg';
import type { Route, statsMapIntrface } from '@/types/commonTypes';
import webDevBanner from '../assets/serviceBanners/webDevBanner.jpg';
import type { mdDataProps } from '@/types/componentTypes/aboutTypes';
import labourSupply from '../assets/svgs/serviceSvg/labourSupply.svg';
import type { ContactItem } from '@/types/componentTypes/contactTypes';
import medicalRecruitment from '../assets/svgs/serviceSvg/medical.svg';
import type { PackageProps } from '@/types/componentTypes/packageTypes';
import type { ServiceProps } from '@/types/componentTypes/servicesTypes';
import cvWritingBanner from '../assets/serviceBanners/cvWritingBanner.jpg';
import toursAndTravels from '../assets/svgs/serviceSvg/toursAndTravels.svg';
import medicalRecBanner from '../assets/serviceBanners/medicalRecBanner.jpg';
import certificateBanner from '../assets/serviceBanners/certificateBanner.jpg';
import visaServiceBanner from '../assets/serviceBanners/visaServiceBanner.jpg';
import labourSupplyBanner from '../assets/serviceBanners/labourSupplyBanner.jpg';
import type { CallToActionProps } from '@/types/componentTypes/callToActionTypes';
import ticketServiceBanner from '../assets/serviceBanners/ticketServiceBanner.jpg';
import type { ImageGridDataProps } from '@/types/componentTypes/imageGridDataTypes';
import type { dataSelectListItemInterface } from '@/types/componentTypes/chartTypes';
import certificateAttestationService from '../assets/svgs/serviceSvg/certificate.svg';
import type { navLinkProps, SiteUrlConfigProps } from '@/types/componentTypes/headerTypes';
import { Briefcase, Building2, ClipboardList, FileText, Landmark, Mail, MapPin, Package, Phone, Users } from 'lucide-react';
import type { AdminFetchApplicationsReportStatsDataResponse, AdminFetchOverviewStatsDataResponse, AdminFetchRevenueReportStatsDataResponse, AdminFetchUserReportStatsDataResponse } from '@/types/apiTypes/adminApiTypes';


export const companyName = "ShahaalamGroups";

// Header compoenent constants
export const siteUrlConfig: SiteUrlConfigProps = {
  home: '/',
  aboutus: "/aboutUs",
  travelpackages: "/toursandtravels",
  webdevelopment: "/webdevelopment",
  contact: "/contact",
  services: '#services',
  signIn: "/login",
  signUp: "/register"
};

export const links: { url: string, text: string }[] = [
  { url: '/user', text: "Dashboard" },
  { url: '/user/profile', text: "Profile" },
  { url: '/user/jobs', text: "Jobs" },
  { url: '/user/applications', text: 'Applications' },
  { url: '/user/chat', text: 'Chat' },
]

export const navLinks: navLinkProps[] = [
  { text: "Home", href: siteUrlConfig.home, content: "default", isLink: true, isForDesk: true, isForMob: true },
  { text: "About Us", href: siteUrlConfig.aboutus, isLink: true, isForDesk: true, isForMob: true },
  { text: "Services", href: siteUrlConfig.services, content: "components", isForDesk: true },
  { text: "Services", href: siteUrlConfig.services, isForMob: true },
  { text: "Tours & Travels", href: siteUrlConfig.travelpackages, isLink: true, isForDesk: true, isForMob: true },
  { text: "Web Development", href: siteUrlConfig.webdevelopment, isLink: true, isForDesk: true, isForMob: true },
  { text: "Contact", href: siteUrlConfig.contact, isLink: true, isForDesk: true, isForMob: true },
  { text: "SignIn", href: siteUrlConfig.signIn, isLink: true, isForMob: true },
  { text: "SignUp", href: siteUrlConfig.signUp, isLink: true, isForMob: true },
];


// Services component constants
export const services: ServiceProps[] = [
  {
    id: "toursandtravels",
    title: "Tours & Travels",
    description: "Comprehensive travel planning and support for your international needs.",
    hoverDescription: "Our comprehensive travel services cover everything from flight bookings and hotel arrangements to itinerary planning and travel insurance. We ensure a smooth and stress-free journey by handling all the essential details, so you can focus on enjoying your trip. Benefit: End-to-end travel support for a seamless experience.",
    imageUrl: toursAndTravels,
    href: "#services",

    banner: "",
    bannerTitle: "Plan Memorable Tours With Us",
    showButton: true,
    buttonText: "See More",
    buttonUrl: "/toursandtravels",
    points: [
      "We handle end-to-end travel arrangements, including flights, accommodations, and local transport, ensuring you have a seamless experience.",
      "Our affordable and flexible packages are tailored to meet the unique needs of families, solo travelers, and business trips.",
      "We provide round-the-clock customer support to assist you during your journey, no matter where you are.",
      "Each travel plan is carefully designed to match your preferences, ensuring comfort and convenience at every stage.",
      "We take care of all the essential details in advance so you can focus solely on enjoying your trip.",
    ],
    contactText: "If you would like to make an enquiry for this service, please contact us.",
    contactUrl: "/contact",
    contactButtonText: "Enquiry",
    heroTitle: "Discover Stress-Free Tours Around The World",
  },
  {
    id: "visaservice",
    title: "Visa Service",
    description: "Fast, reliable visa processing with complete documentation support.",
    hoverDescription: "Our specialized team efficiently processes various visa types, ensuring minimal hassle and fast turnaround times. We handle all the necessary documentation and communication with immigration authorities. Benefit: Quick and efficient visa processing.",
    imageUrl: visaService,
    href: "#services",

    banner: visaServiceBanner,
    bannerTitle: "Quick Visa Processing Support Service",
    showButton: true,
    buttonText: "Know More",
    buttonUrl: "/visaservice",
    points: [
      "We manage all visa documentation requirements, ensuring that every detail is accurate and complete.",
      "Our streamlined process guarantees faster visa approvals with minimal delays and rejections.",
      "We handle multiple visa categories, including work, student, tourist, and business visas.",
      "Clients are kept informed at every stage of the process for complete transparency.",
      "Our dedicated support team reduces the stress of visa applications by simplifying complex procedures.",
    ],
    contactText: "If you would like to enquire about this service, please reach out to us.",
    contactUrl: "/contact",
    contactButtonText: "Enquiry",
    heroTitle: "Fast And Reliable Visa Processing Support",
  },
  {
    id: "ticketservice",
    title: "Ticket Service",
    description: "Affordable and hassle-free flight ticket booking for your journeys.",
    hoverDescription: "Secure your flights and other transportation with our simple and convenient booking service. We compare prices and options from multiple providers to find the best deals, saving you time and money. Relax and let us handle the details.",
    imageUrl: ticketService,
    href: "#services",

    banner: ticketServiceBanner,
    bannerTitle: "Book Affordable Tickets With Ease",
    showButton: true,
    buttonText: "Learn More",
    buttonUrl: "/ticketservice",
    points: [
      "We compare multiple airlines and providers to secure the best possible fares for your journey.",
      "Our service ensures quick booking confirmations and hassle-free payment processes.",
      "Flexible rescheduling and cancellation options are available to suit your changing plans.",
      "We provide assistance with both international and domestic flight bookings for individuals and groups.",
      "Our goal is to save you both time and money while ensuring your travel is stress-free.",
    ],
    contactText: "If you would like to make an enquiry for ticket booking, please contact us.",
    contactUrl: "/contact",
    contactButtonText: "Enquiry",
    heroTitle: "Book Affordable Tickets Quickly And Easily",
  },
  {
    id: "certificationservice",
    title: "Certificate Attestation",
    description: "Hassle-free document attestation for smooth international processing.",
    hoverDescription: "We provide expert certificate attestation services for a wide range of documents and destinations worldwide. Our experienced team is familiar with the specific requirements of various embassies and consulates, ensuring a smooth and successful attestation process.",
    imageUrl: certificateAttestationService,
    href: "#services",

    banner: certificateBanner,
    bannerTitle: "Reliable Certificate Attestation Services",
    showButton: true,
    buttonText: "Know More",
    buttonUrl: "/certificationservice",
    points: [
      "We provide complete guidance and support for certificate attestation across multiple countries.",
      "Our experienced team ensures compliance with embassy and consulate requirements for smooth processing.",
      "We handle documents with the utmost security and confidentiality throughout the attestation process.",
      "Our systematic approach reduces delays and ensures documents are attested on time.",
      "We manage the attestation process from start to finish, eliminating unnecessary hassle for clients.",
    ],
    contactText: "If you would like to enquire about attestation services, please reach out to us.",
    contactUrl: "/contact",
    contactButtonText: "Enquiry",
    heroTitle: "Smooth And Hassle-Free Certificate Attestation",
  },
  {
    id: "medicalrecruitservice",
    title: "Medical Recruitment",
    description: "Specialized hiring solutions for healthcare professionals across the globe.",
    hoverDescription: "We specialize in placing highly skilled medical professionals in rewarding positions within reputable healthcare facilities. Our rigorous screening process ensures we connect the right candidates with the right roles, benefiting both employers and employees.",
    imageUrl: medicalRecruitment,
    href: "#services",

    banner: medicalRecBanner,
    bannerTitle: "Trusted Medical Recruitment Worldwide",
    showButton: true,
    buttonText: "Search More",
    buttonUrl: "/medicalrecruit",
    points: [
      "We connect hospitals and clinics with highly skilled medical professionals from around the world.",
      "Each candidate is screened thoroughly to ensure they meet professional and ethical standards.",
      "Our global recruitment network allows us to fill roles quickly and efficiently across multiple healthcare sectors.",
      "We provide both temporary and permanent staffing solutions depending on employer needs.",
      "Employers benefit from reduced hiring times and access to a pool of qualified professionals.",
    ],
    contactText: "If you would like to enquire about medical recruitment, please get in touch.",
    contactUrl: "/contact",
    contactButtonText: "Enquiry",
    heroTitle: "Trusted Recruitment For Healthcare Professionals",
  },
  {
    id: "jobrecruitservice",
    title: "Job Recruitment",
    description: "Helping professionals find rewarding career opportunities across industries.",
    hoverDescription: "We connect highly skilled professionals with rewarding career opportunities in Dubai's thriving job market. Our personalized approach and extensive network guarantee increased chances of securing your ideal role.",
    imageUrl: jobRecruitment,
    href: "#services",

    banner: "",
    bannerTitle: "Connecting You To Better Careers",
    showButton: true,
    buttonText: "Take A Look",
    buttonUrl: "/user",
    points: [
      "We help job seekers find positions that align with their skills, experience, and career goals.",
      "Our extensive network of employers provides access to opportunities across diverse industries.",
      "We streamline the recruitment process, reducing the time between application and placement.",
      "Employers gain access to pre-screened candidates who are motivated and qualified for the role.",
      "Our recruitment team provides career guidance and support to ensure candidates make informed choices.",
    ],
    contactText: "If you would like to enquire about job recruitment, please contact us.",
    contactUrl: "/contact",
    contactButtonText: "Enquiry",
    heroTitle: "Find The Right Career Opportunities Here",
  },
  {
    id: "cvwritingservice",
    title: "CV Writing",
    description: "Crafting impactful CVs that highlight your strengths and career achievements.",
    hoverDescription: "Our expert CV writing service ensures your resume stands out to recruiters. We tailor each CV to showcase your skills, experience, and accomplishments in a way that maximizes your chances of landing interviews and advancing your career.",
    imageUrl: cvWriting,
    href: "#services",

    banner: cvWritingBanner,
    bannerTitle: "Professional CV Writing Services",
    showButton: true,
    buttonText: "Learn More",
    buttonUrl: "/cvwriting",
    points: [
      "We craft CVs that effectively highlight your strengths, skills, and achievements.",
      "Our writing style ensures that your CV is clear, concise, and impactful for recruiters.",
      "Every CV is tailored to meet the expectations of your specific industry or career path.",
      "We optimize CVs to be applicant tracking system (ATS) friendly, improving your chances of selection.",
      "Our service increases your likelihood of landing interviews and advancing your career.",
    ],
    contactText: "If you would like to enquire about CV writing services, please reach out to us.",
    contactUrl: "/contact",
    contactButtonText: "Enquiry",
    heroTitle: "Stand Out With A Professionally Written CV",
  },
  {
    id: "webdevelopment",
    title: "Web Development",
    description: "Building modern, responsive, and scalable websites tailored to your needs.",
    hoverDescription: "Our web development service helps businesses establish a strong online presence. From sleek portfolio sites to dynamic web applications, we deliver custom solutions that are fast, user-friendly, and optimized for performance and growth.",
    imageUrl: webDev,
    href: "#services",

    banner: webDevBanner,
    bannerTitle: "Modern Scalable Web Development Services",
    showButton: true,
    buttonText: "Build One",
    buttonUrl: "/webdevelopment",
    points: [
      "We design and develop modern websites that are responsive across all devices and platforms.",
      "Our development approach ensures scalability so your website grows as your business expands.",
      "We optimize every website for fast loading speeds and top performance.",
      "SEO-friendly structures are built in to maximize visibility on search engines.",
      "Custom features are tailored to your unique business requirements for a personalized solution.",
    ],
    contactText: "If you would like to make an enquiry for web development, please get in touch.",
    contactUrl: "/contact",
    contactButtonText: "Enquiry",
    heroTitle: "Build A Modern And Scalable Website Today",
  },
  {
    id: "laboursupplyservice",
    title: "Labour Supply",
    description: "Enhance your productivity with our skilled and reliable workforce tailored to meet your project needs.",
    hoverDescription: "Our labour supply service provides expert workers and dedicated staff to support your business operations. From short-term staffing to long-term workforce solutions, we ensure efficiency, reliability, and quality to help your projects succeed.",
    imageUrl: labourSupply,
    href: "#services",

    banner: labourSupplyBanner,
    bannerTitle: "Skilled Workforce Supply Solutions",
    showButton: true,
    buttonText: "Hire",
    buttonUrl: "/labourservices",
    points: [
      "We provide skilled and reliable workers who are trained to adapt to diverse industries and projects.",
      "Our service offers flexible staffing solutions, including short-term and long-term placements.",
      "Each candidate undergoes a thorough screening process to ensure reliability and professionalism.",
      "We cater to industries such as construction, hospitality, manufacturing, and logistics.",
      "Our workforce solutions help businesses increase productivity, reduce downtime, and meet project deadlines.",
    ],
    contactText: "If you would like to make an enquiry for labour supply, please contact us.",
    contactUrl: "/contact",
    contactButtonText: "Enquiry",
    heroTitle: "Reliable Workforce Solutions For Every Business",
  },
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
  },
];


export const ImageGridData: ImageGridDataProps[] = [
  {
    id: 1,
    imageUrl: "",
    title: "",
    description: "",
    className: "md:col-span-2"
  },
  {
    id: 2,
    imageUrl: "",
    title: "",
    description: "",
    className: "md:col-span-1"
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
      { text: "Web Development", href: "/web-development" },
      { text: "Contact", href: "#contact" },
    ]
  },
  {
    title: "Contact",
    links: [
      { text: "Instagram", href: "" },
      { text: "Facebook", href: "" },
      { text: "Linkedin", href: "https://www.linkedin.com/company/ss-human-resource-consultancy/" },
      { text: "Phone (India)  +91 9349714742", href: "tel:+91 9349714742" },
      { text: "Phone (UAE) +971 0523664492", href: "tel:+971 0523664492" },
      { text: "Email - aalamconsultancy0@gmail.com", href: "mailto:aalamconsultancy0@gmail.com" },
    ],
  },
]

export const footerPoliciesData = [
  { text: "Privacy Policy", href: "" },
  { text: "Terms of Service", href: "" },
]

export const footerCopyright = "© 2025 sshrconsultancy.com All rights reserved";
export const footerAddress = "Al Qiyadah Metro Station Exit2, Old Labour Office Al Kazim Building Entrance B, Dubai, UAE"


// Contact component constants
export const contactData: ContactItem[] = [
  {
    icon: Phone,
    label: "Phone (India)",
    value: "+91 97154 3274799",
    href: "tel:+91971543274799",
  },
  {
    icon: Phone,
    label: "Phone (UAE)",
    value: "+971 0523664492",
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
    { href: "/toursandtravels", text: "Travel Packages", variant: "outline" },
  ],
}


// Routes
export const userApplicationRoutes: Route[] = [
  { path: "profile", name: "Profile", roles: ["user"] },
  { path: "jobs", name: "Jobs", roles: ["user"] },
  { path: "applications", name: "Applications", roles: ["user"] },
  { path: "chat", name: "Chat", roles: ["user"] },
];
export const adminApplicationRoutes: Route[] = [
  { path: "overview", name: "Overview", roles: ["admin", "superAdmin", "systemAdmin"] },
  { path: "users", name: "Users", roles: ["admin", "superAdmin", "systemAdmin"] },
  { path: "jobs", name: "Jobs", roles: ["admin", "superAdmin", "admin", "systemAdmin"] },
  { path: "packages", name: "Packages", roles: ["admin", "superAdmin", "systemAdmin"] },
  { path: "applications", name: "Applications", roles: ["admin", "superAdmin", "systemAdmin"] },
  { path: "chat", name: "Chat", roles: ["superAdmin", "admin"] },
  { path: "payments", name: "Payments", roles: ["admin", "superAdmin", "systemAdmin"] },
  { path: "testimonials", name: "Testimonials", roles: ["admin", "superAdmin", "systemAdmin"] },
  { path: "reports", name: "Reports", roles: ["superAdmin", "systemAdmin"] },
  { path: "settings", name: "Settings", roles: ["superAdmin"] },
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
    title: "Applications",
    key: "totalApplications",
    icon: FileText,
  },
];


export const mdData: mdDataProps[] = [
  {
    profileImage: md1,
    name: "Shine Son",
    quote: "I want to make people happy when they travel and work around the world just like my dad."
  },
  {
    profileImage: md2,
    name: "Shine",
    quote: "Our mission is to build opportunities that shape brighter futures for our clients, our partners, and most importantly, for the next generation."
  }
]

export const achievements: string[] = [
  "Successfully placed 4,000+ candidates globally",
  "Partnered with 50+ leading companies worldwide",
  "Awarded for excellence in overseas recruitment",
  "Launched tech-driven travel & visa solutions",
  "Expanding into multiple industries including IT & tourism",
  "3000+ job recruitments successfully completed",
  "Offering multiple sector services worldwide",
];