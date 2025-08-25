import React from 'react';
import About from '@/components/sections/About';
import AosComponent from '@/utils/AosComponent';
import Reviews from '@/components/sections/Reviews';
import Services from '@/components/sections/Services';
import LandingHero from '@/components/sections/LandingHero';
import CallToAction from '@/components/sections/CallToAction';

const Landing:React.FC = () => {
  return (
     <div className="min-h-screen bg-white dark:bg-black">
      <AosComponent>
        <LandingHero />
        <CallToAction />
        <Services />
        <About />
        <Reviews />
      </AosComponent>
    </div>
  )
}

export default Landing