import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthPage) return null; // We hide global navbar on auth pages

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#0066FF] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 duration-200">
                <HeartPulse className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight">
                  CareWell Hospital
                </span>
                <span className="text-[11px] md:text-xs font-light text-slate-300 tracking-wide mt-0.5">
                  Management System
                </span>
              </div>
            </Link>
          </div>
          
          {/* Center Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-medium text-white hover:text-blue-200 transition-colors">Our Specialists</a>
            <a href="#" className="text-sm font-medium text-white hover:text-blue-200 transition-colors">Services</a>
            <a href="#" className="text-sm font-medium text-white hover:text-blue-200 transition-colors">Research</a>
            <a href="#" className="text-sm font-medium text-white hover:text-blue-200 transition-colors">Facility</a>
          </div>

          {/* Right Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-white border border-white/40 hover:bg-white/10 px-6 py-2.5 rounded text-sm font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-[#0066FF] hover:bg-blue-600 text-white px-6 py-2.5 rounded text-sm font-medium transition-colors"
            >
              Sign Up
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
