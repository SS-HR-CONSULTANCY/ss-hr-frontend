import React from "react";
import Lottie from "lottie-react";
import Heading from "@/components/common/Heading";
import world from "../../assets/lotteFiles/world.json";
import { achievements, mdData, words } from "@/utils/constants";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const AboutUs: React.FC = () => {
  return (
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

      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16">
        <Heading
          dataaos="fade-up"
          heading="Managing Directors"
          headingDescription="shahaalam groups"
          mainDivClassName="text-left"
          headingClassName="w-full md:w-[60%]"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10">
          {mdData.map((data, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 shadow-md rounded-lg"
              data-aos="fade-up"
            >
              <img
                src={data.profileImage}
                alt="md image"
                className="w-32 h-32 rounded-md object-cover mb-4"
              />
              <h3 className="text-xl font-semibold">{data.name}</h3>
              <p className="text-center italic mt-2">{data.quote}</p>
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
  );
};

export default AboutUs;
