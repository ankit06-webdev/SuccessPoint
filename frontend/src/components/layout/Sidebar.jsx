import React from 'react';
import logo from '../../assets/logo.png';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, BookOpen, Bell, CreditCard, BookOpenCheck, FileText,
    FileEdit, Megaphone, Users, GraduationCap, Wallet, User, Settings, LogOut, ChevronRight, BookMarked
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import api from '@/services/api';

const Sidebar = () => {
    // Fetching user details from Redux to show in the profile card
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    const role = user?.role;
    const navigate = useNavigate();

    const studentOptions = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/student-dashboard" },
        { name: "Assignments", icon: GraduationCap, path: "/student-dashboard/assignments" },
        { name: "Notices", icon: Bell, path: "/student-dashboard/notices" },
        { name: "Pay Fees", icon: CreditCard, path: "/student-dashboard/pay-fees" }
    ];

    const teacherOptions = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/teacher-dashboard" },
        { name: "Manage Assignments", icon: FileEdit, path: "/teacher-dashboard/manage-assignments" },
        { name: "Announcements", icon: Megaphone, path: "/teacher-dashboard/announcements" },
        // { name: "My Students", icon: Users, path: "/teacher-dashboard/my-students" }
    ];

    const adminOptions = [
        { name: "Overview", icon: LayoutDashboard, path: "/admin-dashboard" },
        { name: "Manage Users", icon: Users, path: "/admin-dashboard/manage-users" },
        { name: "Manage Courses", icon: BookMarked, path: "/admin-dashboard/manage-courses" },
        { name: "Assignments", icon: FileText, path: "/admin-dashboard/manage-assignments" },
        { name: "Anouncements", icon: Megaphone, path: "/admin-dashboard/anouncements" },
        { name: "Manage Fees", icon: Wallet, path: "/admin-dashboard/manage-fees" }
    ];

    const roleOptionsMap = {
        student: studentOptions,
        teacher: teacherOptions,
        admin: adminOptions
    };

    const sidebarOptions = roleOptionsMap[role] || [];

    // handleLogout function to log the user out and redirect to login page
    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.log(error);
        }

        // Redux aur localStorage se user ko clear karna
        dispatch(logout());
        // Login page par bhej dena
        navigate('/login');
    };

    return (
        <aside className='fixed top-0 left-0 w-72 h-screen overflow-hidden flex flex-col justify-between shrink-0 z-40 pt-3'>

            {/*Top Section*/}
            <div className='h-18 flex items-center gap-3 px-6 border-b border-gray-300/60 shrink-0'>
                <div className="p-1.5 text-primary rounded-lg shadow-inner">
                    <BookOpenCheck />
                    {/* <img src={logo} className="w-8 h-8 object-contain" alt="Success Point Logo" /> */}
                </div>
                <div>
                    <h2 className='font-black text-2xl text-neutral font-body'>Success Point</h2>
                    {/* <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{role} Portal</p> */}
                </div>
            </div>

            <div className='custom-scrollbar flex-1 overflow-y-auto px-4 py-6 space-y-1.5'>
                <nav>
                    <ul className='space-y-1.5'>
                        {sidebarOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                                <li key={option.name}>
                                    <NavLink
                                        to={option.path}
                                        end={option.path === "/admin-dashboard" || option.path === "/student-dashboard" || option.path === "/teacher-dashboard"}
                                        className={({ isActive }) => `
                                            group flex items-center justify-between px-3 py-3 rounded-md font-medium transition-all duration-100 
                                            ${isActive
                                                ? 'bg-primary text-white border relative overflow-hidden'
                                                : 'text-slate-600 hover:bg-primary/20 hover:text-primary hover:translate-x-1'
                                            }
                                        `}
                                    >
                                        {/* Left Active Indicator Bar */}
                                        {({ isActive }) => (
                                            <>
                                                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md]"></div>}
                                                <div className="flex items-center gap-3 z-10">
                                                    <Icon className={`w-5 h-5 transition-colors duration-300  ${isActive ? 'text-white' : 'text-slate-900 group-hover:text-primary'}`} />
                                                    <span className="text-md tracking-wide">{option.name}</span>
                                                </div>
                                                {/* Chevron icon for a modern touch */}
                                                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'opacity-100 text-white' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary'}`} />
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </div>

            {/* 🔴 Bottom Section: Premium Profile Card */}
            <div className='p-4 shrink-0 border-t border-gray-300/60 '>

                {/* Settings Link */}
                <button className='w-full flex items-center gap-3 px-3 py-2.5 mb-3 rounded-lg font-medium text-slate-700 transition-colors duration-200 hover:bg-primary/20 hover:text-primary group'>
                    <Settings className="w-5 h-5 text-slate-900 group-hover:text-primary" />
                    <span className="text-sm">Settings</span>
                </button>

                {/* Profile Widget */}
                <button
                    onClick={handleLogout}
                    className='w-full'
                    title="Logout"
                >
                    <div className='flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-red-700  hover:bg-red-200 transition-colors duration-1000'>

                        <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                        Logout
                    </div>
                </button>
            </div>

        </aside>
    );
}

export default Sidebar;