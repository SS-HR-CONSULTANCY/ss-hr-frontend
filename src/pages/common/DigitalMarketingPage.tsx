import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Search,
  Share2,
  Target,
  PenTool,
  Mail,
  MapPin,
  BarChart3,
  Video,
  Monitor,
  TrendingUp,
  Users,
  LineChart,
  Handshake,
  Plus,
  Minus,
  Phone,
  MessageCircle,
  Calculator,
  ClipboardList,
  Building2,
  HeartPulse,
  GraduationCap,
  Plane,
  UtensilsCrossed,
  ShoppingBag,
  Home,
  Car,
  Briefcase,
  Dumbbell,
  Sparkles,
  Factory,
} from "lucide-react";
import SEO from "@/components/common/SEOProps";
import { SEO_DATA } from "@/utils/constants";

const WHATSAPP_URL =
  "https://wa.me/971542326585?text=Hello,%20I%20would%20like%20to%20discuss%20digital%20marketing%20for%20my%20business.";
const PHONE = "+971 54 232 6585";
const PHONE_URL = "tel:+971542326585";

const heroBenefits = [
  "Rank higher on Google with proven SEO",
  "Grow and engage your social media audience",
  "Generate quality leads with Google & Meta Ads",
  "Creative content that reflects your brand",
  "Clear monthly reports on every campaign",
];

const services = [
  { icon: Search, title: "Search Engine Optimization", text: "On-page, technical and local SEO that helps customers find your business on Google." },
  { icon: Share2, title: "Social Media Marketing", text: "Strategy, content and management for Instagram, Facebook, LinkedIn and TikTok." },
  { icon: Target, title: "Pay-Per-Click Advertising", text: "Targeted Google and Meta ad campaigns built to bring leads at the right cost." },
  { icon: PenTool, title: "Content & Creatives", text: "Posts, graphics, blogs and ad creatives that tell your story and drive action." },
  { icon: Video, title: "Video & Reels", text: "Short-form videos and reels that capture attention and boost engagement." },
  { icon: MapPin, title: "Local SEO & Google Business", text: "Optimise your Google Business Profile so nearby customers can find and call you." },
  { icon: Mail, title: "Email & WhatsApp Marketing", text: "Campaigns that keep you in touch with customers and bring them back." },
  { icon: Monitor, title: "Website & Landing Pages", text: "High-converting websites and landing pages that turn traffic into enquiries." },
  { icon: BarChart3, title: "Analytics & Reporting", text: "Tracking set up properly, with clear reports so you know what's working." },
];

const pillars = ["Strategy", "Creativity", "Performance", "Transparency"];

const whyBlocks = [
  {
    icon: TrendingUp,
    title: "Strategy Built Around Your Goals",
    text: "We start by understanding your business, customers and competitors, then build a marketing plan focused on the results that matter to you, whether that's calls, leads, bookings or sales.",
  },
  {
    icon: Sparkles,
    title: "Creative That Gets Noticed",
    text: "Our team creates eye-catching content, graphics and videos designed for each platform, so your brand stands out and stays consistent everywhere your customers see it.",
  },
  {
    icon: LineChart,
    title: "Performance You Can Measure",
    text: "Every campaign is tracked from the first click to the final enquiry. We constantly test and optimise ads, keywords and content to improve your return on every dirham spent.",
  },
  {
    icon: Handshake,
    title: "Honest, Transparent Partnership",
    text: "You get clear reports, regular updates and a team that's easy to reach. No jargon and no hidden costs, just straightforward communication about how your marketing is performing.",
  },
];

const industries = [
  { icon: Building2, name: "Real Estate" },
  { icon: HeartPulse, name: "Healthcare" },
  { icon: GraduationCap, name: "Education" },
  { icon: Plane, name: "Travel & Tourism" },
  { icon: UtensilsCrossed, name: "Restaurants" },
  { icon: ShoppingBag, name: "E-commerce & Retail" },
  { icon: Home, name: "Interior & Construction" },
  { icon: Car, name: "Automotive" },
  { icon: Briefcase, name: "Professional Services" },
  { icon: Dumbbell, name: "Fitness & Wellness" },
  { icon: Users, name: "Recruitment & HR" },
  { icon: Factory, name: "Manufacturing & Trading" },
];

const faqs = [
  {
    q: "What digital marketing services do you offer?",
    a: "We offer SEO, social media marketing, Google and Meta ads, content and creatives, video and reels, local SEO, email and WhatsApp marketing, landing pages and analytics. We can handle one service or your complete digital marketing.",
  },
  {
    q: "How long does it take to see results?",
    a: "Paid ads can start bringing enquiries within days of launch. SEO and organic social media take longer, typically showing meaningful growth over three to six months of consistent work.",
  },
  {
    q: "How much does digital marketing cost?",
    a: "It depends on the services, platforms and your goals. We'll recommend a plan that fits your budget and share a clear quote before any work begins.",
  },
  {
    q: "Do I need to sign a long-term contract?",
    a: "No. We work on flexible monthly plans. We'd rather keep you because the results are good, not because of a contract.",
  },
  {
    q: "Will I get reports on my campaigns?",
    a: "Yes. You'll receive regular reports covering traffic, leads, ad spend and engagement, explained in plain language, along with our recommendations for the next month.",
  },
  {
    q: "Can you also build or improve my website?",
    a: "Yes. Our web development team builds fast, SEO-ready websites and landing pages, so your marketing and website work together.",
  },
];

const contactOptions = [
  { icon: Phone, title: "Call Us", text: PHONE, href: PHONE_URL, external: false },
  { icon: MessageCircle, title: "WhatsApp", text: "Chat with our team", href: WHATSAPP_URL, external: true },
  { icon: Calculator, title: "Get a Proposal", text: "Plans for your budget", href: "/contact", external: false },
  { icon: ClipboardList, title: "Free Consultation", text: "Discuss your goals", href: "/contact", external: false },
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

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2
    className="font-black leading-tight tracking-tight mb-4 text-[#0C0C0C]"
    style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}
  >
    {children}
  </h2>
);

const DigitalMarketingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <SEO data={SEO_DATA.DIGITAL_MARKETING} />

      <div className="w-full bg-[#F9F9F9]">
        {/* ─── HERO ─── */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 85% 10%, rgba(254,188,4,0.16), transparent), radial-gradient(ellipse 50% 50% at 0% 100%, rgba(254,188,4,0.08), transparent)",
            }}
          />
          <div className="relative max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20 py-16 lg:py-24 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
            <div>
              <h1
                className="font-black leading-[1.1] tracking-tight text-[#0C0C0C] mb-4"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.75rem)" }}
              >
                Digital Marketing That{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, #D4820A, #febc04, #F5D020)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Grows Your Business.
                </span>
              </h1>
              <p className="text-lg sm:text-xl font-bold text-neutral-700 mb-6">
                More visibility. More leads. More customers.
              </p>
              <ul className="space-y-3 mb-8">
                {heroBenefits.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-neutral-700 font-semibold">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "#D4820A" }} />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 font-black text-sm px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
                  style={{ background: "#febc04", color: "#261900", boxShadow: "0 8px 24px rgba(254,188,4,0.35)" }}
                >
                  Enquire Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#dm-services"
                  className="inline-flex items-center gap-2 font-bold text-sm px-7 py-3.5 rounded-xl border transition-all hover:bg-white"
                  style={{ borderColor: "rgba(0,0,0,0.12)", color: "#0C0C0C" }}
                >
                  Our Services
                </a>
              </div>
            </div>

            {/* Consultation card */}
            <div
              className="relative rounded-3xl p-8 sm:p-10 overflow-hidden"
              style={{ background: "#0C0C0C", boxShadow: "0 30px 60px rgba(0,0,0,0.18)" }}
            >
              <div
                className="absolute -right-16 -top-16 w-60 h-60 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(254,188,4,0.35), transparent 70%)" }}
              />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: "#febc04", color: "#261900" }}>
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight mb-2">Book a Free Consultation</h2>
                <p className="text-neutral-400 mb-7 leading-relaxed">
                  Tell us about your business and goals. We&apos;ll suggest the right marketing plan for you, with no obligation.
                </p>
                <div className="space-y-3">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full font-black text-sm px-6 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
                    style={{ background: "#febc04", color: "#261900" }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat on WhatsApp
                  </a>
                  <a
                    href={PHONE_URL}
                    className="flex items-center justify-center gap-2 w-full font-bold text-sm px-6 py-3.5 rounded-xl border text-white transition-all hover:bg-white/5"
                    style={{ borderColor: "rgba(255,255,255,0.15)" }}
                  >
                    <Phone className="w-4 h-4" />
                    {PHONE}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── INTRO ─── */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-5 sm:px-10 text-center">
            <SectionTitle>Your Partner For Online Growth</SectionTitle>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Your customers are searching, scrolling and comparing online every day. Digital marketing puts
              your business in front of them at the right moment, with the right message.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              We combine SEO, social media, paid advertising and creative content into one plan, so every
              channel works together to build your brand and bring in real enquiries.
            </p>
          </div>
        </section>

        {/* ─── SERVICES GRID ─── */}
        <section id="dm-services" className="py-20 scroll-mt-24">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20">
            <div className="text-center mb-14">
              <SectionLabel>What We Do</SectionLabel>
              <SectionTitle>Our Digital Marketing Services</SectionTitle>
              <p className="text-neutral-500 max-w-2xl mx-auto">
                Everything you need to reach, engage and convert customers online.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(({ icon: Icon, title, text }) => (
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
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WHY CHOOSE US (alternating) ─── */}
        <section className="py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20">
            <div className="text-center mb-6">
              <SectionLabel>Why Choose Us</SectionLabel>
              <SectionTitle>Why Businesses Choose Us</SectionTitle>
            </div>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 mb-16 text-sm font-black uppercase tracking-wider text-neutral-400">
              {pillars.map((p, i) => (
                <span key={p} className="flex items-center gap-3">
                  <span style={{ color: i % 2 ? "#0C0C0C" : "#D4820A" }}>{p}</span>
                  {i < pillars.length - 1 && <span className="text-neutral-300">•</span>}
                </span>
              ))}
            </div>

            <div className="space-y-16 lg:space-y-24">
              {whyBlocks.map(({ icon: Icon, title, text }, i) => (
                <div
                  key={title}
                  className={`flex flex-col gap-10 lg:gap-20 items-center ${i % 2 ? "lg:flex-row-reverse" : "lg:flex-row"}`}
                >
                  {/* Illustration */}
                  <div className="w-full lg:w-1/2 flex justify-center">
                    <div
                      className="relative w-full max-w-md aspect-[4/3] rounded-3xl flex items-center justify-center overflow-hidden"
                      style={{ background: "linear-gradient(135deg, rgba(254,188,4,0.18) 0%, rgba(254,188,4,0.05) 100%)", border: "1px solid rgba(254,188,4,0.25)" }}
                    >
                      <div className="absolute w-64 h-64 rounded-full" style={{ border: "2px dashed rgba(254,188,4,0.35)" }} />
                      <div className="absolute w-44 h-44 rounded-full bg-white/70" />
                      <div
                        className="relative w-24 h-24 rounded-3xl flex items-center justify-center"
                        style={{ background: "#febc04", color: "#261900", boxShadow: "0 20px 40px rgba(254,188,4,0.45)" }}
                      >
                        <Icon className="w-11 h-11" />
                      </div>
                      <div className="absolute top-6 left-6 text-5xl font-black" style={{ color: "rgba(212,130,10,0.2)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                    </div>
                  </div>
                  {/* Text */}
                  <div className="w-full lg:w-1/2">
                    <h3 className="font-black text-[#0C0C0C] tracking-tight mb-4" style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}>
                      {title}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed text-base sm:text-lg">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── INDUSTRIES ─── */}
        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20">
            <div className="text-center mb-14">
              <SectionLabel>Industries</SectionLabel>
              <SectionTitle>Industries We Serve</SectionTitle>
              <p className="text-neutral-500 max-w-2xl mx-auto">
                Marketing strategies tailored to the way customers buy in your industry.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {industries.map(({ icon: Icon, name }) => (
                <div
                  key={name}
                  className="group flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{ border: "1px solid rgba(0,0,0,0.07)" }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors group-hover:!bg-[#febc04]"
                    style={{ background: "rgba(254,188,4,0.14)", color: "#8B5E00" }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-[#0C0C0C] tracking-tight">{name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-5 sm:px-10">
            <div className="text-center mb-12">
              <SectionLabel>FAQ</SectionLabel>
              <SectionTitle>Frequently Asked Questions</SectionTitle>
            </div>
            <div className="space-y-3">
              {faqs.map(({ q, a }, i) => {
                const open = openFaq === i;
                return (
                  <div
                    key={q}
                    className="rounded-2xl transition-all"
                    style={{
                      background: open ? "rgba(254,188,4,0.08)" : "#F9F9F9",
                      border: `1px solid ${open ? "rgba(254,188,4,0.35)" : "rgba(0,0,0,0.06)"}`,
                    }}
                  >
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                      aria-expanded={open}
                    >
                      <h3 className="font-black text-[#0C0C0C] tracking-tight">{q}</h3>
                      <span
                        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                        style={{ background: open ? "#febc04" : "white", color: "#261900", border: "1px solid rgba(0,0,0,0.08)" }}
                      >
                        {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </span>
                    </button>
                    {open && <p className="px-6 pb-6 text-neutral-600 leading-relaxed">{a}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── CONTACT OPTIONS ─── */}
        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20">
            <div className="text-center mb-12">
              <SectionLabel>Get Started</SectionLabel>
              <SectionTitle>Ready To Grow Online?</SectionTitle>
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
                const cls = "group flex flex-col items-center text-center p-7 rounded-2xl bg-white transition-all hover:-translate-y-1 hover:shadow-lg";
                const style = { border: "1px solid rgba(0,0,0,0.06)" };
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

export default DigitalMarketingPage;
