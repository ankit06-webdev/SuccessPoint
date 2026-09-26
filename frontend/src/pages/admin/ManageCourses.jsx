import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Loader2, BookOpen, Pencil, Trash2, GraduationCap, AlertTriangle } from "lucide-react";
import api from '@/services/api';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editId, setEditId] = useState(null); 
    
    // NAYA: 'subjects' field add kiya gaya hai[cite: 18]
    const [formData, setFormData] = useState({
        courseCode: '',
        title: '',
        durationInMonths: '',
        price: '',
        subjects: '' 
    });

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/courses/');
            setCourses(response.data);
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getDurationStyle = (months) => {
        if (months <= 3) return "bg-emerald-100 text-emerald-700 border-emerald-200";
        if (months <= 6) return "bg-blue-100 text-blue-700 border-blue-200";
        return "bg-purple-100 text-purple-700 border-purple-200";
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        // NAYA: subjects ko reset kiya[cite: 18]
        setFormData({ courseCode: '', title: '', durationInMonths: '', price: '', subjects: '' });
        setEditId(null);
    };

    const openEditModal = (course) => {
        setEditId(course._id);
        // NAYA: Array ko string mein badal kar input mein dikhana[cite: 18]
        setFormData({
            courseCode: course.courseCode,
            title: course.title,
            durationInMonths: course.durationInMonths,
            price: course.price,
            subjects: course.subjects ? course.subjects.join(', ') : '' 
        });
        setIsDialogOpen(true);
    };

    const handleSubmitCourse = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // NAYA: String ko wapas Array mein convert karna submit karne se pehle[cite: 18]
            const submitData = {
                ...formData,
                subjects: formData.subjects ? formData.subjects.split(',').map(s => s.trim()).filter(Boolean) : []
            };

            if (editId) {
                await api.put(`/courses/${editId}`, submitData);
                setCourses(prev => prev.map(course => 
                    course._id === editId ? { ...course, ...submitData } : course
                ));
            } else {
                const response = await api.post('/courses/', submitData);
                setCourses(prev => [...prev, response.data]);
            }
            
            setIsDialogOpen(false);
            resetForm();
        } catch (error) {
            console.error("Failed to save course:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const initiateDelete = (courseId) => {
        setCourseToDelete(courseId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!courseToDelete) return;
        
        setIsDeleting(true);
        try {
            await api.delete(`/courses/${courseToDelete}`);
            setCourses(prev => prev.filter(course => course._id !== courseToDelete));
        } catch (error) {
            console.error("Failed to delete course:", error);
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
            setCourseToDelete(null);
        }
    };

    return (
        <div className="p-6 space-y-6">
            
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            Delete Course
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-600 mt-2">
                            Are you absolutely sure? This action cannot be undone. This will permanently delete the course and remove its data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel onClick={() => setCourseToDelete(null)} disabled={isDeleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600">
                            {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Deleting...</> : "Yes, Delete Course"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Courses</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        View, add, and manage the curriculum offered at Success Point.
                    </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2 p-5" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                    <Plus className="w-4 h-4" /> Add New Course
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                <DialogContent className="sm:max-w-[600px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-0 overflow-hidden border-slate-200 shadow-2xl rounded-xl border-0">
                    <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 shrink-0 shadow-sm mt-1">
                            {editId ? <Pencil className="w-6 h-6 text-blue-700" /> : <GraduationCap className="w-6 h-6 text-blue-700" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                                {editId ? "Edit Course" : "Create New Course"}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                                {editId ? "Update the details for this course below." : "Fill in the details below to add a new course to your active curriculum."}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitCourse}>
                        <div className="px-8 py-6 space-y-6">
                            <div className="space-y-2.5">
                                <Label htmlFor="title" className="text-slate-700 font-semibold">Course Title</Label>
                                <Input id="title" name="title" placeholder="e.g. Class 9th Foundation" value={formData.title} onChange={handleInputChange} required className="h-11 text-base focus-visible:ring-blue-500" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="space-y-2.5">
                                    <Label htmlFor="courseCode" className="text-slate-700 font-semibold">Course Code</Label>
                                    <Input id="courseCode" name="courseCode" placeholder="e.g. CS101" value={formData.courseCode} onChange={handleInputChange} required className="h-11 font-mono uppercase focus-visible:ring-blue-500" />
                                </div>
                                <div className="space-y-2.5">
                                    <Label htmlFor="durationInMonths" className="text-slate-700 font-semibold">Duration (Months)</Label>
                                    <Input id="durationInMonths" name="durationInMonths" type="number" min="1" placeholder="e.g. 6" value={formData.durationInMonths} onChange={handleInputChange} required className="h-11 focus-visible:ring-blue-500" />
                                </div>
                                <div className="space-y-2.5">
                                    <Label htmlFor="price" className="text-slate-700 font-semibold">Price (₹)</Label>
                                    <Input id="price" name="price" type="number" min="0" placeholder="e.g. 15000" value={formData.price} onChange={handleInputChange} required className="h-11 focus-visible:ring-blue-500" />
                                </div>
                            </div>
                            
                            {/* NAYA: Subjects add karne ke liye input[cite: 18] */}
                            <div className="space-y-2.5">
                                <Label htmlFor="subjects" className="text-slate-700 font-semibold">Subjects (Comma separated)</Label>
                                <Input id="subjects" name="subjects" placeholder="e.g. Maths, Science, English" value={formData.subjects} onChange={handleInputChange} className="h-11 focus-visible:ring-blue-500" />
                                <p className="text-xs text-slate-500">Enter the subjects taught in this course separated by commas.</p>
                            </div>
                        </div>
                        
                        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-end gap-3 rounded-b-xl">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting} className="h-10 px-5 font-medium border-slate-300 text-slate-700 hover:bg-slate-100">Cancel</Button>
                            <Button type="submit" disabled={isSubmitting} className="h-10 px-6 font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : (editId ? "Update Course" : "Save Course")}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                        <div className="p-1.5 bg-blue-100 rounded-md"><BookOpen className="w-4 h-4 text-blue-600" /></div>
                        Active Courses
                    </CardTitle>
                    <CardDescription>A complete list of all currently available courses.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-600" /><p>Loading curriculum data...</p>
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-center px-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4"><BookOpen className="w-6 h-6 text-slate-400" /></div>
                            <h3 className="font-medium text-slate-900 mb-1">No courses found</h3>
                            <p className="text-sm">Get started by creating your first course offering.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-slate-50/80">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[140px] font-semibold text-slate-700">Course Code</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Title & Subjects</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Duration</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-700">Price</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-700 pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {courses.map((course) => (
                                    <TableRow key={course._id} className="transition-colors hover:bg-slate-50/80">
                                        <TableCell className="font-medium">
                                            <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-md text-xs font-mono">{course.courseCode}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs uppercase shadow-sm">
                                                    {course.title?.charAt(0) || 'C'}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-slate-800 block">{course.title}</span>
                                                    {/* NAYA: Subjects ko table mein dikhana[cite: 18] */}
                                                    {course.subjects && course.subjects.length > 0 && (
                                                        <span className="text-xs text-slate-500">{course.subjects.join(', ')}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getDurationStyle(course.durationInMonths)}`}>
                                                {course.durationInMonths} Months
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-slate-900">{formatCurrency(course.price)}</TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => openEditModal(course)}>
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50" onClick={() => initiateDelete(course._id)}>
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

export default ManageCourses;