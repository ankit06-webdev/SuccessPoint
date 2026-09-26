import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import api from '@/services/api';
import { LogOut, Home, ChevronDown } from 'lucide-react';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux store se user ka data fetch karna
    const user = useSelector((state) => state.auth.user);

    // Fallbacks if data is missing
    const userName = user?.name || user?.role || 'User';
    const userRole = user?.role || 'Member';

    return (
        <header className="bg-white backdrop-blur-md h-18 px-6 lg:px-4 flex items-center justify-between rounded-tl-xl mt-4 shrink-0 sticky top-2 z-40">

            {/* Left Side: Welcome Message */}
            <div className="flex justify-center items-center gap-3 sm:gap-4">
                {/* Home Button */}
                <div className="flex items-center">

                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center sm:w-10 sm:h-10 hover:text-blue-500 transition-all duration-200"
                        title="Home"
                    >
                        <Home className="w-5 h-5" />
                    </button>
                    <p className='text-primary'>/ Dashboard</p>
                </div>
                
            </div>

            <div className="">
                <h2 className="text-base sm:text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                    Welcome back,
                    <span className="text-primary capitalize">
                        {userName.split(' ')[0]} {/* First name */}
                    </span> 
                </h2>
            </div>


            {/* Right Side: Navigation & Profile */}
            <div className="flex items-center gap-2 sm:gap-4 mr-2 sm:mr-4">

                {/* Profile Pill Button */}
                <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-3 p-1 pr-2 sm:pr-3 rounded-full border border-transparent transition-all duration-200 group hover:scale-105 transition delay-10 hover:text-primary duration-300 ease-in-out "
                >
                    
                    <div className="hidden md:flex flex-col items-start text-left ">
                        <span className="text-sm font-semibold  text-slate-700 leading-none capitalize truncate max-w-[120px]">
                            {userName}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500 mt-1 uppercase tracking-wider truncate max-w-[120px]">
                            {userRole}
                        </span>
                    </div>
                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-primary/6 rounded-full flex items-center justify-center border border-primary shadow-inner group-hover:shadow-md transition-all">
                        <span className="font-bold text-primary text-sm sm:text-base">
                            {userName.charAt(0).toUpperCase() + userName.split(' ')[1]?.charAt(0).toUpperCase() || ''}
                        </span>
                    </div>
                    
                </button>



            </div>
        </header>
    );
};

export default Header;