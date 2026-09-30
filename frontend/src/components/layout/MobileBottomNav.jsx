import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, Users, Settings, Bell, FileText } from 'lucide-react';
import { useSelector } from 'react-redux';

const MobileBottomNav = () => {
    const user = useSelector((state) => state.auth.user);
    const role = user?.role;

    // We select the top 4 primary routes for each role to fit the mobile tab bar
    const adminOptions = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/admin-dashboard" },
        { name: "Courses", icon: GraduationCap, path: "/admin-dashboard/manage-courses" },
        { name: "Users", icon: Users, path: "/admin-dashboard/manage-users" },
        { name: "Settings", icon: Settings, path: "/profile" } // Update to your actual settings path
    ];

    const studentOptions = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/student-dashboard" },
        { name: "Tasks", icon: FileText, path: "/student-dashboard/assignments" },
        { name: "Notices", icon: Bell, path: "/student-dashboard/notices" },
        { name: "Settings", icon: Settings, path: "/profile" }
    ];

    const teacherOptions = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/teacher-dashboard" },
        { name: "Tasks", icon: FileText, path: "/teacher-dashboard/manage-assignments" },
        { name: "Notices", icon: Bell, path: "/teacher-dashboard/announcements" },
        { name: "Settings", icon: Settings, path: "/profile" }
    ];

    const navOptions = role === 'admin' ? adminOptions : role === 'student' ? studentOptions : teacherOptions;

    return (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[#e4e1ee] z-50 pb-safe pt-1 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
            <nav className="flex items-center justify-around h-16 px-2">
                {navOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                        <NavLink
                            key={option.name}
                            to={option.path}
                            end={option.path === "/admin-dashboard" || option.path === "/student-dashboard" || option.path === "/teacher-dashboard"}
                            className={({ isActive }) => `
                                flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-colors duration-200
                                ${isActive ? 'text-[#3525cd]' : 'text-[#777587] hover:text-[#1b1b24]'}
                            `}
                        >
                            <Icon className="w-6 h-6" strokeWidth={2} />
                            <span className="text-[11px] font-medium tracking-wide">{option.name}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </div>
    );
};

export default MobileBottomNav;