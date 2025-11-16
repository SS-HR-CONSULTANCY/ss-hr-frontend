import React from "react";
import Hero2 from "@/components/sections/Hero2";
import Reviews from "@/components/sections/Reviews";
import Services from "@/components/sections/Services";
import CallToAction from "@/components/sections/CallToAction";

const HomePage: React.FC = () => {
  return (
    <>
        <Hero2 />
        <CallToAction />
        <Services />
        <Reviews />
    </>
  );
};

export default HomePage;
