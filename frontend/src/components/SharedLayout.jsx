import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useSidebar } from '../context/SidebarContext';

const SharedLayout = () => {
  const location = useLocation();
  const { isSidebarOpen } = useSidebar();
  
  const showSidebar = location.pathname !== '/home' && location.pathname !== '/auth';

  return (
    <div className="flex flex-col min-h-screen bg-background-50 text-text-900 transition-colors duration-300">
      <Navbar />
      <div className="flex flex-1">
        {showSidebar && isSidebarOpen && <Sidebar />}
        <div className="flex-1 flex flex-col min-w-0">
            <main className="flex-1 animate-fade-in relative z-0 p-6">
                <Outlet />
            </main>
            <footer className="bg-background-100 py-8 border-t border-secondary-200 mt-auto">
                <div className="container mx-auto px-6 text-center text-text-500">
                <p className="font-serif italic">AIVA Fashion Platform &copy; 2026</p>
                <div className="flex justify-center gap-4 mt-4 text-sm">
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                    <span>Contact Us</span>
                </div>
                </div>
            </footer>
        </div>
      </div>
    </div>
  );
};

export default SharedLayout;
