import React from 'react';
import About from '@/components/sections/About';
import Hero2 from '@/components/sections/Hero2';
import Reviews from '@/components/sections/Reviews';
import Services from '@/components/sections/Services';
// import LandingHero from '@/components/sections/LandingHero';
import CallToAction from '@/components/sections/CallToAction';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* <LandingHero /> */}
      <Hero2 />
      <CallToAction />
      <Services />
      <About />
      <Reviews />
    </div>
  )
}

export default Landing