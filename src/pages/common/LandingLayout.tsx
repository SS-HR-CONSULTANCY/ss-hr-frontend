import React from "react";
import { Outlet } from "react-router-dom";
import { SEO_DATA } from "@/utils/constants";
import SEO from "@/components/common/SeoProps";
import AosComponent from "@/utils/AosComponent";
import Header from "@/components/navigations/Header";
import Footer from "@/components/navigations/Footer";

const LandingLayout: React.FC = () => {
  return (
    <>
     <SEO data={SEO_DATA.HOME} />
      <div className="p-0 m-0 transition-colors duration-1000">
        <AosComponent>
          <Header />
          <Outlet />
          <Footer />
        </AosComponent>
      </div>
    </>
  );
};

export default LandingLayout;
