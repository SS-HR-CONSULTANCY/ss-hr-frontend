import React from 'react';
import Heading from '../common/Heading';
import { words } from '@/utils/constants';
import aboutOne from '../../assets/aboutImages/aboutOne.png';
import { TextGenerateEffect } from '../ui/text-generate-effect';

const About: React.FC = () => {
  return (
    <section id="aboutus" className="py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 px-4 md:px-0">
        <div className="col-span-12 md:col-span-8">
          <Heading
            heading="About Us"
            headingDescription="Know more about us"
            mainDivClassName="text-left"
            headingClassName="w-[60%]"
          />
          <TextGenerateEffect duration={2} filter={false} words={words} />
        </div>
        <div className="col-span-12 md:col-span-4 flex justify-center items-center">
          <img
            src={aboutOne}
            className="w-[500px] object-center"
            alt="About Us"
          />
        </div>
      </div>
    </section>
  )
}

export default About