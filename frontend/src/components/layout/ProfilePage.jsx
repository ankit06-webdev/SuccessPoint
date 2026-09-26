import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from 'react-redux';
import { authSlice } from '@/features/auth/authSlice';
import {
    Loader2, User, Mail, Phone, MapPin, ShieldCheck,
    BookOpen, GraduationCap, Briefcase, Calendar,
    IndianRupee, ArrowLeft, Settings, Clock
} from 'lucide-react';
import api from '@/services/api';

const ProfilePage = () => {

    // const {user} = useSelector()
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [feeStats, setFeeStats] = useState({ total: 0, paid: 0, pending: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeeDetails = async () => {
            setIsLoading(true);
            try {
                const profileRes = await api.get('/auth/me');
                const profile = profileRes.data;

                const totalFees = profile.feesDetails?.totalFees || 0;

                const receiptsRes = await api.get('/payment/my-receipts');
                const fetchedReceipts = receiptsRes.data;
                

                const calculatedPaidAmount = fetchedReceipts.reduce((sum, receipt) => sum + receipt.amountPaid, 0);
                const pendingAmount = totalFees - calculatedPaidAmount;

                setFeeStats({
                    total: totalFees,
                    paid: calculatedPaidAmount,
                    pending: pendingAmount > 0 ? pendingAmount : 0
                });

            } catch (error) {
                console.error("Failed to fetch fee details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchMyDetails = async () => {
            try {
                const response = await api.get('/auth/me');
                setUserData(response.data);

            } catch (error) {
                console.error("Failed to fetch profile data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyDetails();
        fetchFeeDetails()
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
    };

    const getRoleBadgeColor = (role) => {
        const r = role?.toLowerCase();
        if (r === 'admin') return 'bg-purple-100 text-purple-700 border-purple-200';
        if (r === 'teacher') return 'bg-blue-100 text-blue-700 border-blue-200';
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <p className="text-slate-500 font-medium">Loading your profile details...</p>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full text-slate-500 space-y-4">
                <ShieldCheck className="w-16 h-16 text-slate-300" />
                <p className="text-lg font-medium text-slate-700">Profile data not found.</p>
                <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        );
    }

    const { role, profileDetails, parentDetails, feesDetails } = userData;

    return (
        // 🔴 Root Container: Ab yahan h-full aur overflow-y-auto laga diya gaya hai taaki poora component ek saath scroll ho
        <div className="w-full h-full overflow-y-auto bg-slate-50/30 p-4 sm:p-6">

            {/* Inner Content Wrapper */}
            <div className="max-w-5xl mx-auto space-y-6 pb-12">

                {/* Top Action Bar */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 -ml-2">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Button>
                    <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                        <Settings className="w-4 h-4 mr-2" /> Edit Profile
                    </Button>
                </div>

                {/* Profile Cover & Header Card */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative">
                    {/* Cover Banner */}
                    <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 w-full relative">
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
                    </div>

                    <div className="px-6 pb-6 sm:px-10 sm:pb-8 relative">
                        {/* Avatar Profile Picture */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-end sm:justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4">
                                <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-5xl font-bold text-slate-400 shadow-lg relative z-10 overflow-hidden bg-gradient-to-br from-white to-slate-100">
                                    {userData.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="pt-2">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{userData.name}</h1>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getRoleBadgeColor(role)}`}>
                                            {role} Account
                                        </span>
                                        <span className="text-sm text-slate-500 flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" /> Joined {formatDate(userData.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Contact & Basic Info */}
                    <div className="space-y-6">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-600" /> Personal Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Email Address</p>
                                        <p className="text-sm font-medium text-slate-900">{userData.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Mobile Number</p>
                                        <p className="text-sm font-medium text-slate-900">{profileDetails?.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Address</p>
                                        <p className="text-sm font-medium text-slate-900">{profileDetails?.address || 'Not provided'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security Card */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800">Account Security</h3>
                                        <p className="text-xs text-slate-500">Manage your password</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full text-xs font-semibold h-9 border-slate-300">
                                    Change Password
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Role Specific Details */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* STUDENT DETAILS */}
                        {role === 'student' && (
                            <>
                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <GraduationCap className="w-5 h-5 text-emerald-600" /> Academic Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Father's Name</p>
                                                <p className="text-sm font-medium text-slate-900">{parentDetails?.fatherName || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Parent Contact No.</p>
                                                <p className="text-sm font-medium text-slate-900">{parentDetails?.primaryContactNumber || 'N/A'}</p>
                                            </div>
                                            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Enrolled Courses</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {userData.enrolledCourses && userData.enrolledCourses.length > 0 ? (
                                                        userData.enrolledCourses.map((course, idx) => (
                                                            <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-sm font-medium">
                                                                <BookOpen className="w-3.5 h-3.5" />
                                                                {course.title || course.name || 'Course Enrolled'}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-sm text-slate-500 italic">No courses assigned yet.</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200 shadow-sm overflow-hidden">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <IndianRupee className="w-5 h-5 text-orange-600" /> Fee Overview
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="grid grid-cols-3 divide-x divide-slate-100">
                                            <div className="p-5 text-center bg-white hover:bg-slate-50 transition-colors">
                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Fee</p>
                                                <p className="text-xl font-bold text-slate-900">{formatCurrency(feeStats.total)}</p>
                                            </div>
                                            <div className="p-5 text-center bg-emerald-50/30 hover:bg-emerald-50/60 transition-colors">
                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Paid</p>
                                                <p className="text-xl font-bold text-emerald-600">{formatCurrency(feeStats?.paid)}</p>
                                            </div>
                                            <div className="p-5 text-center bg-red-50/30 hover:bg-red-50/60 transition-colors">
                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Pending</p>
                                                <p className="text-xl font-bold text-red-600">
                                                    {formatCurrency(feeStats.pending)}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        {/* TEACHER DETAILS */}
                        {role === 'teacher' && (
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Briefcase className="w-5 h-5 text-indigo-600" /> Professional Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Experience</p>
                                            <p className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                {userData.experienceInYears} Years
                                            </p>
                                        </div>
                                        <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Subjects Taught</p>
                                            <div className="flex flex-wrap gap-2">
                                                {userData.subjectsTaught && userData.subjectsTaught.length > 0 ? (
                                                    userData.subjectsTaught.map((subject, idx) => (
                                                        <span key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md text-sm font-medium">
                                                            <BookOpen className="w-3.5 h-3.5" /> {subject}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-slate-500 italic">No subjects assigned yet.</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* ADMIN DETAILS */}
                        {role === 'admin' && (
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-purple-600" /> Administrator Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-5">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Admin Privilege Level</p>
                                        <p className="text-sm font-medium text-slate-900">
                                            Level {userData.adminLevel || 1}
                                            <span className="ml-2 text-xs text-slate-500 font-normal">
                                                (Super Admin Access)
                                            </span>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;