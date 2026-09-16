import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { services } from "@/utils/constants";

const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-[#F9F9F9]">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20">
        {/* Section header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-black uppercase tracking-wider"
            style={{
              background: "rgba(254,188,4,0.12)",
              border: "1px solid rgba(254,188,4,0.3)",
              color: "#8B5E00",
            }}
          >
            What We Offer
          </div>
          <h2
            className="font-black text-[#0C0C0C] leading-tight tracking-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Our Services
          </h2>

        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative flex flex-col p-6 rounded-2xl transition-all duration-300 cursor-pointer"
              style={{
                background: "white",
                border: "1px solid rgba(0,0,0,0.07)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 20px 50px rgba(0,0,0,0.1)";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(254,188,4,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 16px rgba(0,0,0,0.04)";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(0,0,0,0.07)";
              }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: "rgba(254,188,4,0.12)",
                }}
              >
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-8 h-8 object-contain"
                  style={{ filter: "sepia(1) saturate(4) hue-rotate(-10deg) brightness(0.7)" }}
                />
              </div>

              {/* Content */}
              <h3
                className="font-black text-[#0C0C0C] text-lg mb-2 tracking-tight"
              >
                {service.title}
              </h3>
              <p className="text-neutral-500 text-sm leading-relaxed flex-1">
                {service.description}
              </p>

              {/* CTA */}
              {service.showButton && service.buttonUrl && (
                <Link
                  to={service.buttonUrl}
                  className="inline-flex items-center gap-1.5 mt-5 text-sm font-bold transition-all"
                  style={{ color: "#D4820A" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.gap = "10px";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.gap = "6px";
                  }}
                >
                  {service.buttonText || "Learn More"}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}

              {/* Bottom accent bar on hover */}
              <div
                className="absolute bottom-0 left-0 h-0.5 rounded-b-2xl transition-all duration-300"
                style={{
                  width: "0%",
                  background: "#febc04",
                }}
              />
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div
          className="mt-12 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{
            background: "#0C0C0C",
          }}
        >
          <div>
            <h3 className="font-black text-white text-xl mb-1 tracking-tight">
              Not sure which service you need?
            </h3>
            <p className="text-neutral-400 text-sm">
              Our team is available 24/7 to help you find the right solution.
            </p>
          </div>
          <Link
            to="/contact"
            className="flex-shrink-0 flex items-center gap-2 font-black text-sm px-7 py-3.5 rounded-xl transition-all"
            style={{
              background: "#febc04",
              color: "#261900",
              boxShadow: "0 8px 24px rgba(254,188,4,0.35)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 12px 32px rgba(254,188,4,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 8px 24px rgba(254,188,4,0.35)";
            }}
          >
            Talk to an Expert
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
