import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { 
    Search, Filter, Plus, IndianRupee, Receipt, 
    CreditCard, Banknote, Loader2, Printer, Trash2 
} from "lucide-react";
import api from '@/services/api';

const ManageFees = () => {
    // --- States ---
    const [receipts, setReceipts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Dropdown Data States
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);

    // Filter & Search States
    const [searchQuery, setSearchQuery] = useState("");
    const [modeFilter, setModeFilter] = useState("all");

    // Dialog & Form States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Maps exactly to your FeeReceipt schema
    const [formData, setFormData] = useState({
        student: '',
        course: '',
        amountPaid: '',
        paymentMode: 'CASH', // Default based on schema
        transactionReference: '',
        remarks: ''
    });

    // --- Data Fetching ---
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            // Fetch receipts, students, and courses simultaneously
            const [receiptsRes, usersRes, coursesRes] = await Promise.all([
                api.get('/payment/receipts'), // Replace with your actual receipts endpoint
                api.get('/admin/users'),
                api.get('/courses')
            ]);
            
            setReceipts(receiptsRes.data);
            // console.log(receiptsRes.data)

            setStudents(usersRes.data.filter(u => u.role === 'student'));
            setCourses(coursesRes.data);
        } catch (error) {
            console.error("Failed to fetch fee data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Form Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            student: '', course: '', amountPaid: '', paymentMode: 'CASH', transactionReference: '', remarks: ''
        });
    };

    const handleSubmitFee = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Ensure amountPaid is converted to Number before sending
            const payload = {
                ...formData,
                amountPaid: Number(formData.amountPaid)
            };

            const response = await api.post('/fees/collect', payload);
            setReceipts(prev => [response.data.receipt, ...prev]);
            
            setIsDialogOpen(false);
            resetForm();
        } catch (error) {
            console.error("Failed to collect fee:", error);
            alert(error.response?.data?.message || "Failed to record transaction");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Helper Functions ---
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    const getPaymentBadge = (mode) => {
        switch(mode) {
            case 'CASH': return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider flex items-center gap-1 w-max"><Banknote className="w-3 h-3"/> Cash</span>;
            case 'UPI': return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider flex items-center gap-1 w-max"><CreditCard className="w-3 h-3"/> UPI</span>;
            case 'BANK_TRANSFER': return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 uppercase tracking-wider flex items-center gap-1 w-max">Bank</span>;
            case 'CHEQUE': return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 uppercase tracking-wider flex items-center gap-1 w-max">Cheque</span>;
            default: return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider w-max">{mode}</span>;
        }
    };

    // --- Metrics Calculation ---
    const totalRevenue = receipts.reduce((sum, r) => sum + (r.amountPaid || 0), 0);
    const upiRevenue = receipts.filter(r => r.paymentMode === 'UPI').reduce((sum, r) => sum + (r.amountPaid || 0), 0);
    const cashRevenue = receipts.filter(r => r.paymentMode === 'CASH').reduce((sum, r) => sum + (r.amountPaid || 0), 0);

    // --- Filtering ---
    const filteredReceipts = receipts.filter(r => {
        const studentName = r.student?.name || "";
        const txnRef = r.transactionReference || "";
        
        const matchesSearch = studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              txnRef.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMode = modeFilter === "all" || r.paymentMode === modeFilter;

        return matchesSearch && matchesMode;
    });

    return (
        <div className="flex flex-col h-full p-6 space-y-6 bg-slate-50/50">
            
            {/* 1. HEADER SECTION */}
            <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fee Management</h1>
                    <p className="text-sm text-slate-500 mt-1">Collect fees, generate receipts, and track revenue.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2 px-5" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                    <Plus className="w-4 h-4" /> Collect New Fee
                </Button>
            </div>

            {/* 2. METRICS CARDS SECTION */}
            <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <IndianRupee className="w-6 h-6 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Cash Collections</p>
                            <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(cashRevenue)}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Banknote className="w-6 h-6 text-emerald-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Digital Collections (UPI)</p>
                            <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(upiRevenue)}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-indigo-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 3. SEARCH & FILTERS */}
            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                        placeholder="Search by student name or transaction ID..." 
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-10 w-full bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)} className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-[200px]">
                        <option value="all">All Payment Modes</option>
                        <option value="CASH">Cash Only</option>
                        <option value="UPI">UPI Only</option>
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                        <option value="CHEQUE">Cheque</option>
                    </select>
                </div>
            </div>

            {/* 4. MAIN TABLE (SCROLLABLE DATA, STICKY HEADER) */}
            <div className="flex-1 min-h-0 pr-2 pb-4">
                <Card className="flex flex-col h-full border-slate-200 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="shrink-0 border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                            <Receipt className="w-5 h-5 text-blue-600" /> Transaction History
                        </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="flex-1 p-0 relative min-h-[300px]">
                        {/* The absolute inset wrapper strictly handles scroll inside the card */}
                        <div className="absolute inset-0 [&>div]:h-full [&>div]:overflow-auto">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-600" />
                                    <p>Loading transactions...</p>
                                </div>
                            ) : filteredReceipts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                    <Receipt className="w-12 h-12 text-slate-300 mb-4" />
                                    <p>No fee records found.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="sticky top-0 z-30 bg-slate-50 shadow-[0_1px_0_0_#e2e8f0]">
                                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                                            <TableHead className="font-semibold text-slate-700 bg-slate-50">Date</TableHead>
                                            <TableHead className="font-semibold text-slate-700 bg-slate-50">Student Details</TableHead>
                                            <TableHead className="font-semibold text-slate-700 bg-slate-50">Amount</TableHead>
                                            <TableHead className="font-semibold text-slate-700 bg-slate-50">Mode</TableHead>
                                            <TableHead className="font-semibold text-slate-700 bg-slate-50">Transaction ID</TableHead>
                                            <TableHead className="text-right font-semibold text-slate-700 pr-6 bg-slate-50">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredReceipts.map((receipt) => (
                                            <TableRow key={receipt._id} className="transition-colors hover:bg-slate-50/80">
                                                <TableCell className="text-slate-600 font-medium">
                                                    {formatDate(receipt.createdAt)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium text-slate-900">{receipt.student?.name || 'Unknown'}</div>
                                                    <div className="text-xs text-slate-500 truncate max-w-[200px]">{receipt.course?.title || 'No Course Linked'}</div>
                                                </TableCell>
                                                <TableCell className="font-bold text-slate-800">
                                                    {formatCurrency(receipt.amountPaid)}
                                                </TableCell>
                                                <TableCell>
                                                    {getPaymentBadge(receipt.paymentMode)}
                                                </TableCell>
                                                <TableCell className="text-slate-500 font-mono text-xs">
                                                    {receipt.transactionReference || 'N/A'}
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50" title="Print Receipt">
                                                        <Printer className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" title="Delete Record">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 5. COLLECT FEE DIALOG MODAL */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
                <DialogContent className="sm:max-w-[500px]">
                    <div className="flex items-center gap-3 border-b pb-4 mb-4">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><IndianRupee className="w-5 h-5"/></div>
                        <div>
                            <h2 className="text-lg font-bold">Collect New Fee</h2>
                            <p className="text-xs text-slate-500">Record a new payment transaction.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitFee} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Select Student <span className="text-red-500">*</span></Label>
                            <select name="student" value={formData.student} onChange={handleInputChange} required className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-500">
                                <option value="">-- Choose Student --</option>
                                {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label>Select Course <span className="text-red-500">*</span></Label>
                            <select name="course" value={formData.course} onChange={handleInputChange} required className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-500">
                                <option value="">-- Choose Course --</option>
                                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Amount Paid (₹) <span className="text-red-500">*</span></Label>
                                <Input type="number" min="1" name="amountPaid" value={formData.amountPaid} onChange={handleInputChange} placeholder="5000" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Payment Mode <span className="text-red-500">*</span></Label>
                                <select name="paymentMode" value={formData.paymentMode} onChange={handleInputChange} required className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-500">
                                    <option value="CASH">CASH</option>
                                    <option value="UPI">UPI</option>
                                    <option value="BANK_TRANSFER">BANK TRANSFER</option>
                                    <option value="CHEQUE">CHEQUE</option>
                                </select>
                            </div>
                        </div>

                        {/* Only show Transaction Ref if payment mode is NOT Cash */}
                        {formData.paymentMode !== 'CASH' && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <Label>Transaction / Ref Number</Label>
                                <Input type="text" name="transactionReference" value={formData.transactionReference} onChange={handleInputChange} placeholder="e.g. UPI123456789" />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Remarks / Notes</Label>
                            <Textarea name="remarks" value={formData.remarks} onChange={handleInputChange} placeholder="e.g. 1st Installment" rows={2} />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
                            <Button type="submit" className="bg-blue-600" disabled={isSubmitting}>
                                {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : "Record Payment"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageFees;