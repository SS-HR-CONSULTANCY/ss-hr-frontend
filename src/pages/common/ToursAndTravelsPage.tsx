import React from "react";
import { SEO_DATA } from "@/utils/constants";
import SEO from "@/components/common/SEOProps";
import PackagesPricing from "@/components/sections/PackagesPricing";
import AgodaHotelSearch from "@/components/sections/AgodaHotelSearch";

const ToursAndTravelsPage: React.FC = () => {
  return (
    <>
      <SEO data={SEO_DATA.TOURS_AND_TRAVELS} />
      <div className="min-h-screen bg-[#F9F9F9]">
        <PackagesPricing />
        <AgodaHotelSearch />
      </div>
    </>
  );
};

export default ToursAndTravelsPage;
