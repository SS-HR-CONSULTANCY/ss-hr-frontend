import React from 'react';
import Hero from '@/components/sections/Hero';
import AosComponent from '@/utils/AosComponent';
import About from '@/components/sections/About';
import Reviews from '@/components/sections/Reviews';
import Contact from '@/components/sections/Contact';
import Header from '@/components/navigations/Header';
import Services from '@/components/sections/Services';
import Packages from '@/components/sections/Packages';
import Footer from '@/components/navigations/Footer';

const Home: React.FC = () => {

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <AosComponent>
        <Header />
        <Hero />
        <About />
        <Services />
        <Packages />
        <Reviews />
        <Contact />
        <Footer />
      </AosComponent>
    </div>
  );
};

export default Home;