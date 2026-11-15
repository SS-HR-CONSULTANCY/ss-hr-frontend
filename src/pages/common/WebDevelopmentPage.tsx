import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Code,
  Monitor,
  Palette,
  ShoppingCart,
  Smartphone,
  Search,
  Megaphone,
  Server,
  Wrench,
  Lightbulb,
  PenTool,
  Rocket,
  ShieldCheck,
  Gauge,
  Users,
  Headphones,
  Phone,
  MessageCircle,
  ClipboardList,
  Calculator,
  CheckCircle2,
} from "lucide-react";
import SEO from "@/components/common/SEOProps";
import { SEO_DATA } from "@/utils/constants";
import webDevBanner from "@/assets/serviceBanners/webDevBanner.jpg";

const WHATSAPP_URL =
  "https://wa.me/971542326584?text=Hello,%20I%20would%20like%20to%20discuss%20a%20website%20project.";
const PHONE = "+971 54 232 6584";
const PHONE_URL = "tel:+971542326584";

const tags = [
  "#WebDevelopment",
  "#WebDesign",
  "#Ecommerce",
  "#WebApps",
  "#SEO",
  "#DigitalMarketing",
  "#ResponsiveDesign",
  "#UIUX",
  "#Hosting",
  "#Maintenance",
];

const expertise = [
  {
    icon: Monitor,
    title: "Business Websites",
    text: "Professional corporate and business websites that build trust and present your brand clearly.",
  },
  {
    icon: Palette,
    title: "UI / UX Design",
    text: "Clean, modern interfaces designed around your customers so they find what they need quickly.",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Stores",
    text: "Online stores with product catalogues, carts, secure payments and easy order management.",
  },
  {
    icon: Code,
    title: "Custom Web Applications",
    text: "Portals, dashboards and booking systems built around the way your business actually works.",
  },
  {
    icon: Smartphone,
    title: "Responsive Development",
    text: "Every site we build works smoothly on mobiles, tablets and desktops.",
  },
  {
    icon: Search,
    title: "SEO Optimisation",
    text: "Search-friendly structure, fast load times and on-page SEO so customers can find you on Google.",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    text: "Social media, Google and Meta ads and content that bring the right visitors to your website.",
    link: "/digitalmarketing",
  },
  {
    icon: Server,
    title: "Domain & Hosting",
    text: "We set up your domain, business email, hosting and SSL so you don't have to.",
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    text: "Updates, backups, security checks and content changes to keep your website running well.",
  },
];

const whyUs = [
  { icon: Users, title: "One Team, End to End", text: "Design, development, hosting and marketing handled by one team." },
  { icon: Gauge, title: "Fast & Secure", text: "Modern technology, optimised performance and SSL security as standard." },
  { icon: ShieldCheck, title: "Transparent Pricing", text: "Clear quotes with no hidden costs, agreed before work begins." },
  { icon: Headphones, title: "Ongoing Support", text: "We stay with you after launch for updates, fixes and improvements." },
];

const process = [
  { icon: Lightbulb, title: "Discovery & Consultation", text: "We understand your business, goals and audience." },
  { icon: ClipboardList, title: "Planning & Wireframes", text: "We map the pages, features and structure of your site." },
  { icon: PenTool, title: "Design", text: "We create a visual design that matches your brand, for your approval." },
  { icon: Code, title: "Development & Testing", text: "We build, test on all devices and fix every issue before launch." },
  { icon: Rocket, title: "Launch & Support", text: "We go live, hand over and keep supporting you afterwards." },
];

const technologies = [
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "Tailwind CSS",
  "MongoDB",
  "WordPress",
  "Shopify",
  "AWS",
  "Figma",
];

const contactOptions = [
  { icon: Phone, title: "Call Us", text: PHONE, href: PHONE_URL, external: false },
  { icon: MessageCircle, title: "WhatsApp", text: "Chat with our team", href: WHATSAPP_URL, external: true },
  { icon: Calculator, title: "Project Estimate", text: "Get a free quote", href: "/contact", external: false },
  { icon: ClipboardList, title: "Consultation", text: "Discuss your idea", href: "/contact", external: false },
];

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-black uppercase tracking-wider"
    style={{
      background: "rgba(254,188,4,0.12)",
      border: "1px solid rgba(254,188,4,0.3)",
      color: "#8B5E00",
    }}
  >
    {children}
  </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode; light?: boolean }> = ({ children, light }) => (
  <h2
    className={`font-black leading-tight tracking-tight mb-4 ${light ? "text-white" : "text-[#0C0C0C]"}`}
    style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}
  >
    {children}
  </h2>
);

const PrimaryButton: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link
    to={to}
    className="inline-flex items-center gap-2 font-black text-sm px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
    style={{
      background: "#febc04",
      color: "#261900",
      boxShadow: "0 8px 24px rgba(254,188,4,0.35)",
    }}
  >
    {children}
    <ArrowRight className="w-4 h-4" />
  </Link>
);

const WebDevelopmentPage: React.FC = () => {
  return (
    <>
      <SEO data={SEO_DATA.WEB_DEVELOPMENT} />
      <style>{`
        @keyframes wd-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>

      <div className="w-full bg-[#F9F9F9]">
        {/* ─── HERO ─── */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 80% 0%, rgba(254,188,4,0.14), transparent), radial-gradient(ellipse 50% 50% at 0% 100%, rgba(254,188,4,0.08), transparent)",
            }}
          />
          <div className="relative max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1
                className="font-black leading-[1.1] tracking-tight text-[#0C0C0C] mb-6"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.75rem)" }}
              >
                Custom Websites &amp; Web Apps That{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, #D4820A, #febc04, #F5D020)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Grow Your Business.
                </span>
              </h1>
              <p className="text-neutral-600 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
                We design and develop fast, secure and mobile-friendly websites, online stores and
                web applications, then help you market them so they bring in real customers.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <PrimaryButton to="/contact">Get In Touch</PrimaryButton>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold text-sm px-7 py-3.5 rounded-xl border transition-all hover:bg-white"
                  style={{ borderColor: "rgba(0,0,0,0.12)", color: "#0C0C0C" }}
                >
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  WhatsApp Us
                </a>
              </div>
            </div>

            <div className="relative">
              <div
                className="absolute -inset-4 rounded-[2rem] pointer-events-none"
                style={{ background: "rgba(254,188,4,0.15)", filter: "blur(30px)" }}
              />
              <img
                src={webDevBanner}
                alt="Web development"
                className="relative w-full h-[280px] sm:h-[380px] object-cover rounded-3xl"
                style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.15)" }}
              />
              <div
                className="absolute -bottom-5 left-5 sm:left-8 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white"
                style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.1)" }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#febc04" }}>
                  <Rocket className="w-4 h-4" style={{ color: "#261900" }} />
                </div>
                <div>
                  <div className="text-sm font-black text-[#0C0C0C]">Free Consultation</div>
                  <div className="text-[11px] text-neutral-500 font-semibold">Talk to us about your project</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── HASHTAG TICKER ─── */}
        <div className="overflow-hidden py-4" style={{ background: "#0C0C0C" }}>
          <div className="flex w-max gap-10" style={{ animation: "wd-marquee 30s linear infinite" }}>
            {[...tags, ...tags].map((tag, i) => (
              <span key={i} className="text-sm font-black tracking-wide whitespace-nowrap" style={{ color: i % 2 ? "#febc04" : "#ffffff" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ─── EXPERTISE GRID ─── */}
        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20">
            <div className="text-center mb-14">
              <SectionLabel>What We Do</SectionLabel>
              <SectionTitle>Our Expertise</SectionTitle>
              <p className="text-neutral-500 max-w-2xl mx-auto">
                Everything you need to build, launch and grow your business online.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expertise.map(({ icon: Icon, title, text, link }) => (
                <div
                  key={title}
                  className="group flex flex-col p-7 rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                    style={{ background: "rgba(254,188,4,0.14)", color: "#8B5E00" }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-[#0C0C0C] text-lg mb-2 tracking-tight">{title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed flex-1">{text}</p>
                  <Link
                    to={link || "/contact"}
                    className="inline-flex items-center gap-1.5 mt-5 text-sm font-bold"
                    style={{ color: "#D4820A" }}
                  >
                    {link ? "Read More" : "Enquire Now"}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WHY US ─── */}
        <section className="pb-20">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionLabel>Why Choose Us</SectionLabel>
              <SectionTitle>Websites Built To Work For Your Business</SectionTitle>
              <p className="text-neutral-600 leading-relaxed mb-4">
                A website is often the first impression customers have of your business. We focus on
                building sites that look professional, load quickly, rank on search engines and make
                it easy for visitors to contact you or buy from you.
              </p>
              <p className="text-neutral-600 leading-relaxed mb-8">
                Because we also offer{" "}
                <Link to="/digitalmarketing" className="font-bold underline decoration-[#febc04] underline-offset-4">
                  digital marketing
                </Link>
                , we build every website with growth in mind, ready for SEO, ads and social media from day one.
              </p>
              <ul className="space-y-3">
                {["Mobile-first, responsive design", "SEO-ready structure and fast performance", "Easy to update and manage"].map((p) => (
                  <li key={p} className="flex items-center gap-3 text-[#0C0C0C] font-semibold">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "#D4820A" }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {whyUs.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="p-6 rounded-2xl bg-white"
                  style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "#febc04", color: "#261900" }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-[#0C0C0C] mb-1.5 tracking-tight">{title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PROCESS ─── */}
        <section className="py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20">
            <div className="text-center mb-14">
              <SectionLabel>How We Work</SectionLabel>
              <SectionTitle>Our Development Process</SectionTitle>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {process.map(({ icon: Icon, title, text }, i) => (
                <div key={title} className="relative p-6 rounded-2xl" style={{ background: "#F9F9F9", border: "1px solid rgba(0,0,0,0.05)" }}>
                  <div className="text-4xl font-black mb-4" style={{ color: "rgba(212,130,10,0.25)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(254,188,4,0.15)", color: "#8B5E00" }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-[#0C0C0C] mb-1.5 tracking-tight">{title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TECHNOLOGIES ─── */}
        <section className="py-16">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20 text-center">
            <SectionLabel>Technologies</SectionLabel>
            <SectionTitle>Tools &amp; Technologies We Use</SectionTitle>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {technologies.map((t) => (
                <span
                  key={t}
                  className="px-5 py-2.5 rounded-xl bg-white text-sm font-bold text-[#0C0C0C]"
                  style={{ border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CONTACT / LET'S WORK TOGETHER ─── */}
        <section className="py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20">
            <div className="text-center mb-12">
              <SectionLabel>Get Started</SectionLabel>
              <SectionTitle>Let&apos;s Work Together</SectionTitle>
              <p className="text-neutral-500 max-w-2xl mx-auto">
                Reach out the way that suits you. We usually reply within one business day.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {contactOptions.map(({ icon: Icon, title, text, href, external }) => {
                const inner = (
                  <>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: "#0C0C0C", color: "#febc04" }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-black text-[#0C0C0C] mb-1 tracking-tight">{title}</h3>
                    <p className="text-neutral-500 text-sm">{text}</p>
                  </>
                );
                const cls = "group flex flex-col items-center text-center p-7 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg";
                const style = { background: "#F9F9F9", border: "1px solid rgba(0,0,0,0.06)" };
                return href.startsWith("/") ? (
                  <Link key={title} to={href} className={cls} style={style}>{inner}</Link>
                ) : (
                  <a key={title} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={cls} style={style}>
                    {inner}
                  </a>
                );
              })}
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default WebDevelopmentPage;
