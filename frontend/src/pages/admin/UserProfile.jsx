import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, Shield, User, BookOpen, Briefcase } from "lucide-react";

const UserProfile = ({ user, onBack }) => {
    
    const getRoleStyle = (role) => {
        const lowerRole = role?.toLowerCase();
        if (lowerRole === 'admin') return "bg-purple-100 text-purple-700";
        if (lowerRole === 'teacher') return "bg-blue-100 text-blue-700";
        return "bg-emerald-100 text-emerald-700"; 
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Bar with Back Button */}
            <div className="flex items-center gap-4">
                <Button 
                    variant="outline" 
                    onClick={onBack}
                    className="flex items-center gap-2 hover:bg-slate-100"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Users
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Profile</h1>
                    <p className="text-sm text-slate-500">Detailed view of the user's account information.</p>
                </div>
            </div>

            {/* Main Profile Card */}
            <Card className="border-slate-200 shadow-sm overflow-hidden max-w-4xl m-auto mt-20">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 pb-8 pt-8">
                    <div className="flex items-center gap-6">
                        {/* Big Avatar */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border-4 border-white shadow-lg flex items-center justify-center text-blue-700 font-bold text-4xl uppercase">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-bold text-slate-900">{user.name}</CardTitle>
                            <CardDescription className="mt-2 flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getRoleStyle(user.role)}`}>
                                    {user.role}
                                </span>
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Basic Info Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-2">Contact Information</h3>
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-50 rounded-lg"><Mail className="w-5 h-5 text-slate-500" /></div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Email Address</p>
                                        <p className="text-base font-semibold text-slate-900">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-50 rounded-lg"><Phone className="w-5 h-5 text-slate-500" /></div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Mobile Number</p>
                                        <p className="text-base font-semibold text-slate-900">{user.profileDetails?.phone || 'Not Provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Role Specific Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-2">Role Details</h3>
                            
                            {user.role === 'student' && (
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-50 rounded-lg"><User className="w-5 h-5 text-emerald-600" /></div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Father's Name</p>
                                            <p className="text-base font-semibold text-slate-900">{user.parentDetails?.fatherName || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-50 rounded-lg"><Phone className="w-5 h-5 text-emerald-600" /></div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Parent Contact</p>
                                            <p className="text-base font-semibold text-slate-900">{user.parentDetails?.primaryContactNumber || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {user.role === 'teacher' && (
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg"><BookOpen className="w-5 h-5 text-blue-600" /></div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Subjects Taught</p>
                                            <p className="text-base font-semibold text-slate-900">{user.subjectsTaught?.join(', ') || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg"><Briefcase className="w-5 h-5 text-blue-600" /></div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Experience</p>
                                            <p className="text-base font-semibold text-slate-900">{user.experienceInYears ? `${user.experienceInYears} Years` : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {user.role === 'admin' && (
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-50 rounded-lg"><Shield className="w-5 h-5 text-purple-600" /></div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Admin Level</p>
                                            <p className="text-base font-semibold text-slate-900">Level {user.adminLevel || 1}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserProfile;