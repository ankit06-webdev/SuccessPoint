import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import api from '@/services/api';
import { LogOut, Home, ChevronDown, Menu } from 'lucide-react';

const Header = ({ onMenuClick }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.auth.user);

    const userName = user?.name || user?.role || 'User';
    const userRole = user?.role || 'Member';

    const nameParts = userName.split(' ');
    const initials = nameParts.length > 1 
        ? nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase()
        : nameParts[0].charAt(0).toUpperCase();

    return (
        <header className="bg-white backdrop-blur-md h-18 px-4 sm:px-6 flex items-center justify-between md:rounded-tl-xl md:mt-4 shrink-0 sticky top-2 z-20 border-b border-slate-100/50 md:border-none">

            <div className="flex items-center gap-2 sm:gap-4">
                
                <button 
                    onClick={onMenuClick} 
                    className="md:hidden p-2 -ml-2 text-slate-600 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                    title="Open Menu"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-1 sm:gap-0">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center p-2 sm:w-10 sm:h-10 hover:text-primary transition-all duration-200"
                        title="Home"
                    >
                        <Home className="w-5 h-5" />
                    </button>
                    {/* 🔴 FIXED: Changed xs:block to sm:block so the text actually shows up! */}
                    <p className='text-primary text-sm sm:text-base hidden sm:block'>/ Dashboard</p>
                </div>
            </div>

            <div className="hidden sm:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <h2 className="text-base sm:text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                    Welcome back,
                    <span className="text-primary capitalize">
                        {nameParts[0]}
                    </span> 
                </h2>
            </div>

            <div className="flex items-center">
                <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-3 p-1 pr-2 sm:pr-3 rounded-full border border-transparent transition-all duration-300 group hover:scale-105 hover:text-primary ease-in-out"
                >
                    <div className="hidden md:flex flex-col items-end text-right">
                        <span className="text-sm font-semibold text-slate-700 leading-none capitalize truncate max-w-[120px]">
                            {userName}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500 mt-1 uppercase tracking-wider truncate max-w-[120px]">
                            {userRole}
                        </span>
                    </div>
                    
                    <div className="w-9 h-9 sm:w-11 sm:h-11 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 shadow-inner group-hover:border-primary transition-all">
                        <span className="font-bold text-primary text-sm sm:text-base">
                            {initials}
                        </span>
                    </div>
                </button>
            </div>
        </header>
    );
};

export default Header;