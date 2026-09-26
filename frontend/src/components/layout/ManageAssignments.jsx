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
import { Plus, BookOpen, Loader2, Trash2, AlertTriangle, Paperclip, Pencil, Calendar, FileText, Bookmark, Search } from "lucide-react";
import api from '@/services/api';

const ManageAssignments = () => {
    const authUser = useSelector((state) => state.auth.user);

    const [assignments, setAssignments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(""); // Search state

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        course: '',
        subject: '', 
        dueDate: '',
        totalMarks: 100, 
        attachments: []
    });

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [assignmentToDelete, setAssignmentToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [assignmentsRes, coursesRes] = await Promise.all([
                api.get('/assignments'), 
                api.get('/courses') 
            ]);
            setAssignments(assignmentsRes.data);
            setCourses(coursesRes.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: value,
            ...(name === 'course' ? { subject: '' } : {}) 
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 10);
        setFormData(prev => ({ ...prev, attachments: files }));
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', course: '', subject: '', dueDate: '', totalMarks: 100, attachments: [] });
        setEditId(null);
    };

    const openEditModal = (assignment) => {
        setEditId(assignment._id);
        
        let formattedDate = '';
        if (assignment.dueDate) {
            const dateObj = new Date(assignment.dueDate);
            formattedDate = dateObj.toISOString().split('T')[0];
        }

        setFormData({
            title: assignment.title || '',
            description: assignment.description || '',
            course: assignment.course?._id || assignment.course || '',
            subject: assignment.subject || '', 
            dueDate: formattedDate,
            totalMarks: assignment.totalMarks || 100,
            attachments: [] 
        });
        setIsDialogOpen(true);
    };

    const handleSubmitAssignment = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (editId) {
                const updatePayload = {
                    title: formData.title,
                    description: formData.description,
                    subject: formData.subject, 
                    dueDate: formData.dueDate,
                    totalMarks: formData.totalMarks
                };
                
                const response = await api.put(`/assignment/${editId}`, updatePayload); 
                
                setAssignments(prev => prev.map(assign => 
                    assign._id === editId ? response.data : assign
                ));

            } else {
                const payload = new FormData();
                payload.append('title', formData.title);
                payload.append('description', formData.description);
                payload.append('course', formData.course);
                payload.append('subject', formData.subject); 
                payload.append('totalMarks', formData.totalMarks);
                
                if (formData.dueDate) {
                    payload.append('dueDate', formData.dueDate);
                }

                formData.attachments.forEach(file => {
                    payload.append('attachments', file);
                });

                const response = await api.post('/assignment', payload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                setAssignments(prev => [response.data, ...prev]);
            }
            
            setIsDialogOpen(false);
            resetForm();
        } catch (error) {
            console.error("Failed to save assignment:", error);
            alert(error.response?.data?.message || "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const initiateDelete = (assignmentId) => {
        setAssignmentToDelete(assignmentId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!assignmentToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/assignment/${assignmentToDelete}`); 
            setAssignments(prev => prev.filter(a => a._id !== assignmentToDelete));
        } catch (error) {
            console.error("Failed to delete assignment:", error);
            alert(error.response?.data?.message || "Failed to delete");
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
            setAssignmentToDelete(null);
        }
    };

    const formatDateDisplay = (dateString) => {
        if (!dateString) return 'No due date';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    const selectedCourseData = courses.find(c => c._id === formData.course);

    // 🔴 THE FIX: Filtering logic to hide other teachers' assignments and apply search
    const filteredAssignments = assignments.filter(a => {
        // 1. Role Check: Admin dekhega sab, Teacher dekhega sirf apne assignments
        const isOwnerOrAdmin = authUser?.role === 'admin' || a.createdBy?._id === authUser?.id || a.createdBy === authUser?.id;
        
        // 2. Search Check
        const matchesSearch = a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              a.subject?.toLowerCase().includes(searchQuery.toLowerCase());

        return isOwnerOrAdmin && matchesSearch;
    });

    return (
        <div className="flex flex-col h-full p-4 sm:p-6 space-y-6">
            
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" /> Delete Assignment
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure? This will delete the assignment and remove any attached files from the server.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setAssignmentToDelete(null)} disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Assignments</h1>
                    <p className="text-sm text-slate-500 mt-1">Create, update, and manage course assignments.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" /> New Assignment
                </Button>
            </div>

            <div className="shrink-0 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                    placeholder="Search by title or subject..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 w-full bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500"
                />
            </div>

            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center gap-3 border-b pb-4 mb-4">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                            {editId ? <Pencil className="w-5 h-5"/> : <FileText className="w-5 h-5"/>}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">{editId ? 'Edit Assignment' : 'Create Assignment'}</h2>
                            <p className="text-xs text-slate-500">Fill in the details for the assignment tasks.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitAssignment} className="space-y-5">
                        
                        <div className="space-y-2">
                            <Label>Assignment Title <span className="text-red-500">*</span></Label>
                            <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Chapter 1 Homework" required />
                        </div>

                        <div className="space-y-2">
                            <Label>Description & Instructions <span className="text-red-500">*</span></Label>
                            <Textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the tasks students need to complete..." rows={4} required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Select Course <span className="text-red-500">*</span></Label>
                                <select 
                                    name="course" 
                                    value={formData.course} 
                                    onChange={handleInputChange} 
                                    required 
                                    disabled={!!editId} 
                                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
                                >
                                    <option value="">-- Choose Course --</option>
                                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label>Subject <span className="text-red-500">*</span></Label>
                                {selectedCourseData && selectedCourseData.subjects && selectedCourseData.subjects.length > 0 ? (
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                                    >
                                        <option value="">-- Select Subject --</option>
                                        {selectedCourseData.subjects.map((sub, idx) => (
                                            <option key={idx} value={sub}>{sub}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <Input 
                                        name="subject" 
                                        value={formData.subject} 
                                        onChange={handleInputChange} 
                                        placeholder="e.g. Physics" 
                                        required 
                                        disabled={!formData.course}
                                    />
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Total Marks</Label>
                                <Input type="number" name="totalMarks" min="0" value={formData.totalMarks} onChange={handleInputChange} />
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Due Date</Label>
                                <Input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} />
                            </div>
                        </div>

                        {!editId && (
                            <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                                <Label>Attachments (Max 10 files)</Label>
                                <Input type="file" multiple onChange={handleFileChange} className="cursor-pointer file:text-blue-600 file:bg-blue-50 file:border-0 file:mr-4 file:px-4 file:py-1 file:rounded-full file:font-semibold" />
                                {formData.attachments.length > 0 && (
                                    <p className="text-xs text-emerald-600 font-medium mt-2">{formData.attachments.length} file(s) selected for upload.</p>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
                            <Button type="submit" className="bg-blue-600" disabled={isSubmitting}>
                                {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : (editId ? "Update Assignment" : "Publish Assignment")}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="flex-1 min-h-0 overflow-y-auto pr-2">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-[40vh] text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-600" />
                        <p>Loading assignments...</p>
                    </div>
                ) : filteredAssignments.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-sm h-full">
                        <FileText className="w-12 h-12 text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-800">No assignments found</h3>
                        <p className="text-slate-500 mt-1">You haven't posted any assignments matching this criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
                        {filteredAssignments.map(assignment => (
                            <Card key={assignment._id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
                                <div>
                                    <CardHeader className="bg-slate-50/50 border-b pb-3 pt-4 flex flex-row justify-between items-start gap-4">
                                        <div className="w-full pr-4">
                                            <div className="flex items-center justify-between w-full mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-bold truncate max-w-[200px]">
                                                        <BookOpen className="w-3 h-3 flex-shrink-0"/> {assignment.course?.title || 'Unknown Course'}
                                                    </span>
                                                    {assignment.subject && (
                                                        <span className="flex items-center gap-1 px-2 py-1 bg-fuchsia-100 text-fuchsia-700 rounded-md text-xs font-bold truncate">
                                                            <Bookmark className="w-3 h-3 flex-shrink-0"/> {assignment.subject}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-1 rounded-md">
                                                    {assignment.totalMarks} Marks
                                                </span>
                                            </div>
                                            <CardTitle className="text-lg text-slate-800 line-clamp-1" title={assignment.title}>{assignment.title}</CardTitle>
                                            <CardDescription className="text-xs mt-1">Created by {assignment.createdBy?.name || 'Admin'}</CardDescription>
                                        </div>
                                        
                                        <div className="flex flex-col gap-1 -mt-2 -mr-2">
                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => openEditModal(assignment)}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => initiateDelete(assignment._id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4 text-slate-700 whitespace-pre-wrap text-sm leading-relaxed line-clamp-4">
                                        {assignment.description}
                                    </CardContent>
                                </div>
                                
                                <div>
                                    <div className="px-6 py-2 bg-slate-50 border-t border-b text-sm font-medium flex items-center gap-2 text-slate-600">
                                        <Calendar className="w-4 h-4 text-orange-500" />
                                        Due: {formatDateDisplay(assignment.dueDate)}
                                    </div>

                                    {assignment.attachments && assignment.attachments.length > 0 && (
                                        <CardFooter className="bg-slate-50 border-t py-3 flex flex-wrap gap-3">
                                            {assignment.attachments.map((file, idx) => (
                                                <a key={idx} href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-700 rounded-md text-xs font-medium text-slate-600 transition-colors shadow-sm">
                                                    <Paperclip className="w-3.5 h-3.5" /> File {idx + 1}
                                                </a>
                                            ))}
                                        </CardFooter>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageAssignments;