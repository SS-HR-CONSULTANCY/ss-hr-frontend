import React from "react";
import SEO from "@/components/common/SEOProps";
import Services from "@/components/sections/Services";

const ServicesPage: React.FC = () => {
  return (
    <>
      <SEO data={{
        title: "Services – SS HR Consultancy",
        description: "Explore our wide range of services including visa processing, travel, medical recruitment and more.",
        keywords: "services, visa, travel, recruitment",
        canonical: "https://sshrconsultancy.com/services"
      }} />
      <div className="min-h-screen bg-[#F9F9F9]">
        <Services />
      </div>
    </>
  );
};

export default ServicesPage;
