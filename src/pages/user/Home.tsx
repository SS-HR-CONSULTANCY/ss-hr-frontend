import React from 'react';
import Cta from '@/components/sections/Cta';
import Hero from '@/components/sections/Hero';
import AosComponent from '@/utils/AosComponent';
import Header from '@/components/navigations/Header';
import Footer from '@/components/navigations/Footer';
import Services from '@/components/sections/Services';

const Home: React.FC = () => {

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <AosComponent>
        <Header />
        <Hero />
        <Services />
        <Cta />
        <Footer />
      </AosComponent>
    </div>
  );
};

export default Home;