import React from 'react';
import Navbar from '../Components/Common/Navbar';
import Footer from '../Components/Common/Footer';
import { Outlet } from 'react-router-dom';

function UserLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4">
            <Outlet />
      <Footer/>
      </main>
      
    </>
  );
}

export default UserLayout;