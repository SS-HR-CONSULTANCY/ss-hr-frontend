import React from 'react';
import { Outlet } from 'react-router-dom';
import AosComponent from '@/utils/AosComponent';
import Header from '@/components/navigations/Header';
import Footer from '@/components/navigations/Footer';

const Home: React.FC = () => {

  return (
    <div className='p-0 m-0'>
      <AosComponent>
        <Header />
        <Outlet />
        <Footer />
      </AosComponent>
    </div>
  );
};

export default Home;