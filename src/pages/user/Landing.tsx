import React from 'react';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import AosComponent from '@/utils/AosComponent';
import Reviews from '@/components/sections/Reviews';
import Contact from '@/components/sections/Contact';
import Services from '@/components/sections/Services';
import Packages from '@/components/sections/Packages';
import CallToAction from '@/components/sections/CallToAction';

const Landing:React.FC = () => {
  return (
     <div className="min-h-screen bg-white dark:bg-black">
      <AosComponent>
        <Hero />
        <CallToAction />
        <About />
        <Services />
        <Packages />
        <Reviews />
        <Contact />
      </AosComponent>
    </div>
  )
}

export default Landing