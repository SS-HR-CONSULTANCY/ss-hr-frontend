import React from "react";
import Contact from "@/components/sections/Contact";
import SEO from "@/components/common/SEOProps";
import { SEO_DATA } from "@/utils/constants";

const ContactPage: React.FC = () => {
  return (
    <>
      <SEO data={SEO_DATA.CONTACT_US} />
      <div className="min-h-screen bg-white dark:bg-black">
        <Contact />
      </div>
    </>
  );
};

export default ContactPage;
