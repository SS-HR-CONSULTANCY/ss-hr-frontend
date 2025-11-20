import React from "react";
import { SEO_DATA } from "@/utils/constants";
import AosComponent from "@/utils/AosComponent";
import SEO from "@/components/common/SeoProps";
import ImageGrid from "@/components/sections/ImageGrid";
import worldTour from "../../assets/serviceBanners/worldTour.png";
import PackagesPricing from "@/components/sections/PackagesPricing";

const ToursAndTravelsPage: React.FC = () => {
  return (
    <>
      <SEO data={SEO_DATA.TOURS_AND_TRAVELS} />
      <div className="min-h-screen bg-white dark:bg-black">
        <AosComponent>
          <div
            className="relative w-full h-[50vh] flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${worldTour})` }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
            <h1
              className="relative z-10 text-4xl md:text-6xl font-bold text-white text-center"
              data-aos="fade-up"
            >
              Experience Your Perfect Journey With Us
            </h1>
          </div>
          <ImageGrid />
          <PackagesPricing />
        </AosComponent>
      </div>
    </>
  );
};

export default ToursAndTravelsPage;
