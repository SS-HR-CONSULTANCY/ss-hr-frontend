import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/navigations/Header';
import Footer from '@/components/navigations/Footer';

const Home: React.FC = () => {

  return (
    <div className='p-0 m-0'>
      <Header />
        <Outlet />
      <Footer />
    </div>
  );
};

export default Home;