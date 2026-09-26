import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
    Bell, 
    Search, 
    Clock, 
    Paperclip, 
    Download, 
    Loader2, 
    User,
    Info
} from "lucide-react";
import api from '@/services/api';

const StudentNotices = () => {
    const [notices, setNotices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/notice');
            setNotices(response.data);
        } catch (error) {
            console.error("Failed to fetch notices:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    const getTargetBadge = (notice) => {
        if (notice.targetType === 'ALL') {
            return <span className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Broadcast</span>;
        }
        if (notice.targetType === 'COURSE') {
            return <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Course: {notice.targetCourse?.title || 'Unknown'}</span>;
        }
        if (notice.targetType === 'STUDENT') {
            return <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Direct Message</span>;
        }
        return null;
    };

    const filteredNotices = notices.filter(notice => 
        notice.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        // 🔴 Root Container: 'flex flex-col h-full' added to take full height
        <div className="flex flex-col h-full p-4 sm:p-6 space-y-6 max-w-5xl mx-auto w-full">
            
            {/* 🔴 Header Section: 'shrink-0' added so it doesn't get squeezed */}
            <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <Bell className="w-8 h-8 text-blue-600" />
                        Notice Board
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Stay updated with the latest announcements, schedules, and alerts.
                    </p>
                </div>
            </div>

            {/* 🔴 Search Bar: 'shrink-0' added */}
            <div className="shrink-0 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                    placeholder="Search announcements by title or keyword..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 w-full bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base rounded-xl"
                />
            </div>

            {/* 🔴 Notices Feed Wrapper: 'flex-1 overflow-y-auto' handles the internal scroll */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                        <p className="font-medium text-slate-600">Syncing announcements...</p>
                    </div>
                ) : filteredNotices.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-sm h-full">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Info className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">No announcements found</h3>
                        <p className="text-slate-500 mt-1 max-w-md">
                            {searchQuery ? "We couldn't find any notices matching your search criteria." : "There are no announcements for you at this time."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredNotices.map((notice) => (
                            <Card key={notice._id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-4 pt-5">
                                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                        {getTargetBadge(notice)}
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
                                            <Clock className="w-3.5 h-3.5" />
                                            {formatDate(notice.createdAt)}
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl text-slate-800 leading-snug">
                                        {notice.title}
                                    </CardTitle>
                                    <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-500">
                                        <User className="w-4 h-4" />
                                        <span>Posted by <span className="font-medium text-slate-700">{notice.createdBy?.name || 'Admin'}</span></span>
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="p-5 sm:p-6">
                                    <div className="prose prose-sm sm:prose-base text-slate-700 max-w-none whitespace-pre-wrap leading-relaxed">
                                        {notice.content}
                                    </div>
                                </CardContent>
                                
                                {/* Attachments Section */}
                                {notice.attachments && notice.attachments.length > 0 && (
                                    <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 sm:px-6 flex flex-col items-start gap-3">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                            <Paperclip className="w-3.5 h-3.5" />
                                            Attached Files ({notice.attachments.length})
                                        </h4>
                                        <div className="flex flex-wrap gap-3 w-full">
                                            {notice.attachments.map((file, idx) => (
                                                <a 
                                                    key={idx} 
                                                    href={file.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors shadow-sm w-full sm:w-auto group"
                                                >
                                                    <div className="p-1.5 bg-blue-100 text-blue-600 rounded shrink-0">
                                                        <Download className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 truncate max-w-[200px]">
                                                        Attachment {idx + 1}
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    </CardFooter>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentNotices;