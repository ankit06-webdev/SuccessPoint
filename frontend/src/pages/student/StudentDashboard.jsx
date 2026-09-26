import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Bell, BookOpen, FileText, AlertCircle, IndianRupee, 
    ChevronRight, Clock, Loader2, Calendar 
} from "lucide-react";
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {

    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true);

    const [studentData, setStudentData] = useState({
        name: "Student",
        pendingFees: 0,
        activeCourses: 0,
    });

    const [recentNotices, setRecentNotices] = useState([]);
    const [recentAssignments, setRecentAssignments] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            // Fetching data from your specific authenticated endpoints
            const [profileRes, noticesRes, assignmentsRes] = await Promise.all([
                api.get('/auth/me'), 
                api.get('/notice/'),        
                api.get('/assignments') // Assumes assignmentRoutes is mounted at /assignment
            ]);

            const profile = profileRes.data;
            const notices = noticesRes.data;
            const assignments = assignmentsRes.data;

            // Calculate pending fees safely based on your schema
             const totalFees = profile.feesDetails?.totalFees || profile.enrolledCourses?.price;

            const receiptsRes = await api.get('/payment/my-receipts');
            const fetchedReceipts = receiptsRes.data;
            const calculatedPaidAmount = fetchedReceipts.reduce((sum, receipt) => sum + receipt.amountPaid, 0);
            const pendingAmount = totalFees - calculatedPaidAmount;

            setStudentData({
                name: profile.name || "Student",
                pendingFees: pendingAmount > 0 ? pendingAmount : 0,
                activeCourses: profile.enrolledCourses?.length || 0,
            });

            // Keep UI clean by showing only the latest items
            setRecentNotices(notices.slice(0, 3));
            setRecentAssignments(assignments.slice(0, 3));

        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <p className="font-medium text-slate-600">Syncing your portal...</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
            
            {/* 1. Header Section */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    Welcome back, {studentData.name}! 👋
                </h1>
                <p className="text-sm text-slate-500 mt-1">Here is your academic overview for today.</p>
            </div>

            {/* 2. Fee Alert (Displays only if dues exist) */}
            {studentData.pendingFees > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start sm:items-center gap-4 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <div className="p-2 bg-red-100 rounded-full shrink-0">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-red-800 font-semibold text-sm sm:text-base">Pending Fee Reminder</h3>
                        <p className="text-red-600 text-xs sm:text-sm mt-0.5">
                            You have an outstanding balance of <span className="font-bold">₹{studentData.pendingFees}</span>.
                        </p>
                    </div>
                    <Button 
                    variant="outline" 
                    className="hidden sm:flex border-red-200 text-red-700 hover:bg-red-100 h-9"
                    onClick={()=>(navigate('/student-dashboard/pay-fees'))}
                    >
                        Pay Now
                    </Button>
                </div>
            )}

            {/* 3. Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg"><BookOpen className="w-5 h-5 text-blue-600" /></div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">{studentData.activeCourses}</h3>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">Enrolled Courses</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-orange-100 rounded-lg"><FileText className="w-5 h-5 text-orange-600" /></div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">{recentAssignments.length}</h3>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">Recent Assignments</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow col-span-2 md:col-span-1">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-emerald-100 rounded-lg"><IndianRupee className="w-5 h-5 text-emerald-600" /></div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">₹{studentData.pendingFees}</h3>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">Total Dues</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 4. Notice Board Panel */}
                <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                    <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                            <Bell className="w-5 h-5 text-blue-600" /> Notice Board
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-y-auto">
                        <div className="divide-y divide-slate-100">
                            {recentNotices.length === 0 ? (
                                <div className="p-8 text-center text-slate-500"><p>No new notices</p></div>
                            ) : (
                                recentNotices.map((notice) => (
                                    <div key={notice._id} className="p-4 hover:bg-slate-50 transition-colors">
                                        <h4 className="text-sm font-semibold text-slate-800">{notice.title}</h4>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {formatDate(notice.createdAt)}
                                            </span>
                                            {/* Renders badge based on targetType from backend schema */}
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                                notice.targetType === 'ALL' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                                {notice.targetType === 'ALL' ? 'Broadcast' : 'Course'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* 5. Recent Assignments Panel */}
                <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                    <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                            <FileText className="w-5 h-5 text-orange-600" /> Recent Homework
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-y-auto">
                        <div className="divide-y divide-slate-100">
                            {recentAssignments.length === 0 ? (
                                <div className="p-8 text-center text-slate-500"><p>No pending homework</p></div>
                            ) : (
                                recentAssignments.map((assignment) => (
                                    <div key={assignment._id} className="p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-800">{assignment.title}</h4>
                                                {/* Displays course title mapped from backend population */}
                                                <p className="text-xs text-slate-500 mt-1">{assignment.course?.title || 'General'}</p>
                                            </div>
                                            {/* Renders total marks directly from assignment schema[cite: 10] */}
                                            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md shrink-0">
                                                {assignment.totalMarks} Marks
                                            </span>
                                        </div>
                                        {assignment.dueDate && (
                                            <div className="flex items-center gap-1 mt-3 text-xs font-medium text-orange-600 bg-orange-50 w-max px-2 py-1 rounded-md">
                                                <Calendar className="w-3 h-3" /> Due: {formatDate(assignment.dueDate)}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default StudentDashboard;