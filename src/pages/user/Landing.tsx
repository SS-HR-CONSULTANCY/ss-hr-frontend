import React from 'react';
import Hero2 from '@/components/sections/Hero2';
import Reviews from '@/components/sections/Reviews';
import Services from '@/components/sections/Services';
import CallToAction from '@/components/sections/CallToAction';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Hero2 />
      <CallToAction />
      <Services />
      <Reviews />
    </div>
  )
}

export default Landing