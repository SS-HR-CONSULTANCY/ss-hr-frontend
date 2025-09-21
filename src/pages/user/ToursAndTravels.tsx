import React from 'react';
import AosComponent from '@/utils/AosComponent';
import ImageGrid from '@/components/sections/ImageGrid';
import worldTour from '../../assets/serviceBanners/worldTour.png';
import PackagesPricing from '@/components/sections/PackagesPricing';

const ToursAndTravels: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <AosComponent>
        <div
          className="relative w-full h-[50vh] flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${worldTour})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <h1 className="relative z-10 text-4xl md:text-6xl font-bold text-white text-center" data-aos="fade-down">
            Experience Your Perfect Journey With Us
          </h1>
        </div>
        <ImageGrid />
        <PackagesPricing />
      </AosComponent>
    </div>
  )
}

export default ToursAndTravels