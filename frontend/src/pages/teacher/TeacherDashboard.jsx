import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    BookOpen, 
    Bell, 
    FileText, 
    PlusCircle, 
    Loader2, 
    Calendar,
    ArrowRight,
    Megaphone
} from "lucide-react";
import api from '@/services/api';

const TeacherDashboard = () => {
    const authUser = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        myAssignments: 0,
        myNotices: 0
    });
    const [recentNotices, setRecentNotices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            // Fetch both assignments and notices to calculate stats
            const [assignmentsRes, noticesRes] = await Promise.all([
                api.get('/assignments'),
                api.get('/notice')
            ]);

            const allAssignments = assignmentsRes.data || [];
            const allNotices = noticesRes.data || [];

            // Filter data specific to this teacher
            const myAssignmentsCount = allAssignments.filter(
                a => a.createdBy?._id === authUser?.id || a.createdBy === authUser?.id
            ).length;

            const visibleNotices = allNotices.filter(
                n => n.targetType === 'ALL' || n.createdBy?._id === authUser?.id || n.createdBy === authUser?.id
            );

            const myNoticesCount = allNotices.filter(
                n => n.createdBy?._id === authUser?.id || n.createdBy === authUser?.id
            ).length;

            setStats({
                myAssignments: myAssignmentsCount,
                myNotices: myNoticesCount
            });

            // Get top 3 latest notices for the feed
            setRecentNotices(visibleNotices.slice(0, 3));

        } catch (error) {
            console.error("Failed to fetch teacher dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-IN', { 
            day: 'numeric', month: 'short', year: 'numeric' 
        });
    };

    return (
        <div className="flex flex-col h-full p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
            
            {/* Welcome Banner */}
            <div className="shrink-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="relative z-10">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                        Welcome back, {authUser?.name || 'Teacher'}! 👋
                    </h1>
                    <p className="text-blue-100 max-w-xl text-sm sm:text-base leading-relaxed">
                        Ready to inspire your students today? Manage your course assignments, post important announcements, and keep your batches on track.
                    </p>
                </div>
                <div className="relative z-10 flex flex-wrap gap-3 w-full md:w-auto">
                    <Button 
                        onClick={() => navigate('/teacher-dashboard/manage-assignments')}
                        className="bg-white text-blue-700 hover:bg-blue-50 font-semibold flex-1 md:flex-none shadow-sm"
                    >
                        <PlusCircle className="w-4 h-4 mr-2" /> Assignment
                    </Button>
                    <Button 
                        onClick={() => navigate('/teacher-dashboard/announcements')}
                        className="bg-blue-800/40 text-white hover:bg-blue-800/60 backdrop-blur-sm border border-blue-400/30 font-semibold flex-1 md:flex-none"
                    >
                        <Megaphone className="w-4 h-4 mr-2" /> Notice
                    </Button>
                </div>
                {/* Decorative background circle */}
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-4 space-y-6">
                
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                        <p className="font-medium text-slate-600">Loading your workspace...</p>
                    </div>
                ) : (
                    <>
                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-5 sm:p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-1">My Assignments</p>
                                        <h3 className="text-3xl font-bold text-slate-900">{stats.myAssignments}</h3>
                                        <p className="text-xs text-slate-400 mt-1">Active tasks published</p>
                                    </div>
                                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                                        <BookOpen className="w-7 h-7 text-blue-600" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-5 sm:p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-1">My Notices</p>
                                        <h3 className="text-3xl font-bold text-slate-900">{stats.myNotices}</h3>
                                        <p className="text-xs text-slate-400 mt-1">Announcements created</p>
                                    </div>
                                    <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <Megaphone className="w-7 h-7 text-indigo-600" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200 shadow-sm sm:col-span-2 lg:col-span-1 bg-slate-50">
                                <CardContent className="p-5 sm:p-6 flex flex-col justify-center h-full">
                                    <h3 className="text-sm font-bold text-slate-800 mb-2">Need Help?</h3>
                                    <p className="text-xs text-slate-500 mb-4">
                                        If you face any issues assigning homework or uploading resources, please contact the institute admin.
                                    </p>
                                    <Button variant="outline" className="w-full text-xs font-semibold" onClick={() => navigate('/profile')}>
                                        View Profile
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Notices Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-slate-500" /> Recent Updates
                                </h2>
                                <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0 h-auto" onClick={() => navigate('/teacher-dashboard/announcements')}>
                                    View All <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                            
                            {recentNotices.length === 0 ? (
                                <Card className="border-dashed shadow-none bg-slate-50">
                                    <CardContent className="flex flex-col items-center justify-center py-10 text-slate-500 text-center">
                                        <Bell className="w-8 h-8 mb-3 text-slate-300" />
                                        <p className="text-sm">No recent announcements found.</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {recentNotices.map((notice) => (
                                        <Card key={notice._id} className="border-slate-200 shadow-sm hover:border-blue-200 transition-colors cursor-pointer group" onClick={() => navigate('/teacher-dashboard/announcements')}>
                                            <CardHeader className="p-4 pb-2">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${notice.targetType === 'ALL' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                        {notice.targetType === 'ALL' ? 'Broadcast' : 'Course Notice'}
                                                    </span>
                                                </div>
                                                <CardTitle className="text-base text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                    {notice.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0">
                                                <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                                                    {notice.content}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {formatDate(notice.createdAt)}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;