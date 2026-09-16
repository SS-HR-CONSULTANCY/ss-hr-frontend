import React from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  FileText,
  GraduationCap,
  Briefcase,
  User,
  Calendar,
  Home,
  UtensilsCrossed,
  Plane,
  Car,
  CreditCard,
  ArrowRight,
  Phone,
  Mail,
  Globe,
  MapPin,
  CheckCircle2,
} from "lucide-react";

const requirements = [
  { icon: Camera, label: "Personal Photo" },
  { icon: FileText, label: "Passport copy valid for at least 6 months" },
  { icon: GraduationCap, label: "University degree attested" },
  { icon: Briefcase, label: "Experience certificate" },
  { icon: User, label: "CV" },
];

const visaDurations = [
  { days: "60", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  { days: "90", color: "#f97316", bg: "rgba(249,115,22,0.12)" },
  { days: "120", color: "#a855f7", bg: "rgba(168,85,247,0.12)" },
];

const packageIncludes = [
  { icon: Home, label: "Accommodation" },
  { icon: UtensilsCrossed, label: "2 Times Food" },
  { icon: Plane, label: "Air Ticket" },
  { icon: Car, label: "Airport Pick Up" },
  { icon: CreditCard, label: "Metro Card" },
];

const PackagesPricing: React.FC = () => {
  return (
    <section id="packages" className="py-20 bg-[#F9F9F9]">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20">
        {/* Section header */}
        <div className="text-center mb-14">
          <h1
            className="font-black text-[#0C0C0C] leading-tight tracking-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
          >
            Job Seekers{" "}
            <span
              style={{
                WebkitTextFillColor: "transparent",
                background: "linear-gradient(90deg, #D4820A, #febc04, #F5D020)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              Visa
            </span>
          </h1>
          <p className="text-neutral-600 text-base max-w-2xl mx-auto leading-relaxed">
            We are pleased to announce that we have started offering{" "}
            <strong className="text-[#0C0C0C]">Job Seekers Visas</strong>. A full-support package
            to help you land your dream career in the UAE.
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* ── LEFT: Requirements ── */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: "white",
              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(254,188,4,0.15)" }}
              >
                <CheckCircle2 className="w-5 h-5" style={{ color: "#D4820A" }} />
              </div>
              <h2 className="text-xl font-black text-[#0C0C0C]">Requirements</h2>
            </div>

            <div className="flex flex-col gap-4">
              {requirements.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group cursor-default"
                  style={{
                    background: "#F9F9F9",
                    border: "1px solid rgba(0,0,0,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(254,188,4,0.08)";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(254,188,4,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#F9F9F9";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(0,0,0,0.05)";
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(254,188,4,0.15)" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "#8B5E00" }} />
                  </div>
                  <span className="font-semibold text-[#0C0C0C] text-sm leading-snug">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Visa Duration + Full Package ── */}
          <div className="flex flex-col gap-6">
            {/* Visa Duration */}
            <div
              className="rounded-2xl p-8"
              style={{
                background: "white",
                border: "1px solid rgba(0,0,0,0.07)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(254,188,4,0.15)" }}
                >
                  <Calendar className="w-5 h-5" style={{ color: "#D4820A" }} />
                </div>
                <h2 className="text-xl font-black text-[#0C0C0C]">Visa Duration</h2>
              </div>

              <div className="flex flex-col gap-3">
                {visaDurations.map(({ days, color, bg }) => (
                  <div
                    key={days}
                    className="flex items-center justify-between px-6 py-4 rounded-xl"
                    style={{ background: bg, border: `1px solid ${color}30` }}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5" style={{ color }} />
                      <span className="font-black text-2xl" style={{ color }}>
                        {days} Days
                      </span>
                    </div>
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: color, color: "white" }}
                    >
                      Available
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Package */}
            <div
              className="rounded-2xl p-8"
              style={{
                background: "#0C0C0C",
                border: "1px solid rgba(254,188,4,0.2)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(254,188,4,0.2)" }}
                >
                  <Briefcase className="w-5 h-5" style={{ color: "#febc04" }} />
                </div>
                <h2 className="text-xl font-black text-white">Full Package Available</h2>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {packageIncludes.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl text-center"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{
                        background: "rgba(254,188,4,0.2)",
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: "#febc04" }} />
                    </div>
                    <span className="text-xs font-bold text-neutral-300 leading-snug">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA Strip ── */}
        <div
          className="mt-10 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{
            background: "linear-gradient(135deg, #febc04 0%, #D4820A 100%)",
          }}
        >
          <div>
            <h3 className="font-black text-[#261900] text-2xl mb-1 tracking-tight">
              Contact Us Today!
            </h3>
            <p className="text-[#4a2e00] font-medium text-sm">
              Let's make your next step happen...!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href="https://wa.me/971542326584"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-black text-sm px-6 py-3 rounded-xl transition-all"
              style={{
                background: "#0C0C0C",
                color: "white",
              }}
            >
              <Phone className="w-4 h-4" />
              +971 542 326 584
            </a>
            <Link
              to="/contact"
              className="flex items-center gap-2 font-black text-sm px-6 py-3 rounded-xl transition-all"
              style={{
                background: "rgba(0,0,0,0.15)",
                color: "#261900",
              }}
            >
              Send Enquiry
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── Contact details ── */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Phone,
              label: "+971 542326584  •  +971 542326583",
              href: "tel:+971542326584",
            },
            {
              icon: Mail,
              label: "hr@sshrconsultancy.com",
              href: "mailto:hr@sshrconsultancy.com",
            },
            {
              icon: MapPin,
              label: "Al Qiyadah Metro Station, Exit-2, Abu Saif Business Center, Entrance B, Room 205, Dubai, UAE",
              href: "https://maps.app.goo.gl/mtS27W7FQJnYHbLPA",
            },
          ].map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 rounded-xl transition-all"
              style={{
                background: "white",
                border: "1px solid rgba(0,0,0,0.07)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(254,188,4,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(0,0,0,0.07)";
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "rgba(254,188,4,0.15)" }}
              >
                <Icon className="w-4 h-4" style={{ color: "#D4820A" }} />
              </div>
              <span className="text-xs font-semibold text-neutral-600 leading-snug">
                {label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesPricing;
