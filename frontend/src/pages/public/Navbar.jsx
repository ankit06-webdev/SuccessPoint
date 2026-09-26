import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { User } from 'lucide-react';
import logo from '../../assets/logo.png';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.user?.role);

  const getDashboardRoute = () => {
    if (userRole === 'student') return '/student-dashboard';
    if (userRole === 'admin') return '/admin-dashboard';
    if (userRole === 'teacher') return '/teacher-dashboard';
    return '/';
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="flex items-center gap-3 font-bold text-xl text-slate-900 tracking-tight">
        <img src={logo} alt="Success Point Logo" className="w-8 h-8 object-contain" />
        SUCCESS POINT
      </div>
      
      <div className="hidden md:flex gap-8 font-bold text-xs tracking-widest uppercase text-slate-500">
        <Link to="/" className={`transition-colors ${isActive('/') ? 'text-[#4229b8]' : 'hover:text-[#4229b8]'}`}>HOME</Link>
        <Link to="/about" className={`transition-colors ${isActive('/about') ? 'text-[#4229b8]' : 'hover:text-[#4229b8]'}`}>ABOUT</Link>
        <Link to="/courses" className={`transition-colors ${isActive('/courses') ? 'text-[#4229b8]' : 'hover:text-[#4229b8]'}`}>COURSES</Link>
        <Link to="/contact" className={`transition-colors ${isActive('/contact') ? 'text-[#4229b8]' : 'hover:text-[#4229b8]'}`}>CONTACT</Link>
      </div>

      <div>
        {isLoggedIn ? (
          <Link to={getDashboardRoute()} className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold tracking-widest text-white bg-[#4229b8] rounded-full hover:bg-[#341e96] transition-colors shadow-md shadow-[#4229b8]/20">
            DASHBOARD <User className="ml-2 h-4 w-4" />
          </Link>
        ) : (
          <Link to="/login" className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold tracking-widest uppercase text-white bg-[#4229b8] rounded-full hover:bg-[#341e96] transition-colors shadow-md shadow-[#4229b8]/20">
            Login <User className="ml-2 h-4 w-4" />
          </Link>
        )}
      </div>
    </nav>
  );
}