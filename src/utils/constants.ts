import type { PackageProps } from '@/types/omponentTypes/package';
import visaService from '../assets/servicesImages/visaService.png';
import travelService from '../assets/servicesImages/travelService.jpg';
import ticketService from '../assets/servicesImages/ticketService.png';
import type { ContentCardProps } from '@/types/omponentTypes/services';
import jobRecruitment from '../assets/servicesImages/jobRecruitment.png';
import medicalRecruitment from '../assets/servicesImages/medicalRecruitment.jpg';
import type { navLinkProps, SiteUrlConfigProps } from '@/types/omponentTypes/header';
import certificateAttestationService from '../assets/servicesImages/certificateAttestationService.png';

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