import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, BookOpen, Bell, CreditCard, BookOpenCheck, FileText,
    FileEdit, Megaphone, Users, GraduationCap, Wallet, User, Settings, LogOut, ChevronRight, BookMarked, X
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import api from '@/services/api';

const Sidebar = ({ isOpen, setIsOpen }) => {
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

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.log(error);
        }
        dispatch(logout());
        navigate('/login');
    };

    const handleLinkClick = () => {
        if (window.innerWidth < 768 && setIsOpen) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Overlay Background (z-50 taaki header ke upar aaye) */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container (z-[60] taaki sabse upar rahe) */}
            <aside className={`fixed top-0 left-0 w-72 h-screen bg-white md:bg-transparent border-r md:border-none border-[#e4e1ee] flex flex-col justify-between shrink-0 z-[60] pt-3 transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                <div className='h-18 flex items-center justify-between px-6 border-b border-gray-300/60 shrink-0 pb-3'>
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 text-primary rounded-lg shadow-inner">
                            <BookOpenCheck />
                        </div>
                        <div>
                            <h2 className='font-black text-2xl text-neutral font-body'>Success Point</h2>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="md:hidden p-1.5 text-slate-500 hover:bg-slate-200 rounded-md transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
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
                                            onClick={handleLinkClick}
                                            className={({ isActive }) => `
                                                group flex items-center justify-between px-3 py-3 rounded-md font-medium transition-all duration-100 
                                                ${isActive
                                                    ? 'bg-primary text-white border relative overflow-hidden'
                                                    : 'text-slate-600 hover:bg-primary/20 hover:text-primary hover:translate-x-1'
                                                }
                                            `}
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"></div>}
                                                    <div className="flex items-center gap-3 z-10">
                                                        <Icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-900 group-hover:text-primary'}`} />
                                                        <span className="text-md tracking-wide">{option.name}</span>
                                                    </div>
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

                {/* Bottom Section: Premium Profile Card (bg-white md:bg-transparent kar diya) */}
                <div className='p-4 shrink-0 border-t border-gray-300/60 bg-white md:bg-transparent'>
                    <button className='w-full flex items-center gap-3 px-3 py-2.5 mb-3 rounded-lg font-medium text-slate-700 transition-colors duration-200 hover:bg-primary/20 hover:text-primary group'>
                        <Settings className="w-5 h-5 text-slate-900 group-hover:text-primary" />
                        <span className="text-sm">Settings</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className='w-full'
                        title="Logout"
                    >
                        <div className='flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-red-700 hover:bg-red-200 transition-colors duration-200'>
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm">Logout</span>
                        </div>
                    </button>
                </div>

            </aside>
        </>
    );
}

export default Sidebar;