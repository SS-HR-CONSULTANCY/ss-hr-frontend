import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/navigations/Header';
import Footer from '@/components/navigations/Footer';

const Home: React.FC = () => {

  return (
    <div>
      <Header />
        <Outlet />
      <Footer />
    </div>
  );
};

export default Home;