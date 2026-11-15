import React from "react";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Code, Megaphone, Smartphone } from "lucide-react";
import SEO from "@/components/common/SEOProps";
import Heading from "@/components/common/Heading";
import world from "../../assets/lotteFiles/world.json";
import { achievements, SEO_DATA, words } from "@/utils/constants";

const digitalServices = [
  {
    icon: Code,
    title: "Web Development",
    text: "We design and build modern, responsive websites, e-commerce stores and custom web applications that are fast, secure and easy to manage.",
    points: ["Business & corporate websites", "E-commerce stores", "Custom web applications", "Hosting & maintenance"],
    link: "/webdevelopment",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    text: "We develop user-friendly Android and iOS apps that put your business in your customers' pockets, from idea and design through to launch and support.",
    points: ["Android & iOS apps", "Cross-platform development", "UI / UX design", "App store launch & support"],
    link: "",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    text: "We help businesses reach more customers online with SEO, social media marketing, paid advertising and creative content that delivers measurable results.",
    points: ["Search engine optimization", "Social media marketing", "Google & Meta ads", "Content & creatives"],
    link: "/digitalmarketing",
  },
];

const AboutUsPage: React.FC = () => {
  return (
    <>
      <SEO data={SEO_DATA.ABOUT_US} />
      <section id="aboutus" className="py-12 md:py-20">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Heading
            heading="About Us"
            headingDescription="Know more about us"
            mainDivClassName="text-left"
            headingClassName="w-full md:w-[60%]"
            dataaos="fade-up"
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-8">
            <div className="md:col-span-8" data-aos="fade-right">
              <p className="text-base sm:text-lg text-neutral-700 leading-relaxed text-justify">{words}</p>
            </div>

            <div className="md:col-span-4 flex justify-center items-center">
              <Lottie
                animationData={world}
                loop={true}
                className="w-48 h-48 sm:w-64 sm:h-64"
                data-aos="fade-left"
              />
            </div>
          </div>
        </div>

        {/* ─── Digital & IT Services ─── */}
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12 md:py-16">
          <Heading
            dataaos="fade-up"
            heading="Our Digital Services"
            headingDescription="Helping businesses build, launch and grow online"
            mainDivClassName="text-left"
            headingClassName="w-full md:w-[60%]"
          />

          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed mt-6 max-w-4xl" data-aos="fade-up">
            Alongside recruitment and travel, our technology team helps businesses establish a strong
            digital presence. From your website and mobile app to the marketing that brings customers to
            them, we offer complete digital solutions under one roof.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {digitalServices.map(({ icon: Icon, title, text, points, link }) => (
              <div
                key={title}
                data-aos="fade-up"
                className="flex flex-col p-7 rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(254,188,4,0.14)", color: "#8B5E00" }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-black text-[#0C0C0C] text-xl mb-2 tracking-tight">{title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-5">{text}</p>
                <ul className="space-y-2 flex-1">
                  {points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#D4820A" }} />
                      {p}
                    </li>
                  ))}
                </ul>
                {link && (
                  <Link
                    to={link}
                    className="inline-flex items-center gap-1.5 mt-6 text-sm font-bold"
                    style={{ color: "#D4820A" }}
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
          <Heading
            dataaos="fade-up"
            heading="Our Achievements"
            headingDescription=""
            mainDivClassName="text-left"
            headingClassName="w-full md:w-[60%]"
          />

          <ul className="list-disc list-inside text-base sm:text-lg space-y-3 mt-6 text-left">
            {achievements.map((data, index) => (
              <li key={index} data-aos="fade-up">
                {data}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default AboutUsPage;
