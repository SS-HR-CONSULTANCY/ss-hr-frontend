import React from 'react';
import Hero from '@/components/sections/Hero';
import ImageGrid from '@/components/sections/ImageGrid';
import PackagesPricing from '@/components/sections/PackagesPricing';
import AosComponent from '@/utils/AosComponent';

const ToursAndTravels:React.FC = () => {
  return (
     <div className="min-h-screen bg-white dark:bg-black">
      <AosComponent>
        <Hero />
        <ImageGrid />
        <PackagesPricing />
      </AosComponent>
    </div>
  )
}

export default ToursAndTravels