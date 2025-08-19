import { Mail, MapPin, Phone } from 'lucide-react';
import type { ContactItem } from '@/types/componentTypes/contactTypes';
import type { PackageProps } from '@/types/componentTypes/packageTypes';
import visaService from '../assets/servicesImages/visaService.png';
import travelService from '../assets/servicesImages/travelService.jpg';
import ticketService from '../assets/servicesImages/ticketService.png';
import type { ContentCardProps } from '@/types/componentTypes/servicesTypes';
import jobRecruitment from '../assets/servicesImages/jobRecruitment.png';
import medicalRecruitment from '../assets/servicesImages/medicalRecruitment.jpg';
import type { navLinkProps, SiteUrlConfigProps } from '@/types/componentTypes/headerTypes';
import certificateAttestationService from '../assets/servicesImages/certificateAttestationService.png';
import type { CallToActionProps } from '@/types/componentTypes/callToActionTypes';
import type { Route } from '@/types/commonTypes';
import type { AdminfetchAllUsersResponse } from '@/types/apiTypes/admin';
import type { Job } from '@/types/entities/job';
import type { Package } from '@/types/entities/package';
import type { Company } from '@/types/entities/company';
import type { Payment } from '@/types/entities/payment';
import type { Review } from '@/types/entities/review';
import type { Application } from '@/types/entities/application';

export const companyName = "ShahaalamGroups";

// Header compoenent constants
export const siteUrlConfig: SiteUrlConfigProps = {
  home: '/',
  aboutus: "#aboutus",
  travelpackages: "#packages",
  reviews: "#reviews",
  contact: "#contact",
  services: '#services',
  signIn: "/login",
  signUp: "/register"
};

export const navLinks: navLinkProps[] = [
  { text: "Home", href: siteUrlConfig.home, content: "default", isLink: true, isForDesk: true, isForMob: true },
  { text: "About Us", href: siteUrlConfig.aboutus, isLink: true, isForDesk: true, isForMob: true },
  { text: "Services", href: siteUrlConfig.services, content: "components", isForDesk: true },
  { text: "Services", href: siteUrlConfig.services, isForMob: true },
  { text: "Travel Packages", href: siteUrlConfig.travelpackages, isLink: true, isForDesk: true, isForMob: true },
  { text: "Reviews", href: siteUrlConfig.reviews, isLink: true, isForDesk: true, isForMob: true },
  { text: "Contact", href: siteUrlConfig.contact, isLink: true, isForDesk: true, isForMob: true },
  { text: "SignIn", href: siteUrlConfig.signIn, isLink: true, isForMob: true },
  { text: "SignUp", href: siteUrlConfig.signUp, isLink: true, isForMob: true },
];

// Services component constants
export const services: ContentCardProps[] = [
  {
    title: "Travel Services",
    description: "Comprehensive travel planning and support for your international needs.",
    hoverDescription: "Our comprehensive travel services cover everything from flight bookings and hotel arrangements to itinerary planning and travel insurance. We ensure a smooth and stress-free journey by handling all the essential details, so you can focus on enjoying your trip. Benefit: End-to-end travel support for a seamless experience.",
    imageUrl: travelService,
    href: "#services"
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
];


// About component constants
export const words: string = "Established in 2021, SS Human Resource Consultancy & Tours & Travels has quickly become a leader in providing comprehensive HR and travel solutions. Our experienced team boasts extensive knowledge of the Dubai job market and travel industry. We pride ourselves on delivering personalized service and exceeding client expectations, making us your trusted partner for both career advancement and memorable travel experiences."


// Package compoenent constants
export const packages: PackageProps[] = [
  {
    name: "Male Package",
    description: "Package for male",
    features: [
      "2 Months Visit Visa",
      "2 Months Accommodation",
      "2 Months Food (Served Twice a Day)",
      "Airport Pickup Only Dubai",
      "Metro & Bus Card",
      "Free Wi-Fi",
      "Free Water",
    ],
    price: 100000,
    popular: true,
  },
  {
    name: "Female Package",
    description: "Package for female",
    features: [
      "2 Months Visit Visa",
      "2 Months Accommodation",
      "2 Months Food (Served Twice a Day)",
      "Airport Pickup Only Dubai",
      "Metro & Bus Card",
      "Free Wi-Fi",
      "Free Water",
    ],
    price: 100000,
  },
  {
    name: "High Package",
    description: "Package for female",
    features: [
      "2 Months Visit Visa",
      "2 Months Accommodation",
      "2 Months Food (Served Twice a Day)",
      "Airport Pickup Only Dubai",
      "Metro & Bus Card",
      "Free Wi-Fi",
      "Free Water",
    ],
    price: 100000,
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
  title : "Ready to get started?",
  description : "From seamless travel arrangements to visa support, job opportunities, and medical recruitment — we provide everything you need for a successful international experience. Let us handle the details so you can focus on your future.",
  buttons : [
    { href: "/register", text: "Get Started", variant: "default" },
    { href: "/travel-packages", text: "Travel Packages", variant: "outline" },
  ],
}


// Sidebar compoenent constacts
export const adminRoutes: Route[] = [
    { path: "overview", name: "Overview" },
    { path: "users", name: "Users" },
    { path: "companies", name: "Companies" },
    { path: "jobs", name: "Jobs" },
    { path: "packages", name: "Packages" },
    { path: "applications", name: "Applications" },
    { path: "chat", name: "Chat" },
    { path: "payments", name: "Payments" },
    { path: "reviews", name: "Reviews" },
  ];


  // Adminusers compoenent dummy data
  export const usersDummyData: AdminfetchAllUsersResponse[] = [
  {
    _id: "1",
    fullName: "John Doe",
    email: "john.doe@example.com",
    createdAt: "1724066432987",
    isVerified: true,
    isActive: true,
    profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    _id: "2",
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    createdAt: "1724066432987",
    isVerified: false,
    isActive: true,
    profileImg: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    _id: "3",
    fullName: "Michael Johnson",
    email: "michael.johnson@example.com",
    createdAt: "1724066432987",
    isVerified: true,
    isActive: false,
    profileImg: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    _id: "4",
    fullName: "Emily Davis",
    email: "emily.davis@example.com",
    createdAt: "1724066432987",
    isVerified: true,
    isActive: true,
    profileImg: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    _id: "5",
    fullName: "David Wilson",
    email: "david.wilson@example.com",
    createdAt: "1724066432987",
    isVerified: false,
    isActive: false,
    profileImg: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    _id: "6",
    fullName: "Sophia Martinez",
    email: "sophia.martinez@example.com",
    createdAt: "1724066432987",
    isVerified: true,
    isActive: true,
    profileImg: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    _id: "7",
    fullName: "James Brown",
    email: "james.brown@example.com",
    createdAt: "1724066432987",
    isVerified: false,
    isActive: true,
    profileImg: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    _id: "8",
    fullName: "Olivia Taylor",
    email: "olivia.taylor@example.com",
    createdAt: "1724066432987",
    isVerified: true,
    isActive: true,
    profileImg: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    _id: "9",
    fullName: "William Anderson",
    email: "william.anderson@example.com",
    createdAt: "1724066432987",
    isVerified: false,
    isActive: false,
    profileImg: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    _id: "10",
    fullName: "Ava Thomas",
    email: "ava.thomas@example.com",
    createdAt: "1724066432987",
    isVerified: true,
    isActive: true,
    profileImg: "https://randomuser.me/api/portraits/women/10.jpg",
  },
];


// Company dummy data 
export const companiesDummyData: Company[] = [
  {
    _id: "c1",
    companyName: "TechNova Solutions",
    companyLogo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg",
    email: "hr@technova.com",
    createdAt: "2024-08-01T10:20:30Z",
    updatedAt: "2024-08-10T14:25:00Z",
    availableJobCount: 12,
    availablePostsWithCount: [
      { post: "Software Engineer", count: 5 },
      { post: "UI/UX Designer", count: 3 },
      { post: "QA Tester", count: 4 },
    ],
  },
  {
    _id: "c2",
    companyName: "GreenField Pvt Ltd",
    companyLogo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg",
    email: "careers@greenfield.com",
    createdAt: "2024-07-12T09:15:10Z",
    updatedAt: "2024-08-05T11:45:00Z",
    availableJobCount: 8,
    availablePostsWithCount: [
      { post: "Backend Developer", count: 3 },
      { post: "Project Manager", count: 2 },
      { post: "HR Executive", count: 3 },
    ],
  },
  {
    _id: "c3",
    companyName: "Skyline Industries",
    companyLogo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg",
    email: "jobs@skyline.com",
    createdAt: "2024-06-20T12:05:00Z",
    updatedAt: "2024-07-01T08:40:00Z",
    availableJobCount: 15,
    availablePostsWithCount: [
      { post: "Mechanical Engineer", count: 6 },
      { post: "Data Analyst", count: 4 },
      { post: "Business Analyst", count: 5 },
    ],
  },
  {
    _id: "c4",
    companyName: "BrightWave Tech",
    companyLogo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg",
    email: "brightwave.hr@gmail.com",
    createdAt: "2024-05-15T14:10:00Z",
    updatedAt: "2024-06-01T17:45:00Z",
    availableJobCount: 6,
    availablePostsWithCount: [
      { post: "Mobile App Developer", count: 2 },
      { post: "Cloud Engineer", count: 4 },
    ],
  },
  {
    _id: "c5",
    companyName: "NextGen Labs",
    companyLogo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg",
    email: "recruit@nextgenlabs.io",
    createdAt: "2024-09-01T08:25:00Z",
    updatedAt: "2024-09-05T09:10:00Z",
    availableJobCount: 10,
    availablePostsWithCount: [
      { post: "AI Engineer", count: 4 },
      { post: "Data Scientist", count: 3 },
      { post: "Research Intern", count: 3 },
    ],
  },
  {
    _id: "c6",
    companyName: "BlueOcean Ventures",
    companyLogo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg",
    email: "talent@blueocean.com",
    createdAt: "2024-03-12T07:45:00Z",
    updatedAt: "2024-04-01T10:30:00Z",
    availableJobCount: 9,
    availablePostsWithCount: [
      { post: "Finance Analyst", count: 3 },
      { post: "Marketing Specialist", count: 4 },
      { post: "Operations Manager", count: 2 },
    ],
  },
  {
    _id: "c7",
    companyName: "UrbanWorks Pvt Ltd",
    companyLogo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg",
    email: "urbanworks.hr@jobs.com",
    createdAt: "2024-01-25T11:20:00Z",
    updatedAt: "2024-02-14T13:40:00Z",
    availableJobCount: 7,
    availablePostsWithCount: [
      { post: "Architect", count: 3 },
      { post: "Civil Engineer", count: 4 },
    ],
  },
  {
    _id: "c8",
    companyName: "CyberNet Systems",
    companyLogo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg",
    email: "cybernet.jobs@company.com",
    createdAt: "2024-02-10T10:15:00Z",
    updatedAt: "2024-03-01T12:10:00Z",
    availableJobCount: 14,
    availablePostsWithCount: [
      { post: "Network Engineer", count: 5 },
      { post: "Security Analyst", count: 4 },
      { post: "System Admin", count: 5 },
    ],
  },
  {
    _id: "c9",
    companyName: "QuantumSoft",
    companyLogo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg",
    email: "quantumsoft@hr.com",
    createdAt: "2024-04-08T09:40:00Z",
    updatedAt: "2024-04-20T11:00:00Z",
    availableJobCount: 11,
    availablePostsWithCount: [
      { post: "Frontend Developer", count: 4 },
      { post: "Fullstack Engineer", count: 3 },
      { post: "DevOps Engineer", count: 4 },
    ],
  },
  {
    _id: "c10",
    companyName: "AeroSpace Dynamics",
    companyLogo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg",
    email: "careers@aerospace.com",
    createdAt: "2024-06-01T13:00:00Z",
    updatedAt: "2024-06-15T16:20:00Z",
    availableJobCount: 5,
    availablePostsWithCount: [
      { post: "Aerospace Engineer", count: 3 },
      { post: "CAD Designer", count: 2 },
    ],
  },
];


// Jobs dummy data
export const jobsDummyData: Job[] = [
  {
    _id: "j1",
    companyName: "TechNova Solutions",
    jobPost: "Software Engineer",
    availableCount: 5,
    createdAt: "2025-08-01T10:30:00Z",
    updatedAt: "2025-08-15T12:45:00Z",
  },
  {
    _id: "j2",
    companyName: "TechNova Solutions",
    jobPost: "UI/UX Designer",
    availableCount: 3,
    createdAt: "2025-07-20T09:00:00Z",
    updatedAt: "2025-08-10T11:15:00Z",
  },
  {
    _id: "j3",
    companyName: "TechNova Solutions",
    jobPost: "QA Tester",
    availableCount: 4,
    createdAt: "2025-07-10T08:20:00Z",
    updatedAt: "2025-08-12T14:00:00Z",
  },
  {
    _id: "j4",
    companyName: "GreenField Pvt Ltd",
    jobPost: "Backend Developer",
    availableCount: 3,
    createdAt: "2025-06-18T13:00:00Z",
    updatedAt: "2025-08-11T15:30:00Z",
  },
  {
    _id: "j5",
    companyName: "GreenField Pvt Ltd",
    jobPost: "Project Manager",
    availableCount: 2,
    createdAt: "2025-06-25T10:15:00Z",
    updatedAt: "2025-08-14T09:45:00Z",
  },
  {
    _id: "j6",
    companyName: "GreenField Pvt Ltd",
    jobPost: "HR Executive",
    availableCount: 3,
    createdAt: "2025-07-05T11:10:00Z",
    updatedAt: "2025-08-13T10:20:00Z",
  },
  {
    _id: "j7",
    companyName: "Skyline Industries",
    jobPost: "Mechanical Engineer",
    availableCount: 6,
    createdAt: "2025-05-30T09:00:00Z",
    updatedAt: "2025-08-16T13:15:00Z",
  },
  {
    _id: "j8",
    companyName: "Skyline Industries",
    jobPost: "Data Analyst",
    availableCount: 4,
    createdAt: "2025-07-12T08:40:00Z",
    updatedAt: "2025-08-17T14:10:00Z",
  },
  {
    _id: "j9",
    companyName: "Skyline Industries",
    jobPost: "Business Analyst",
    availableCount: 5,
    createdAt: "2025-06-08T12:25:00Z",
    updatedAt: "2025-08-18T16:30:00Z",
  },
  {
    _id: "j10",
    companyName: "BrightWave Tech",
    jobPost: "Mobile App Developer",
    availableCount: 2,
    createdAt: "2025-07-22T10:50:00Z",
    updatedAt: "2025-08-18T11:05:00Z",
  },
];


// Package dummy data
export const packageDummyData: Package[] = [
  {
    _id: "p1",
    packageName: "Dubai Essentials",
    description: "Perfect 3-day trip covering the must-see attractions of Dubai.",
    price: "1500 AED",
    features: [
      "3 Nights Hotel Stay (3-Star)",
      "Airport Transfers",
      "Dubai City Tour",
      "Desert Safari with BBQ Dinner",
      "Dhow Cruise at Dubai Marina"
    ],
    createdAt: "2025-07-01T10:00:00Z",
    updatedAt: "2025-08-15T09:30:00Z",
  },
  {
    _id: "p2",
    packageName: "Luxury Dubai Getaway",
    description: "Experience Dubai in luxury with 5-star accommodation and premium tours.",
    price: "4500 AED",
    features: [
      "4 Nights 5-Star Hotel Stay",
      "Airport Pick & Drop in Luxury Car",
      "Burj Khalifa 148th Floor VIP Access",
      "Premium Desert Safari with Quad Biking",
      "Dubai Marina Yacht Dinner Cruise",
      "Shopping Tour with Personal Guide",
      "Day Trip to Abu Dhabi"
    ],
    createdAt: "2025-06-20T12:15:00Z",
    updatedAt: "2025-08-10T11:45:00Z",
  },
  {
    _id: "p3",
    packageName: "Adventure in Dubai",
    description: "Thrilling Dubai adventure package for adrenaline seekers.",
    price: "3200 AED",
    features: [
      "3 Nights Hotel Stay (4-Star)",
      "Skydiving over Palm Jumeirah",
      "Dune Bashing & Sandboarding",
      "Atlantis Aquaventure Waterpark",
      "Jet Ski Experience in Jumeirah Beach",
      "Dubai Frame & Museum of the Future"
    ],
    createdAt: "2025-07-10T08:20:00Z",
    updatedAt: "2025-08-12T14:00:00Z",
  },
  {
    _id: "p4",
    packageName: "Family Fun Dubai",
    description: "Special family-friendly package with activities for all ages.",
    price: "2800 AED",
    features: [
      "5 Nights Hotel Stay (Family Suite)",
      "Airport Transfers",
      "Dubai Aquarium & Underwater Zoo",
      "Legoland & Motiongate Dubai",
      "Global Village Visit",
      "Desert Safari with Kids Activities",
      "IMG Worlds of Adventure",
      "Day Trip to Miracle Garden"
    ],
    createdAt: "2025-07-18T09:40:00Z",
    updatedAt: "2025-08-14T10:20:00Z",
  },
  {
    _id: "p5",
    packageName: "Romantic Dubai Escape",
    description: "A romantic Dubai experience tailored for couples & honeymooners.",
    price: "3700 AED",
    features: [
      "4 Nights Luxury Hotel Stay",
      "Private Airport Transfers",
      "Romantic Dinner on Dubai Creek",
      "Sunset Desert Safari",
      "Couple Spa Experience",
      "Burj Khalifa Sky Lounge Visit",
      "Hot Air Balloon Ride"
    ],
    createdAt: "2025-07-25T11:10:00Z",
    updatedAt: "2025-08-16T13:45:00Z",
  }
];


// Payment dummy data
export const paymentsDummyData: Payment[] = [
  {
    _id: "pay_001",
    transactionId: "TXN987654321",
    userId: "usr_101",
    username: "john_doe",
    screenshot: "/uploads/payments/txn1.png",
    discountAmount: "50 AED",
    totalAmount: "1450 AED",
    paymentStatus: "Completed",
    createdAt: "2025-08-01T10:15:00Z",
    updatedAt: "2025-08-01T10:20:00Z",
  },
  {
    _id: "pay_002",
    transactionId: "TXN123456789",
    userId: "usr_102",
    username: "sarah_lee",
    screenshot: "/uploads/payments/txn2.png",
    discountAmount: "0 AED",
    totalAmount: "3200 AED",
    paymentStatus: "Pending",
    createdAt: "2025-08-05T09:30:00Z",
    updatedAt: "2025-08-05T09:35:00Z",
  },
  {
    _id: "pay_003",
    transactionId: "TXN456789123",
    userId: "usr_103",
    username: "mike_smith",
    screenshot: "/uploads/payments/txn3.png",
    discountAmount: "200 AED",
    totalAmount: "4300 AED",
    paymentStatus: "Completed",
    createdAt: "2025-08-10T14:45:00Z",
    updatedAt: "2025-08-10T15:00:00Z",
  },
  {
    _id: "pay_004",
    transactionId: "TXN789123456",
    userId: "usr_104",
    username: "anita_kumar",
    screenshot: "/uploads/payments/txn4.png",
    discountAmount: "100 AED",
    totalAmount: "2700 AED",
    paymentStatus: "Failed",
    createdAt: "2025-08-12T08:20:00Z",
    updatedAt: "2025-08-12T08:25:00Z",
  },
  {
    _id: "pay_005",
    transactionId: "TXN654321987",
    userId: "usr_105",
    username: "david_wong",
    screenshot: "/uploads/payments/txn5.png",
    discountAmount: "150 AED",
    totalAmount: "3550 AED",
    paymentStatus: "Completed",
    createdAt: "2025-08-15T11:10:00Z",
    updatedAt: "2025-08-15T11:20:00Z",
  },
];


// Review dummy data
export const reviewsDummyData: Review[] = [
  {
    _id: "rev_001",
    userId: "usr_101",
    username: "john_doe",
    job: "Software Engineer",
    text: "Amazing experience! The platform was easy to use and really helped me find opportunities quickly.",
    createdAt: "2025-08-01T09:15:00Z",
    updatedAt: "2025-08-01T09:20:00Z",
  },
  {
    _id: "rev_002",
    userId: "usr_102",
    username: "sarah_lee",
    job: "UI/UX Designer",
    text: "Loved the clean interface. However, I wish there were more filtering options while browsing jobs.",
    createdAt: "2025-08-03T11:45:00Z",
    updatedAt: "2025-08-03T11:50:00Z",
  },
  {
    _id: "rev_003",
    userId: "usr_103",
    username: "mike_smith",
    job: "Data Analyst",
    text: "Support team was quick to respond when I had issues. Overall, a reliable service.",
    createdAt: "2025-08-06T14:10:00Z",
    updatedAt: "2025-08-06T14:20:00Z",
  },
  {
    _id: "rev_004",
    userId: "usr_104",
    username: "anita_kumar",
    job: "Project Manager",
    text: "The job recommendations were very relevant. It saved me a lot of time during my search.",
    createdAt: "2025-08-10T16:30:00Z",
    updatedAt: "2025-08-10T16:40:00Z",
  },
  {
    _id: "rev_005",
    userId: "usr_105",
    username: "david_wong",
    job: "Marketing Specialist",
    text: "Great value for money! The premium features really boosted my visibility.",
    createdAt: "2025-08-12T18:00:00Z",
    updatedAt: "2025-08-12T18:05:00Z",
  },
];


// Application dummy data
export const applicationsDummyData: Application[] = [
  {
    _id: "app_001",
    userId: "usr_101",
    jobId: "job_501",
    cvLink: "https://example.com/cv/john_doe.pdf",
    createdAt: "2025-08-01T09:30:00Z",
    updatedAt: "2025-08-01T09:40:00Z",
    username: "John Doe",
    company: "TechNova Solutions",
    designation: "Software Engineer",
  },
  {
    _id: "app_002",
    userId: "usr_102",
    jobId: "job_502",
    cvLink: "https://example.com/cv/sarah_lee.pdf",
    createdAt: "2025-08-02T10:15:00Z",
    updatedAt: "2025-08-02T10:25:00Z",
    username: "Sarah Lee",
    company: "DesignHive Studios",
    designation: "UI/UX Designer",
  },
  {
    _id: "app_003",
    userId: "usr_103",
    jobId: "job_503",
    cvLink: "https://example.com/cv/mike_smith.pdf",
    createdAt: "2025-08-04T13:20:00Z",
    updatedAt: "2025-08-04T13:30:00Z",
    username: "Mike Smith",
    company: "DataVision Analytics",
    designation: "Data Analyst",
  },
  {
    _id: "app_004",
    userId: "usr_104",
    jobId: "job_504",
    cvLink: "https://example.com/cv/anita_kumar.pdf",
    createdAt: "2025-08-06T15:45:00Z",
    updatedAt: "2025-08-06T15:55:00Z",
    username: "Anita Kumar",
    company: "AgileWorks Ltd.",
    designation: "Project Manager",
  },
  {
    _id: "app_005",
    userId: "usr_105",
    jobId: "job_505",
    cvLink: "https://example.com/cv/david_wong.pdf",
    createdAt: "2025-08-08T17:00:00Z",
    updatedAt: "2025-08-08T17:10:00Z",
    username: "David Wong",
    company: "MarketEdge Global",
    designation: "Marketing Specialist",
  },
];