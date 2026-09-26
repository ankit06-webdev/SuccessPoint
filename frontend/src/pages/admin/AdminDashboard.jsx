import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Bell, ArrowRight, Activity, ShieldCheck, Loader2, FileText } from "lucide-react";
import api from '@/services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalNotices: 0,
        totalAssignments: 0,
        recentNotices: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetching data concurrently for maximum speed including Assignments
            const [usersRes, coursesRes, noticesRes, assignmentsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/courses/'),
                api.get('/notice'),
                api.get('/assignments') // Fetching assignments data
            ]);

            setStats({
                totalUsers: usersRes.data.length || 0,
                totalCourses: coursesRes.data.length || 0,
                totalNotices: noticesRes.data.length || 0,
                totalAssignments: assignmentsRes.data.length || 0,
                // Grab the 3 most recent notices for the dashboard feed
                recentNotices: noticesRes.data.slice(0, 5) || []
            });
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
                <p className="text-lg font-medium">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="p-16 pt-5 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header Section
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        Dashboard Overview <Activity className="w-6 h-6 text-blue-600" />
                    </h1>
                    <p className="text-base text-slate-500 mt-1">
                        Welcome back! Here is what's happening in your system today.
                    </p>
                </div>
            </div> */}

            {/* --- STATS GRID --- */}
            {/* Adjusted grid to handle 4 cards elegantly */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Users Stat Card */}
                 <Card className="border-transparent border cursor-pointer bg-primary/10 md:min-h-[200px] rounded-md text-neutral overflow-hidden relative px-4 py-6 flex flex-col justify-between hover:shadow-2xl hover:border hover:border-primary  transition-all duration-300">
                    <CardHeader className="pb-2 flex items-center justify-between ">
                        <CardTitle className="font-semibold text-3xl capitalize">Total Users</CardTitle>

                        <Users className="w-8 h-8 text-primary" strokeWidth={2.5} />

                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-extrabold">{stats.totalUsers}</div>
                        <p className=" text-xs mt-4 uppercase">accounts registered </p>
                    </CardContent>
                </Card>

                {/* Courses Stat Card */}
                 <Card className="border-transparent border cursor-pointer bg-primary/10 md:min-h-[200px] rounded-md text-neutral overflow-hidden relative px-4 py-6 flex flex-col justify-between hover:shadow-2xl hover:border hover:border-primary  transition-all duration-300">
                    <CardHeader className="pb-2 flex items-center justify-between ">
                        <CardTitle className="font-semibold text-3xl capitalize">Active Courses</CardTitle>

                        <BookOpen className="w-8 h-8 text-primary" strokeWidth={2.5} />

                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-extrabold">{stats.totalCourses}</div>
                        <p className=" text-xs mt-4 uppercase">courses currently running</p>
                    </CardContent>
                </Card>

                {/* Assignments Stat Card */}
                 <Card className="border-transparent border cursor-pointer bg-primary/10 md:min-h-[200px] rounded-md text-neutral overflow-hidden relative px-4 py-6 flex flex-col justify-between hover:shadow-2xl hover:border hover:border-primary  transition-all duration-300">
                    <CardHeader className="pb-2 flex items-center justify-between ">
                        <CardTitle className="font-semibold text-3xl capitalize">Assignments</CardTitle>

                        <FileText className="w-8 h-8 text-primary" strokeWidth={2.5} />

                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-extrabold">{stats.totalAssignments}</div>
                        <p className=" text-xs mt-4 uppercase">tasks & tests</p>
                    </CardContent>
                </Card>

                {/* Notices Stat Card */}
                <Card className="border-transparent border cursor-pointer bg-primary/10 md:min-h-[200px] rounded-md text-neutral overflow-hidden relative px-4 py-6 flex flex-col justify-between hover:shadow-2xl hover:border hover:border-primary  transition-all duration-300">
                    <CardHeader className="pb-2 flex items-center justify-between ">
                        <CardTitle className="font-semibold text-3xl capitalize">Notices</CardTitle>

                        <Bell className="w-8 h-8 text-primary" strokeWidth={2.5} />

                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-extrabold">{stats.totalNotices}</div>
                        <p className=" text-xs mt-4 uppercase">system broadcasts</p>
                    </CardContent>
                </Card>
                
            </div>

            {/* --- BOTTOM GRID: RECENT ACTIVITY & QUICK ACTIONS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 items-start gap-6">

                {/* Recent Announcements (Takes up 2 columns on large screens) */}
                <Card className="lg:col-span-2 h-fit rounded-t-md bg-primary/10 pt-0">
                    <CardHeader className="bg-primary/11 rounded-t-md p-4 ">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 ">
                                    <Bell className="w-8 h-8 text-primary" />
                                </div>
                                <CardTitle className="text-2xl text-neutral">Recent Announcements</CardTitle>
                            </div>
                            <Button
                                
                                size="sm"
                                className="text-primary bg-transparent hover:bg-transparent hover:scale-115 transition-all duration-300 cursor-pointer"
                                onClick={() => window.location.href = '/admin-dashboard/anouncements'}
                            >
                                View All <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 ">
                        {stats.recentNotices.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <Bell className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                                <p>No announcements found.</p>
                            </div>
                        ) : (
                            <div className="">
                                {stats.recentNotices.map((notice) => (
                                    <div key={notice._id} className="m-5 rounded-md border border-transparent bg-white p-5 transition-all duration-300 hover:border-primary hover:shadow-lg cursor-pointer">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-semibold text-slate-900">{notice.title}</h4>
                                            <span className="text-xs font-medium text-primary whitespace-nowrap ml-4">
                                                {formatDate(notice.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 line-clamp-2 mt-1">
                                            {notice.content}
                                        </p>
                                        <div className="mt-3">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                                                Target: {notice.targetType}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions (Takes up 1 column) */}
                <Card className="h-fit rounded-t-md bg-primary/10 pt-0 border-transparent">
                    <CardHeader className="bg-primary/11 rounded-t-md p-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5">
                                <ShieldCheck className="w-8 h-8 text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <CardTitle className="text-2xl text-neutral">Quick Actions</CardTitle>
                                {/* <CardDescription className="text-neutral/70 text-sm mt-0.5">Shortcut links to system tools.</CardDescription> */}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4">
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-5 h-20 bg-white border border-transparent text-neutral hover:border-primary hover:shadow-lg transition-all duration-300 rounded-md px-5"
                            onClick={() => window.location.href = '/admin-dashboard/manage-users'}
                        >
                            <div className="bg-primary text-white p-2 rounded">
                            <Users className="w-5 h-5" strokeWidth={2.5} />
                            </div>
                            <span className="font-semibold text-base">Manage System Users</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-5 h-20 bg-white border border-transparent text-neutral hover:border-primary hover:shadow-lg transition-all duration-300 rounded-md px-5"
                            onClick={() => window.location.href = '/admin-dashboard/manage-courses'}
                        >
                            <div className="bg-primary text-white p-2 rounded">
                            <BookOpen className="w-5 h-5" strokeWidth={2.5} />
                            </div>
                            <span className="font-semibold text-base">Manage Active Courses</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-5 h-20 bg-white border border-transparent text-neutral hover:border-primary hover:shadow-lg transition-all duration-300 rounded-md px-5"
                            onClick={() => window.location.href = '/admin-dashboard/manage-assignments'}
                        >
                            <div className="bg-primary text-white p-2 rounded">
                            <FileText className="w-5 h-5" strokeWidth={2.5}/>
                            </div>
                            <span className="font-semibold text-base">Manage Assignments</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-5 h-20 bg-white border border-transparent text-neutral hover:border-primary hover:shadow-lg transition-all duration-300 rounded-md px-5"
                            onClick={() => window.location.href = '/admin-dashboard/anouncements'}
                        >
                            <div className="bg-primary text-white p-2 rounded">
                                <Bell className="w-5 h-5" strokeWidth={2.5}/>
                            </div>
                            <span className="font-semibold text-base">Publish New Notice</span>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;