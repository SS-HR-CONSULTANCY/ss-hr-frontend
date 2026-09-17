import React from "react";
import Lottie from "lottie-react";
import SEO from "@/components/common/SEOProps";
import Heading from "@/components/common/Heading";
import world from "../../assets/lotteFiles/world.json";
import { achievements, SEO_DATA, words } from "@/utils/constants";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

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
              <TextGenerateEffect duration={2} filter={false} words={words} />
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
