import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { UserPlus, Loader2, Pencil, Trash2, AlertTriangle, Bell, Eye, Search, User, Filter, Users, ShieldCheck, GraduationCap, BookOpen } from "lucide-react";
import api from '@/services/api';
import UserProfile from './UserProfile';

const ManageUsers = () => {
    // State Management[cite: 8]
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: '', role: 'student',
        fatherName: '', parentPhone: '', subjectsTaught: '', experienceInYears: '', adminLevel: 1, enrolledCourses: [],
        feeType: 'YEARLY', baseAmount: '', totalFees: ''
    });

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            const [usersRes, coursesRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/courses')
            ]);
            setUsers(usersRes.data);
            setCourses(coursesRes.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Design System Mappings[cite: 3]
    const getRoleBadgeStyle = (role) => {
        const lowerRole = role?.toLowerCase();
        if (lowerRole === 'admin') return "bg-[#e2dfff] text-[#3323cc] border-[#c3c0ff]";
        if (lowerRole === 'teacher') return "bg-[#ffdbcc] text-[#7b2f00] border-[#ffb695]";
        return "bg-[#eae6f4] text-[#464555] border-[#c7c4d8]";
    };

    const getAvatarStyle = (role) => {
        const lowerRole = role?.toLowerCase();
        if (lowerRole === 'admin') return "bg-[#3525cd] text-[#ffffff]";
        if (lowerRole === 'teacher') return "bg-[#7e3000] text-[#ffffff]";
        return "bg-[#e4e1ee] text-[#1b1b24]";
    };

    // Form Handling[cite: 8]
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            name: '', email: '', phone: '', password: '', role: 'student',
            fatherName: '', parentPhone: '', subjectsTaught: '', experienceInYears: '', adminLevel: 1, enrolledCourses: [],
            feeType: 'YEARLY', baseAmount: '', totalFees: ''
        });
        setEditId(null);
    };

    const openEditModal = (user) => {
        setEditId(user._id);
        setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.profileDetails?.phone || '',
            password: '',
            role: user.role || 'student',
            fatherName: user.parentDetails?.fatherName || '',
            parentPhone: user.parentDetails?.primaryContactNumber || '',
            subjectsTaught: user.subjectsTaught ? user.subjectsTaught.join(', ') : '',
            experienceInYears: user.experienceInYears || '',
            adminLevel: user.adminLevel || 1,
            enrolledCourses: user.enrolledCourses || [],
            feeType: user.feesDetails?.feeType || 'YEARLY',
            baseAmount: user.feesDetails?.baseAmount || '',
            totalFees: user.feesDetails?.totalFees || ''
        });
        setIsDialogOpen(true);
    };

    const handleSubmitUser = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const submitData = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                profileDetails: { phone: formData.phone }
            };

            if (!editId || formData.password) {
                submitData.password = formData.password;
            }

            if (formData.role === 'student') {
                submitData.parentDetails = {
                    fatherName: formData.fatherName,
                    primaryContactNumber: formData.parentPhone
                };
                submitData.enrolledCourses = formData.enrolledCourses;
                submitData.feesDetails = {
                    feeType: formData.feeType,
                    baseAmount: Number(formData.baseAmount),
                    totalFees: Number(formData.totalFees)
                };
            } else if (formData.role === 'teacher') {
                submitData.subjectsTaught = formData.subjectsTaught.split(',').map(s => s.trim());
                submitData.experienceInYears = Number(formData.experienceInYears);
            } else if (formData.role === 'admin') {
                submitData.adminLevel = Number(formData.adminLevel);
            }

            if (editId) {
                await api.put(`/admin/users/${editId}`, submitData);
                setUsers(prev => prev.map(user =>
                    user._id === editId ? { ...user, ...submitData, profileDetails: submitData.profileDetails, feesDetails: submitData.feesDetails } : user
                ));
            } else {
                const response = await api.post('/auth/register', submitData);
                const returnedUser = response.data.user || response.data;
                const newId = returnedUser._id || returnedUser.id;
                const completeUserObject = { _id: newId, ...submitData };
                setUsers(prev => [...prev, completeUserObject]);
            }

            setIsDialogOpen(false);
            resetForm();
        } catch (error) {
            console.error("Failed to save user:", error);
            alert(error.response?.data?.message || "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const initiateDelete = (userId) => {
        setUserToDelete(userId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/admin/users/${userToDelete}`);
            setUsers(prev => prev.filter(user => user._id !== userToDelete));
        } catch (error) {
            console.error("Failed to delete user:", error);
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
            setUserToDelete(null);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.profileDetails?.phone?.includes(searchQuery);
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const metrics = {
        total: users.length,
        students: users.filter(u => u.role === 'student').length,
        teachers: users.filter(u => u.role === 'teacher').length,
        admins: users.filter(u => u.role === 'admin').length,
    };

    if (selectedUser) {
        return <UserProfile user={selectedUser} onBack={() => setSelectedUser(null)} />
    }

    return (
        <div className="flex flex-col h-full p-6 md:p-8 space-y-8 font-['Inter',sans-serif] text-[#1b1b24] min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="sm:max-w-[425px] border-[#c7c4d8] bg-[#ffffff] rounded-[0.5rem] shadow-[0px_1px_3px_rgba(0,0,0,0.1)]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-[#ba1a1a]">
                            <AlertTriangle className="w-5 h-5" /> Delete User Account
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[#464555] mt-2">
                            This action cannot be undone. This will permanently delete the user's account, active sessions, and wipe their data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel onClick={() => setUserToDelete(null)} disabled={isDeleting} className="border-[#c7c4d8] text-[#1b1b24] hover:bg-[#f5f2ff] rounded-[0.25rem]">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} disabled={isDeleting} className="bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-[0.25rem]">
                            {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Deleting...</> : "Yes, Delete User"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Form Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                <DialogContent className="sm:max-w-[650px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-0 overflow-hidden border-[#c7c4d8] bg-[#ffffff] shadow-[0px_1px_3px_rgba(0,0,0,0.1)] rounded-[0.5rem] max-h-[90vh] overflow-y-auto font-['Inter',sans-serif]">
                    <div className="bg-[#fcf8ff] px-6 py-5 border-b border-[#c7c4d8] flex items-center justify-between sticky top-0 z-10">
                        <div>
                            <h2 className="text-[24px] font-semibold text-[#1b1b24] tracking-tight">
                                {editId ? "Update User" : "Provision New User"}
                            </h2>
                            <p className="text-[14px] text-[#464555] mt-1">
                                {editId ? "Modify system access and user details." : "Enter details below to create a new system account."}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#e2dfff] flex items-center justify-center border border-[#c3c0ff]">
                            {editId ? <Pencil className="w-5 h-5 text-[#3525cd]" /> : <UserPlus className="w-5 h-5 text-[#3525cd]" />}
                        </div>
                    </div>

                    <form onSubmit={handleSubmitUser}>
                        <div className="px-6 py-6 space-y-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h3 className="text-[12px] font-medium text-[#777587] uppercase tracking-wider">Account Credentials</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name" className="text-[14px] text-[#1b1b24]">Full Name</Label>
                                        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required className="h-10 rounded-[0.25rem] border-[#c7c4d8] focus-visible:ring-[#3525cd]" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="email" className="text-[14px] text-[#1b1b24]">Email Address</Label>
                                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className="h-10 rounded-[0.25rem] border-[#c7c4d8] focus-visible:ring-[#3525cd]" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="phone" className="text-[14px] text-[#1b1b24]">Mobile Number</Label>
                                        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required className="h-10 rounded-[0.25rem] border-[#c7c4d8] focus-visible:ring-[#3525cd]" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="password" className="text-[14px] text-[#1b1b24]">
                                            Password {editId && <span className="text-[#777587] text-[12px] font-normal ml-1">(Leave blank to keep)</span>}
                                        </Label>
                                        <Input id="password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} required={!editId} className="h-10 rounded-[0.25rem] border-[#c7c4d8] focus-visible:ring-[#3525cd]" />
                                    </div>
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div className="space-y-1.5 border-t border-[#e4e1ee] pt-6">
                                <Label htmlFor="role" className="text-[14px] text-[#1b1b24]">System Role</Label>
                                <select
                                    id="role" name="role"
                                    value={formData.role} onChange={handleInputChange} required disabled={!!editId}
                                    className="flex h-10 w-full rounded-[0.25rem] border border-[#c7c4d8] bg-[#ffffff] px-3 text-[14px] focus:outline-none focus:ring-1 focus:ring-[#3525cd] disabled:opacity-50"
                                >
                                    <option value="student">Student Account</option>
                                    <option value="teacher">Educator Account</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>

                            {/* Conditional Forms (Same logic, updated UI tokens) */}
                            {formData.role === 'student' && (
                                <div className="space-y-4 bg-[#f5f2ff] p-4 rounded-[0.5rem] border border-[#e4e1ee]">
                                    <h3 className="text-[12px] font-medium text-[#777587] uppercase tracking-wider">Student Metadata</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="fatherName" className="text-[14px]">Guardian Name</Label>
                                            <Input id="fatherName" name="fatherName" value={formData.fatherName} onChange={handleInputChange} required className="h-10 rounded-[0.25rem] bg-[#ffffff]" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="parentPhone" className="text-[14px]">Guardian Contact</Label>
                                            <Input id="parentPhone" name="parentPhone" type="tel" value={formData.parentPhone} onChange={handleInputChange} required className="h-10 rounded-[0.25rem] bg-[#ffffff]" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="feeType" className="text-[14px]">Fee Schedule</Label>
                                            <select id="feeType" name="feeType" value={formData.feeType} onChange={handleInputChange} required className="flex h-10 w-full rounded-[0.25rem] border border-[#c7c4d8] bg-[#ffffff] px-3 text-[14px]">
                                                <option value="MONTHLY">Monthly</option>
                                                <option value="YEARLY">Yearly</option>
                                                <option value="ONE_TIME">One Time</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="baseAmount" className="text-[14px]">Base Amount</Label>
                                            <Input id="baseAmount" name="baseAmount" type="number" min="0" value={formData.baseAmount} onChange={handleInputChange} required className="h-10 rounded-[0.25rem] bg-[#ffffff]" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="totalFees" className="text-[14px]">Total Fees</Label>
                                            <Input id="totalFees" name="totalFees" type="number" min="0" value={formData.totalFees} onChange={handleInputChange} required className="h-10 rounded-[0.25rem] bg-[#ffffff]" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 pt-2">
                                        <Label className="text-[14px]">Course Enrollment</Label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border border-[#c7c4d8] rounded-[0.25rem] bg-[#ffffff]">
                                            {courses.map(course => (
                                                <label key={course._id} className="flex items-center gap-3 p-2 border border-[#e4e1ee] rounded-[0.25rem] hover:border-[#3525cd] cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.enrolledCourses.includes(course._id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) setFormData(prev => ({ ...prev, enrolledCourses: [...prev.enrolledCourses, course._id] }));
                                                            else setFormData(prev => ({ ...prev, enrolledCourses: prev.enrolledCourses.filter(id => id !== course._id) }));
                                                        }}
                                                        className="rounded-[0.25rem] border-[#c7c4d8] text-[#3525cd] focus:ring-[#3525cd]"
                                                    />
                                                    <span className="text-[14px] truncate">{course.title}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {formData.role === 'teacher' && (
                                <div className="space-y-4 bg-[#f5f2ff] p-4 rounded-[0.5rem] border border-[#e4e1ee]">
                                    <h3 className="text-[12px] font-medium text-[#777587] uppercase tracking-wider">Educator Metadata</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="subjectsTaught" className="text-[14px]">Subjects (CSV)</Label>
                                            <Input id="subjectsTaught" name="subjectsTaught" placeholder="Math, Physics" value={formData.subjectsTaught} onChange={handleInputChange} required className="h-10 rounded-[0.25rem] bg-[#ffffff]" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="experienceInYears" className="text-[14px]">Experience (Yrs)</Label>
                                            <Input id="experienceInYears" name="experienceInYears" type="number" min="0" value={formData.experienceInYears} onChange={handleInputChange} required className="h-10 rounded-[0.25rem] bg-[#ffffff]" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-[#fcf8ff] px-6 py-4 border-t border-[#c7c4d8] flex justify-end gap-3 sticky bottom-0">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting} className="h-10 rounded-[0.25rem] border-[#c7c4d8] text-[#1b1b24] hover:bg-[#f5f2ff]">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="h-10 rounded-[0.25rem] bg-[#3525cd] hover:bg-[#302f39] text-[#ffffff]">
                                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : (editId ? "Save Changes" : "Provision User")}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Page Header & Primary Action */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[36px] font-bold tracking-[-0.02em] leading-[40px] text-[#1b1b24]">User Management</h1>
                    <p className="text-[16px] text-[#464555] mt-1">Manage portal access and account privileges.</p>
                </div>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-[#3525cd] hover:bg-[#302f39] text-[#ffffff] h-10 rounded-lg px-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1)] ">
                    <UserPlus className="w-4 h-4 mr-2" />
                    New Account
                </Button>
            </div>

            {/* Metrics Row (Design Change from standard table) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <Card className="border-transparent border cursor-pointer bg-primary/10 md:min-h-[100px] rounded-2xl text-neutral overflow-hidden relative px-3 py-5 flex shadow-md flex-col justify-between hover:shadow-2xl hover:border hover:border-primary transition-all duration-300">
                    <CardHeader className="pb-2 flex flex-row items-center gap-3 space-y-0">
                        <Users className="w-6 h-6 text-primary" strokeWidth={2} />
                        <CardTitle className="font-medium text-xl capitalize text-neutral-800">Active Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-extrabold">{metrics.total}</div>
                    </CardContent>
                </Card>

                <Card className="border-transparent border cursor-pointer bg-primary/10 md:min-h-[100px] rounded-2xl text-neutral overflow-hidden relative px-3 py-5 flex shadow-md flex-col justify-between hover:shadow-2xl hover:border hover:border-primary transition-all duration-300">
                    <CardHeader className="pb-2 flex flex-row items-center gap-3 space-y-0">
                        <GraduationCap className="w-6 h-6 text-primary" strokeWidth={2} />
                        <CardTitle className="font-medium text-xl capitalize text-neutral-800">Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-extrabold">{metrics.students}</div>
                    </CardContent>
                </Card>

                <Card className="border-transparent border cursor-pointer bg-primary/10 md:min-h-[100px] rounded-2xl text-neutral overflow-hidden relative px-3 py-5 flex shadow-md flex-col justify-between hover:shadow-2xl hover:border hover:border-primary transition-all duration-300">
                    <CardHeader className="pb-2 flex flex-row items-center gap-3 space-y-0">
                        <BookOpen className="w-6 h-6 text-primary" strokeWidth={2} />
                        <CardTitle className="font-medium text-xl capitalize text-neutral-800">Educators</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-extrabold">{metrics.teachers}</div>
                    </CardContent>
                </Card>

                <Card className="border-transparent border cursor-pointer bg-primary/10 md:min-h-[100px] rounded-2xl text-neutral overflow-hidden relative px-3 py-5 flex shadow-md flex-col justify-between hover:shadow-2xl hover:border hover:border-primary transition-all duration-300">
                    <CardHeader className="pb-2 flex flex-row items-center gap-3 space-y-0">
                        <ShieldCheck className="w-6 h-6 text-primary" strokeWidth={2} />
                        <CardTitle className="font-medium text-xl capitalize text-neutral-800">Administrators</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-extrabold">{metrics.admins}</div>
                    </CardContent>
                </Card>

            </div>

            {/* Data Section */}
            <Card className="bg-neutral-10 border-[#c7c4d8] rounded-[0.5rem] shadow-[0px_1px_3px_rgba(0,0,0,0.1)] overflow-hidden flex-1 flex flex-col p-0 gap-0">

                {/* Command Bar */}
                <div className="p-5 border-b border-[#e4e1ee] bg-primary/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    
                    {/* Modern Pill Search */}
                    <div className="relative w-full sm:max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary group-focus-within:text-[#3525cd] transition-colors duration-300" />
                        <Input
                            placeholder="Search directory by name, email, or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 h-11 w-full rounded-full bg-white border-transparent hover:border hover:border-primary text-[14px] placeholder:text-neutral focus-visible:placeholder:text-primary focus-visible:text-primary focus-visible:bg-[#ffffff] focus-visible:border-[#3525cd] focus-visible:ring-4 focus-visible:ring-[#e2dfff]/50 transition-all duration-300 shadow-none"
                        />
                    </div>

                    {/* Custom Styled Dropdown */}
                    <div className="w-full sm:w-[200px] relative">
                        <button
                            type="button"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="h-11 w-full flex items-center justify-between rounded-full border border-transparent bg-white hover:border hover:border-primary px-5 text-[14px] font-medium text-neutral focus:bg-[#ffffff] focus:border-[#3525cd] focus:outline-none focus:ring-4 focus:ring-[#e2dfff]/50 transition-all duration-300 shadow-none"
                        >
                            <div className="flex items-center gap-2.5">
                                <Filter className={`w-4 h-4 transition-colors duration-300 text-primary`} />
                                <span className="capitalize">{roleFilter === 'all' ? 'All Roles' : roleFilter === 'teacher' ? 'Educator' : roleFilter}</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-[#777587] transition-transform duration-300 ${isFilterOpen ? 'rotate-180 text-[#3525cd]' : ''}`}>
                                <path d="m6 9 6 6 6-6"/>
                            </svg>
                        </button>

                        {/* Custom Dropdown Options */}
                        {isFilterOpen && (
                            <>
                                {/* Invisible overlay to handle click-outside */}
                                <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)}></div>
                                
                                <div className="absolute top-full right-0 mt-2 w-full min-w-[200px] bg-[#ffffff] border border-[#e4e1ee] rounded-[12px] shadow-[0px_8px_24px_rgba(0,0,0,0.08)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                                    {[
                                        { value: 'all', label: 'All Roles' },
                                        { value: 'student', label: 'Student' },
                                        { value: 'teacher', label: 'Educator' },
                                        { value: 'admin', label: 'Administrator' }
                                    ].map((option) => (
                                        <div
                                            key={option.value}
                                            onClick={() => {
                                                setRoleFilter(option.value);
                                                setIsFilterOpen(false);
                                            }}
                                            className={`px-5 py-2.5 flex items-center justify-between text-[14px] cursor-pointer transition-colors ${
                                                roleFilter === option.value 
                                                ? 'bg-[#f5f2ff] text-[#3525cd] font-semibold' 
                                                : 'text-[#464555] hover:bg-[#fcf8ff] hover:text-[#1b1b24] font-medium'
                                            }`}
                                        >
                                            {option.label}
                                            {roleFilter === option.value && (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#3525cd]">
                                                    <polyline points="20 6 9 17 4 12"/>
                                                </svg>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Table */}
                <CardContent className="p-0 flex-1 overflow-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-[#777587]">
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#3525cd]" />
                            <p className="text-[14px]">Fetching records...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                            <p className="text-[16px] text-[#1b1b24] font-medium">No records found.</p>
                            <p className="text-[14px] text-[#777587] mt-1">Adjust your search or filter parameters.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-primary/30 border-b border-t border-primary ">
                                <TableRow className="border-b border-[#c7c4d8]  hover:bg-transparent transition-colors duration-300">
                                    <TableHead className="pl-6 py-4 text-[12px] font-medium text-[#777587] uppercase tracking-wider">Account</TableHead>
                                    <TableHead className="py-4 text-[12px] font-medium text-[#777587] uppercase tracking-wider">Mobile</TableHead>
                                    <TableHead className="py-4 text-[12px] font-medium text-[#777587] uppercase tracking-wider">System Role</TableHead>
                                    <TableHead className="py-4 text-[12px] font-medium text-[#777587] uppercase tracking-wider text-right pr-6">Manage</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user._id} className="border-b border-[#e4e1ee] hover:bg-[#f5f2ff] transition-colors group">
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {/* Circular avatar instead of square */}
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-[14px] uppercase shrink-0 ${getAvatarStyle(user.role)}`}>
                                                    {user.name?.substring(0, 2) || 'U'}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-medium text-[16px] text-[#1b1b24] truncate">{user.name}</span>
                                                    <span className="text-[14px] text-[#777587] truncate">{user.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-[14px] text-[#464555]">
                                            {user.profileDetails?.phone || '—'}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className={`px-2.5 py-1 rounded-[0.25rem] text-[12px] font-medium inline-block border ${getRoleBadgeStyle(user.role)}`}>
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right pr-6 py-4">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[0.25rem] text-[#777587] hover:text-[#3525cd] hover:bg-[#e2dfff]" onClick={() => setSelectedUser(user)}>
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[0.25rem] text-[#777587] hover:text-[#3525cd] hover:bg-[#e2dfff]" onClick={() => openEditModal(user)}>
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[0.25rem] text-[#777587] hover:text-[#ba1a1a] hover:bg-[#ffdad6]" onClick={() => initiateDelete(user._id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ManageUsers;