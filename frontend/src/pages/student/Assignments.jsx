import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { 
    FileText, 
    Calendar, 
    Paperclip, 
    Download, 
    BookOpen, 
    Clock, 
    Loader2, 
    User
} from "lucide-react";
import api from '@/services/api';

const StudentAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Modal state
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        setIsLoading(true);
        try {
            // Tumhare backend route ke hisaab se API call[cite: 6]
            const response = await api.get('/assignments'); 
            setAssignments(response.data);
        } catch (error) {
            console.error("Failed to fetch assignments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No Due Date';
        const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    const openAssignmentDetails = (assignment) => {
        setSelectedAssignment(assignment);
        setIsDialogOpen(true);
    };

    return (
        <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                    <FileText className="w-8 h-8 text-blue-600" />
                    My Homework
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Review your pending tasks, download study materials, and prepare for class.
                </p>
            </div>

            {/* Assignments Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-slate-500">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                    <p className="font-medium text-slate-600">Loading your homework...</p>
                </div>
            ) : assignments.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">You're all caught up!</h3>
                    <p className="text-slate-500 mt-1 max-w-md">
                        There are no pending assignments for your enrolled courses right now. Take a break or revise your previous notes.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {assignments.map((assignment) => (
                        <Card 
                            key={assignment._id} 
                            className="flex flex-col border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group"
                            onClick={() => openAssignmentDetails(assignment)}
                        >
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                <div className="flex justify-between items-start gap-4 mb-2">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                                        <BookOpen className="w-3 h-3" />
                                        {assignment.subject}
                                    </span>
                                    <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm shrink-0">
                                        {assignment.totalMarks} Marks
                                    </span>
                                </div>
                                <CardTitle className="text-lg text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {assignment.title}
                                </CardTitle>
                                {/* Populated Course Data se title nikal rahe hain[cite: 5] */}
                                <p className="text-xs text-slate-500 font-medium mt-1">
                                    {assignment.course?.title || 'General Course'}
                                </p>
                            </CardHeader>
                            
                            <CardContent className="p-4 flex-1">
                                <p className="text-sm text-slate-600 line-clamp-3">
                                    {assignment.description}
                                </p>
                            </CardContent>
                            
                            <CardFooter className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs font-medium text-orange-600 bg-orange-50/80 px-2 py-1 rounded-md border border-orange-100">
                                    <Clock className="w-3.5 h-3.5" />
                                    Due: {formatDate(assignment.dueDate)}
                                </div>
                                {assignment.attachments && assignment.attachments.length > 0 && (
                                    <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                                        <Paperclip className="w-3.5 h-3.5" />
                                        {assignment.attachments.length} files
                                    </div>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Detailed View Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col p-0">
                    {selectedAssignment && (
                        <>
                            <DialogHeader className="p-6 bg-slate-50 border-b border-slate-100 shrink-0">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                                        {selectedAssignment.subject}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-700">
                                        {selectedAssignment.course?.title || 'General'}
                                    </span>
                                </div>
                                <DialogTitle className="text-2xl font-bold text-slate-900 leading-tight">
                                    {selectedAssignment.title}
                                </DialogTitle>
                                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-600">
                                    <div className="flex items-center gap-1.5">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <span>Posted by <span className="font-medium text-slate-800">{selectedAssignment.createdBy?.name || 'Teacher'}</span></span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-orange-500" />
                                        <span>Due: <span className="font-medium text-slate-800">{formatDate(selectedAssignment.dueDate)}</span></span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-slate-200/50 px-2 py-0.5 rounded-md font-semibold text-slate-800">
                                        {selectedAssignment.totalMarks} Marks
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="p-6 overflow-y-auto flex-1">
                                <div className="prose prose-sm sm:prose-base text-slate-700 max-w-none whitespace-pre-wrap">
                                    {selectedAssignment.description}
                                </div>

                                {/* Attachments Section */}
                                {selectedAssignment.attachments && selectedAssignment.attachments.length > 0 && (
                                    <div className="mt-8 pt-6 border-t border-slate-100">
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Paperclip className="w-4 h-4 text-slate-400" />
                                            Reference Materials ({selectedAssignment.attachments.length})
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {selectedAssignment.attachments.map((file, idx) => (
                                                <a 
                                                    key={idx} 
                                                    href={file.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                                                >
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className="p-2 bg-slate-100 text-slate-500 rounded-md group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors shrink-0">
                                                            <FileText className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-700 truncate group-hover:text-blue-700 transition-colors">
                                                            Attachment {idx + 1}
                                                        </span>
                                                    </div>
                                                    <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0 flex justify-end">
                                <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="px-6">
                                    Close
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StudentAssignments;