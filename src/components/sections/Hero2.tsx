import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Plane,
  FileCheck,
  Globe,
  ArrowRight,
  Users,
  TrendingUp,
  MapPin,
  GraduationCap,
  Star,
  Compass,
  Hotel,
  Calendar,
  Handshake,
} from "lucide-react";

// ─── Tab content config ───────────────────────────────────────────────────────
const tabContent = {
  jobs: {
    badge: "Job Hunting Package",
    headline: ["Your Trusted Partner.", "For Dubai Job", "Opportunities."],
    highlightLine: "Opportunities.",
    description:
      "Planning to explore career opportunities in Dubai? We provide end-to-end support to help make your journey easier, from visa assistance to travel and accommodation arrangements.",
    features: [
      { icon: Briefcase, text: "Job Recruitment & Placement" },
      { icon: FileCheck, text: "Visa & Work Permit Processing" },
      { icon: Users, text: "CV Writing & Interview Prep" },
      { icon: Globe, text: "Labour Supply & HR Solutions" },
    ],
    cta: { label: "Apply for Jobs", url: "/contact" },
    ctaSecondary: { label: "Explore Services", url: "#services" },
    cards: {
      topLeft: { icon: Users, title: "500+ Placed", sub: "Candidates Hired", tag: "✓ ACTIVE", tagColor: "#166534", tagBg: "#f0fdf4" },
      topRight: { icon: FileCheck, title: "99% Success", sub: "Visa Approvals", tag: "VERIFIED", tagColor: "#8B5E00", tagBg: "rgba(254,188,4,0.18)" },
      bottomLeft: { icon: TrendingUp, title: "5+ Years", sub: "Trusted Experience", tag: "", tagColor: "", tagBg: "" },
      bottomRight: { icon: MapPin, title: "Dual Offices", sub: "India & Dubai", link: "/contact" },
    },
    centerIcon: Handshake,
    centerLabel: "Your Travel",
    centerSub: "Job hunting partner",
  },
  tours: {
    badge: "Tours & Travels",
    headline: ["Explore Dubai.", "Travel In Comfort.", "Create Memories."],
    highlightLine: "Create Memories.",
    description:
      "Discover unforgettable travel experiences with our curated Dubai tour packages, flight ticket booking, and hotel arrangements. Your perfect holiday starts here.",
    features: [
      { icon: Plane, text: "Flight Ticket Booking" },
      { icon: Hotel, text: "Hotel & Accommodation" },
      { icon: Compass, text: "Dubai City & Desert Tours" },
      { icon: Calendar, text: "Custom Holiday Packages" },
    ],
    cta: { label: "Book a Tour", url: "/toursandtravels" },
    ctaSecondary: { label: "View Packages", url: "/toursandtravels" },
    cards: {
      topLeft: { icon: Compass, title: "50+ Packages", sub: "Curated Tours", tag: "✓ ACTIVE", tagColor: "#166534", tagBg: "#f0fdf4" },
      topRight: { icon: Star, title: "4.9 Rating", sub: "Happy Travellers", tag: "TOP RATED", tagColor: "#8B5E00", tagBg: "rgba(254,188,4,0.18)" },
      bottomLeft: { icon: Hotel, title: "100+ Hotels", sub: "Partner Network", tag: "", tagColor: "", tagBg: "" },
      bottomRight: { icon: Plane, title: "India & UAE", sub: "Destinations", link: "/toursandtravels" },
    },
    centerIcon: Plane,
    centerLabel: "Tours",
    centerSub: "Travel Packages",
  },
};

type Tab = "jobs" | "tours";

const Hero2 = () => {
  const [activeTab, setActiveTab] = useState<Tab>("jobs");
  const [animating, setAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const content = tabContent[activeTab];

  const switchTab = (tab: Tab) => {
    if (tab === activeTab) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveTab(tab);
      setAnimating(false);
    }, 250);
  };

  // Particle canvas effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: {
      x: number; y: number; r: number;
      dx: number; dy: number; alpha: number;
    }[] = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,160,23,${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const CenterIcon = content.centerIcon;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "#F9F9F9" }}
    >
      {/* Canvas particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70"
      />

      {/* Radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(254,188,4,0.08), transparent)",
        }}
      />

      {/* Blobs */}
      <div
        className="absolute top-1/4 left-[5%] w-80 h-80 rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(254,188,4,0.12) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "pulse 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-1/4 right-[5%] w-72 h-72 rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20 pt-8 lg:pt-12 pb-20">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10 lg:gap-14">
        {/* ─── LEFT COLUMN ─── */}
        <div className="lg:w-[52%] flex flex-col gap-6">

          {/* ── TAB SWITCHER PILL ── */}
          <div
            className="inline-flex items-center gap-1.5 p-1.5 rounded-full w-fit"
            style={{
              background: "rgba(212,160,23,0.10)",
              border: "1px solid rgba(254,188,4,0.25)",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Job Hunting tab */}
            <button
              onClick={() => switchTab("jobs")}
              className="px-4 py-1.5 rounded-full font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300"
              style={
                activeTab === "jobs"
                  ? {
                      background: "#febc04",
                      color: "#261900",
                      boxShadow: "0 2px 10px rgba(254,188,4,0.4)",
                      transform: "scale(1.0)",
                    }
                  : {
                      background: "transparent",
                      color: "#6B7280",
                    }
              }
            >
              <Briefcase className="w-3.5 h-3.5" />
              Job Hunting Packages
            </button>

            {/* Tours & Travels tab */}
            <button
              onClick={() => switchTab("tours")}
              className="px-4 py-1.5 rounded-full font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300"
              style={
                activeTab === "tours"
                  ? {
                      background: "#febc04",
                      color: "#261900",
                      boxShadow: "0 2px 10px rgba(254,188,4,0.4)",
                    }
                  : {
                      background: "transparent",
                      color: "#6B7280",
                    }
              }
            >
              <Plane className="w-3.5 h-3.5" />
              Visa &amp; Travel Services
            </button>
          </div>

          {/* ── ANIMATED CONTENT ── */}
          <div
            className="flex flex-col gap-5 transition-all duration-300"
            style={{ opacity: animating ? 0 : 1, transform: animating ? "translateY(10px)" : "translateY(0)" }}
          >
            {/* Headline */}
            <h1
              className="font-black leading-[1.1] tracking-tight text-[#0C0C0C] mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              {content.headline.map((line) =>
                line === content.highlightLine ? (
                  <span key={line}>
                    <span
                      className="text-transparent"
                      style={{
                        WebkitTextFillColor: "transparent",
                        background: "linear-gradient(90deg, #D4820A, #febc04, #F5D020)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                      }}
                    >
                      {line}
                    </span>
                  </span>
                ) : (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                )
              )}
            </h1>

            <p className="text-neutral-600 text-base sm:text-lg max-w-xl leading-relaxed text-justify">
              {content.description}
            </p>



          </div>
        </div>

        {/* ─── RIGHT COLUMN: Orbital Widget ─── */}
        <div className="lg:w-[46%] relative w-full -mt-8 lg:mt-0 flex items-center justify-center">
          <div
            className="relative mx-auto flex items-center justify-center"
            style={{ width: "min(500px, 100%)", minHeight: "500px" }}
          >
            {/* Outer glow */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(254,188,4,0.18) 0%, rgba(254,188,4,0.05) 50%, transparent 70%)",
                filter: "blur(40px)",
                transform: "scale(1.2)",
              }}
            />
            {/* Outer orbital ring */}
            <div
              className="absolute rounded-full"
              style={{
                width: "380px", height: "380px",
                border: "1.5px dashed rgba(254,188,4,0.25)",
                animation: "spin-slow 60s linear infinite",
              }}
            />
            {/* Inner orbital ring */}
            <div
              className="absolute rounded-full"
              style={{
                width: "270px", height: "270px",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            />

            {/* Center badge */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <div
                className="absolute rounded-full"
                style={{
                  width: "200px", height: "200px",
                  border: "2px dashed rgba(254,188,4,0.4)",
                  animation: "spin-slow 30s linear infinite",
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  width: "220px", height: "220px",
                  border: "1px solid rgba(254,188,4,0.15)",
                  animation: "pulse 3s ease-in-out infinite",
                }}
              />
              <div
                className="relative w-36 h-36 rounded-full flex flex-col items-center justify-center text-center transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, rgba(254,188,4,0.15) 50%, rgba(254,188,4,0.08) 100%)",
                  border: "1.5px solid white",
                  boxShadow: "0 10px 40px rgba(254,188,4,0.25), 0 0 0 8px rgba(255,255,255,0.6)",
                  backdropFilter: "blur(20px)",
                  opacity: animating ? 0.5 : 1,
                }}
              >
                <div className="text-xs font-black text-[#0C0C0C] tracking-tight">{content.centerLabel}</div>
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center my-1.5"
                  style={{ background: "#febc04", color: "#261900", boxShadow: "0 0 15px rgba(254,188,4,0.4)" }}
                >
                  <CenterIcon className="w-5 h-5" />
                </div>
                <div className="text-xs font-black text-[#0C0C0C] tracking-tight">{content.centerSub}</div>
              </div>
            </div>

            {/* ── Floating stat cards ── */}
            {/* Top-left */}
            <div
              className="absolute top-0 left-0 z-20 p-3 rounded-2xl max-w-[190px]"
              style={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 12px 30px rgba(0,0,0,0.07)",
                animation: "float-card 6s ease-in-out infinite",
                opacity: animating ? 0 : 1,
                transition: "opacity 0.25s ease",
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(254,188,4,0.15)" }}>
                  {(() => { const Icon = content.cards.topLeft.icon; return <Icon className="w-3.5 h-3.5" style={{ color: "#8B5E00" }} />; })()}
                </div>
                <div>
                  <div className="text-[11px] font-black text-[#0C0C0C]">{content.cards.topLeft.title}</div>
                  <div className="text-[8px] font-mono text-neutral-500 font-bold">{content.cards.topLeft.sub}</div>
                </div>
              </div>
              {content.cards.topLeft.tag && (
                <div className="mt-2 flex items-center justify-between text-[8px] font-mono font-bold text-neutral-700 pt-1.5" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                  <span>India &amp; UAE</span>
                  <span className="font-black px-1 py-0.5 rounded" style={{ color: content.cards.topLeft.tagColor, background: content.cards.topLeft.tagBg }}>
                    {content.cards.topLeft.tag}
                  </span>
                </div>
              )}
            </div>

            {/* Top-right */}
            <div
              className="absolute top-0 right-0 z-20 p-3 rounded-2xl max-w-[190px]"
              style={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 12px 30px rgba(0,0,0,0.07)",
                animation: "float-card 6s ease-in-out infinite 1.5s",
                opacity: animating ? 0 : 1,
                transition: "opacity 0.25s ease",
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(16,185,129,0.12)" }}>
                  {(() => { const Icon = content.cards.topRight.icon; return <Icon className="w-3.5 h-3.5 text-emerald-600" />; })()}
                </div>
                <div>
                  <div className="text-[11px] font-black text-[#0C0C0C]">{content.cards.topRight.title}</div>
                  <div className="text-[8px] font-mono text-neutral-500 font-bold">{content.cards.topRight.sub}</div>
                </div>
              </div>
              {content.cards.topRight.tag && (
                <div className="mt-2 flex items-center justify-between text-[8px] font-mono font-bold text-neutral-700 pt-1.5" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                  <span>Fast Track</span>
                  <span className="font-black px-1 py-0.5 rounded" style={{ color: content.cards.topRight.tagColor, background: content.cards.topRight.tagBg }}>
                    {content.cards.topRight.tag}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom-left */}
            <div
              className="absolute bottom-4 left-0 z-20 p-3 rounded-2xl max-w-[195px]"
              style={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 12px 30px rgba(0,0,0,0.07)",
                animation: "float-card 6s ease-in-out infinite 3s",
                opacity: animating ? 0 : 1,
                transition: "opacity 0.25s ease",
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#febc04" }}>
                  {(() => { const Icon = content.cards.bottomLeft.icon; return <Icon className="w-3.5 h-3.5" style={{ color: "#261900" }} />; })()}
                </div>
                <div>
                  <div className="text-[11px] font-black text-[#0C0C0C]">{content.cards.bottomLeft.title}</div>
                  <div className="text-[8px] font-mono text-neutral-500 font-bold">{content.cards.bottomLeft.sub}</div>
                </div>
              </div>
            </div>

            {/* Bottom-right */}
            <div
              className="absolute bottom-4 right-0 z-20 p-3 rounded-2xl max-w-[195px]"
              style={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 12px 30px rgba(0,0,0,0.07)",
                animation: "float-card 6s ease-in-out infinite 4.5s",
                opacity: animating ? 0 : 1,
                transition: "opacity 0.25s ease",
              }}
            >
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#0C0C0C" }}>
                    {(() => { const Icon = content.cards.bottomRight.icon; return <Icon className="w-3.5 h-3.5" style={{ color: "#febc04" }} />; })()}
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-[#0C0C0C]">{content.cards.bottomRight.title}</div>
                    <div className="text-[8px] font-mono text-neutral-500 font-bold">{content.cards.bottomRight.sub}</div>
                  </div>
                </div>
                <Link
                  to={content.cards.bottomRight.link}
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "#febc04" }}
                >
                  <ArrowRight className="w-3 h-3" style={{ color: "#261900" }} />
                </Link>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* ─── CTAs Centered ─── */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-8 w-full">
          <Link
            to={content.cta.url}
            className="flex items-center justify-center gap-2 font-black text-sm px-8 py-4 rounded-2xl"
            style={{
              background: "#febc04",
              color: "#261900",
              boxShadow: "0 10px 30px rgba(254,188,4,0.3)",
            }}
          >
            {content.cta.label}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={content.ctaSecondary.url}
            className="flex items-center justify-center gap-2 font-bold text-sm px-8 py-4 rounded-2xl text-[#0C0C0C]"
            style={{
              background: "white",
              border: "1px solid rgba(0,0,0,0.12)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            {content.ctaSecondary.label}
          </a>
        </div>

        {/* ─── 4 Feature Buttons Centered ─── */}
        <div className="mt-12 flex flex-wrap justify-center gap-4 lg:gap-8 w-full">
          {content.features.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center justify-center gap-2 text-[10px] lg:text-xs font-bold text-neutral-800 p-2 lg:px-4 lg:py-2.5 rounded-xl transition-all"
              style={{
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              }}
            >
              <div
                className="w-6 h-6 lg:w-7 lg:h-7 rounded-lg flex-shrink-0 flex items-center justify-center"
                style={{ background: "rgba(254,188,4,0.18)", color: "#8B5E00" }}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Stats bar ─── */}
      <div
        className="relative z-10 w-full"
        style={{ borderTop: "1px solid rgba(0,0,0,0.06)", background: "white" }}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20 py-5">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {(activeTab === "jobs"
              ? [
                  { value: "500+", label: "Candidates Placed" },
                  { value: "99%", label: "Visa Success Rate" },
                  { value: "50+", label: "Partner Companies" },
                  { value: "10+", label: "Years of Trust" },
                  { value: "24/7", label: "Customer Support" },
                ]
              : [
                  { value: "50+", label: "Tour Packages" },
                  { value: "4.9★", label: "Client Rating" },
                  { value: "100+", label: "Partner Hotels" },
                  { value: "5+", label: "Destinations" },
                  { value: "24/7", label: "Travel Support" },
                ]
            ).map(({ value, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-2xl font-black" style={{ color: "#D4820A" }}>
                  {value}
                </span>
                <span className="text-xs text-neutral-500 font-semibold leading-tight max-w-[80px]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero2;

