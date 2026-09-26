import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";     
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Bell, Loader2, Trash2, AlertTriangle, Paperclip, Users, BookOpen, User, Search, X } from "lucide-react";
import api from '@/services/api';

const Anouncement = () => {
    const authUser = useSelector((state) => state.auth.user);

    const [notices, setNotices] = useState([]);
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // 🔴 Naya state search query ke liye
    const [studentSearch, setStudentSearch] = useState("");
    
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        targetType: 'ALL',
        targetCourse: '',
        targetStudent: '',
        attachments: []
    });

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [noticeToDelete, setNoticeToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchNotices();
        fetchDropdownData();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await api.get('/notice');
            setNotices(response.data);
        } catch (error) {
            console.error("Failed to fetch notices:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDropdownData = async () => {
        try {
            const [coursesRes, usersRes] = await Promise.all([
                api.get('/courses/'),
                api.get('/admin/users')
            ]);
            setCourses(coursesRes.data);
            setStudents(usersRes.data.filter(u => u.role === 'student'));
        } catch (error) {
            console.error("Failed to fetch dropdown data", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Agar user target type badal de, toh puraana selection clear kar do
        if (name === 'targetType') {
            setFormData(prev => ({ ...prev, targetCourse: '', targetStudent: '' }));
            setStudentSearch("");
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 10);
        setFormData(prev => ({ ...prev, attachments: files }));
    };

    const resetForm = () => {
        setFormData({
            title: '', 
            content: '', 
            targetType: 'ALL', 
            targetCourse: '', 
            targetStudent: '', 
            attachments: []
        });
        setStudentSearch(""); // Search bar ko bhi clear karna zaroori hai
    };

    const handleSubmitNotice = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = new FormData();
            payload.append('title', formData.title); 
            payload.append('content', formData.content); 
            payload.append('targetType', formData.targetType); 

            if (formData.targetType === 'COURSE' && formData.targetCourse) {
                payload.append('targetCourse', formData.targetCourse);
            }
            if (formData.targetType === 'STUDENT' && formData.targetStudent) {
                payload.append('targetStudent', formData.targetStudent);
            }

            formData.attachments.forEach(file => {
                payload.append('attachments', file);
            });

            const response = await api.post('/notice', payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setNotices(prev => [response.data.notice, ...prev]);
            
            setIsDialogOpen(false);
            resetForm();
        } catch (error) {
            console.error("Failed to post notice:", error);
            alert(error.response?.data?.message || "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const initiateDelete = (noticeId) => {
        setNoticeToDelete(noticeId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!noticeToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/notice/${noticeToDelete}`); 
            setNotices(prev => prev.filter(notice => notice._id !== noticeToDelete));
        } catch (error) {
            console.error("Failed to delete notice:", error);
            alert(error.response?.data?.message || "Failed to delete");
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
            setNoticeToDelete(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const getTargetBadge = (type, course, student) => {
        if (type === 'ALL') return <span className="flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-bold"><Users className="w-3 h-3"/> Broadcast</span>;
        if (type === 'COURSE') return <span className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold"><BookOpen className="w-3 h-3"/> Course: {course?.title || 'Unknown'}</span>;
        if (type === 'STUDENT') return <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-bold"><User className="w-3 h-3"/> Student: {student?.name || 'Unknown'}</span>;
    };

    const visibleNotices = notices.filter(notice => {
        if (authUser?.role === 'admin') return true; 
        const isBroadcast = notice.targetType === 'ALL';
        const isMyNotice = notice.createdBy?._id === authUser?.id || notice.createdBy === authUser?.id;
        return isBroadcast || isMyNotice;
    });

    // 🔴 Helper function search logic ke liye
    const filteredStudents = students.filter(s => 
        s.name?.toLowerCase().includes(studentSearch.toLowerCase()) || 
        s.email?.toLowerCase().includes(studentSearch.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full p-6">
            
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" /> Delete Announcement
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure? This will delete the notice and remove any attached files from the server.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setNoticeToDelete(null)} disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Announcements</h1>
                    <p className="text-sm text-slate-500 mt-1">Publish notices and share materials with students.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" /> New Notice
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center gap-3 border-b pb-4 mb-4">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><Bell className="w-5 h-5"/></div>
                        <div>
                            <h2 className="text-lg font-bold">Publish Notice</h2>
                            <p className="text-xs text-slate-500">Target specific groups and attach up to 10 files.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitNotice} className="space-y-5">
                        
                        <div className="space-y-2">
                            <Label>Title <span className="text-red-500">*</span></Label>
                            <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Exam Schedule Revised" required />
                        </div>

                        <div className="space-y-2">
                            <Label>Message Content <span className="text-red-500">*</span></Label>
                            <Textarea name="content" value={formData.content} onChange={handleInputChange} placeholder="Type your announcement here..." rows={4} required />
                        </div>

                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                            <div className="space-y-2">
                                <Label>Audience Targeting</Label>
                                <select 
                                    name="targetType" value={formData.targetType} onChange={handleInputChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                >
                                    <option value="ALL">Broadcast to ALL</option>
                                    <option value="COURSE">Specific Course</option>
                                    <option value="STUDENT">Specific Student</option>
                                </select>
                            </div>

                            {formData.targetType === 'COURSE' && (
                                <div className="space-y-2 animate-in fade-in">
                                    <Label>Select Course <span className="text-red-500">*</span></Label>
                                    <select name="targetCourse" value={formData.targetCourse} onChange={handleInputChange} required className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-500">
                                        <option value="">-- Choose Course --</option>
                                        {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                                    </select>
                                </div>
                            )}

                            {/* 🔴 UPGRADED: Searchable Student Select UI */}
                            {formData.targetType === 'STUDENT' && (
                                <div className="space-y-3 animate-in fade-in">
                                    <Label>Select Student <span className="text-red-500">*</span></Label>
                                    
                                    {/* Agar student select ho gaya hai, toh selected chip dikhao */}
                                    {formData.targetStudent ? (
                                        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
                                            <div>
                                                <div className="text-sm font-bold text-blue-900">
                                                    {students.find(s => s._id === formData.targetStudent)?.name}
                                                </div>
                                                <div className="text-xs text-blue-700 mt-0.5">
                                                    {students.find(s => s._id === formData.targetStudent)?.email}
                                                </div>
                                            </div>
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                                                onClick={() => setFormData(prev => ({ ...prev, targetStudent: '' }))}
                                            >
                                                <X className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    ) : (
                                        /* Agar student select nahi hua hai, toh search box aur list dikhao */
                                        <div className="border border-slate-200 rounded-md overflow-hidden bg-slate-50 shadow-sm">
                                            <div className="p-2 border-b border-slate-200 bg-white">
                                                <div className="relative">
                                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <Input 
                                                        placeholder="Search student by name or email..." 
                                                        className="h-9 pl-9 text-sm bg-slate-50 border-slate-200"
                                                        value={studentSearch}
                                                        onChange={(e) => setStudentSearch(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="max-h-48 overflow-y-auto p-1.5 space-y-1">
                                                {filteredStudents.length > 0 ? (
                                                    filteredStudents.map(student => (
                                                        <div 
                                                            key={student._id}
                                                            className="px-3 py-2 text-sm text-slate-700 hover:bg-blue-100 hover:text-blue-800 rounded-md cursor-pointer transition-colors"
                                                            onClick={() => setFormData(prev => ({ ...prev, targetStudent: student._id }))}
                                                        >
                                                            <div className="font-bold">{student.name}</div>
                                                            <div className="text-xs text-slate-500 mt-0.5">{student.email}</div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-sm text-slate-500 text-center">No students found matching your search.</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Attachments (Max 10 files)</Label>
                            <Input type="file" multiple onChange={handleFileChange} className="cursor-pointer file:text-blue-600 file:bg-blue-50 file:border-0 file:mr-4 file:px-4 file:py-1 file:rounded-full file:font-semibold" />
                            {formData.attachments.length > 0 && (
                                <p className="text-xs text-emerald-600 font-medium mt-1">{formData.attachments.length} file(s) selected.</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            {/* Disable button agar targetType STUDENT hai par targetStudent empty hai */}
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
                            <Button type="submit" className="bg-blue-600" disabled={isSubmitting || (formData.targetType === 'STUDENT' && !formData.targetStudent)}>
                                {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing...</> : "Publish Notice"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div>
                ) : visibleNotices.length === 0 ? (
                    <Card className="border-dashed shadow-none bg-slate-50"><CardContent className="flex flex-col items-center py-16 text-slate-500"><Bell className="w-10 h-10 mb-3 text-slate-300"/><p>No announcements available.</p></CardContent></Card>
                ) : (
                    visibleNotices.map(notice => (
                        <Card key={notice._id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="bg-slate-50/50 border-b pb-3 pt-4 flex flex-row justify-between items-start gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        {getTargetBadge(notice.targetType, notice.targetCourse, notice.targetStudent)}
                                        <span className="text-xs text-slate-400 font-medium">{formatDate(notice.createdAt)}</span>
                                    </div>
                                    <CardTitle className="text-lg text-slate-800">{notice.title}</CardTitle>
                                    <CardDescription className="text-xs mt-1">Posted by {notice.createdBy?.name || 'Admin'}</CardDescription>
                                </div>
                                
                                {(authUser?.role === 'admin' || notice.createdBy?._id === authUser?.id || notice.createdBy === authUser?.id) && (
                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600 hover:bg-red-50 -mt-1 -mr-2" onClick={() => initiateDelete(notice._id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent className="pt-4 text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
                                {notice.content}
                            </CardContent>
                            
                            {notice.attachments && notice.attachments.length > 0 && (
                                <CardFooter className="bg-slate-50 border-t py-3 flex flex-wrap gap-3">
                                    {notice.attachments.map((file, idx) => (
                                        <a key={idx} href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-700 rounded-md text-xs font-medium text-slate-600 transition-colors shadow-sm">
                                            <Paperclip className="w-3.5 h-3.5" /> Attachment {idx + 1}
                                        </a>
                                    ))}
                                </CardFooter>
                            )}
                        </Card>
                    ))
                )}
            </div>
            
        </div>
    );
};

export default Anouncement;