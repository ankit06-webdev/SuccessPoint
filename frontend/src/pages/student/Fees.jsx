import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IndianRupee, Receipt, CreditCard, AlertCircle, CheckCircle2, Loader2, Building } from "lucide-react";
import api from '@/services/api';

const StudentFees = () => {
    const user = useSelector((state) => state.auth.user);

    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    // 🔴 UPDATED: Added feeType, baseAmount, displayTotal to state
    const [feeStats, setFeeStats] = useState({ total: 0, paid: 0, pending: 0, feeType: 'YEARLY', baseAmount: 0, displayTotal: 0 });
    const [payAmount, setPayAmount] = useState(0); // 🔴 NEW: Custom amount input state
    const [courseId, setCourseId] = useState(null);
    const [receipts, setReceipts] = useState([]);

    useEffect(() => {
        fetchFeeDetails();
    }, []);

    const fetchFeeDetails = async () => {
        setIsLoading(true);
        try {
            const profileRes = await api.get('/auth/me');
            const profile = profileRes.data;

            const feeType = profile.feesDetails?.feeType || 'YEARLY';
            const baseAmount = profile.feesDetails?.baseAmount || 0;
            const totalFees = profile.feesDetails?.totalFees || profile.enrolledCourses?.price || 0;

            const receiptsRes = await api.get('/payment/my-receipts');
            const fetchedReceipts = receiptsRes.data;
            setReceipts(fetchedReceipts);

            const calculatedPaidAmount = fetchedReceipts.reduce((sum, receipt) => sum + receipt.amountPaid, 0);

            let pendingAmount = 0;
            let displayTotal = totalFees;

            // 🔴 NEW: Calculate based on months elapsed if MONTHLY
            if (feeType === 'MONTHLY') {
                const joinDate = new Date(profile.createdAt || Date.now());
                const today = new Date();
                
                let monthsElapsed = (today.getFullYear() - joinDate.getFullYear()) * 12 + (today.getMonth() - joinDate.getMonth()) + 1;
                monthsElapsed = Math.max(1, monthsElapsed); // Ensure at least 1 month
                
                const expectedTillNow = monthsElapsed * baseAmount; 
                pendingAmount = expectedTillNow - calculatedPaidAmount;
                displayTotal = baseAmount; 
            } else {
                pendingAmount = totalFees - calculatedPaidAmount;
            }

            const finalPending = pendingAmount > 0 ? pendingAmount : 0;

            setFeeStats({
                total: totalFees,
                paid: calculatedPaidAmount,
                pending: finalPending,
                feeType,
                baseAmount,
                displayTotal
            });

            // Set default box value
            const defaultPay = feeType === 'MONTHLY' ? Math.min(baseAmount, finalPending) : finalPending;
            setPayAmount(defaultPay > 0 ? defaultPay : 0);

            if (profile.enrolledCourses && profile.enrolledCourses.length > 0) {
                const firstCourse = profile.enrolledCourses[0];
                setCourseId(firstCourse._id || firstCourse); 
            }
        } catch (error) {
            console.error("Failed to fetch fee details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setIsProcessing(true);

        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            alert("Razorpay SDK failed to load. Please check your internet connection.");
            setIsProcessing(false);
            return;
        }

        try {
            // 🔴 UPDATED: Send custom payAmount
            const { data: orderData } = await api.post('/payment/createOrder', {
                amount: payAmount
            });

            const order = orderData.order;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Success Point Institute",
                description: "Course Fee Payment",
                order_id: order.id,

                handler: async function (response) {
                    try {
                        if (!courseId) {
                            alert("No course assigned to your profile. Please contact Admin.");
                            return;
                        }
                        
                        const verifyRes = await api.post('/payment/verifyOrder', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: payAmount, // 🔴 UPDATED
                            courseId
                        });

                        if (verifyRes.data.success) {
                            alert("Payment Successful! Your fee receipt has been generated.");
                            window.location.reload(); 
                        }
                    } catch (error) {
                        console.error("Verification failed:", error);
                        alert("Payment verification failed. Please contact admin.");
                    }
                },
                prefill: {
                    name: user?.name || "Student",
                    email: user?.email || "student@example.com",
                },
                theme: { color: "#059669" }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

            paymentObject.on('payment.failed', function (response) {
                alert(`Payment Failed: ${response.error.description}`);
            });

        } catch (error) {
            console.error("Payment initialization failed:", error);
            alert("Could not start payment. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
    };

    return (
        <div className="flex flex-col h-full p-4 sm:p-6 space-y-6 max-w-6xl mx-auto w-full"> 
            <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"> 
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2"> 
                        <IndianRupee className="w-8 h-8 text-emerald-600" /> Fee Management 
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Track your payments and clear dues securely.</p> 
                </div>
                
                {/* 🔴 UPDATED: Input box added next to Pay Now button */}
                {feeStats.pending > 0 && ( 
                    <div className="flex items-center gap-3 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm w-full sm:w-auto">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                            <input 
                                type="number" 
                                min="1"
                                max={feeStats.pending}
                                value={payAmount}
                                onChange={(e) => setPayAmount(Number(e.target.value))}
                                className="h-11 w-32 pl-7 pr-3 rounded-md bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 font-bold"
                            />
                        </div>
                        <Button
                            onClick={handlePayment}
                            disabled={isProcessing || payAmount <= 0 || payAmount > feeStats.pending}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-2 px-6 h-11 text-base font-semibold w-full sm:w-auto" 
                        >
                            {isProcessing ? ( 
                                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> 
                            ) : ( 
                                <><CreditCard className="w-5 h-5" /> Pay Now</>
                            )}
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-6"> 
                {isLoading ? ( 
                    <div className="flex flex-col items-center justify-center h-[40vh] text-slate-500"> 
                        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" /> 
                        <p>Loading fee records...</p> 
                    </div>
                ) : ( 
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"> 
                            {/* 🔴 UPDATED: Dynamic Label based on Fee Type */}
                            <Card className="border-slate-200 shadow-sm"> 
                                <CardContent className="p-5 flex items-center justify-between"> 
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-1">
                                            {feeStats.feeType === 'MONTHLY' ? 'Monthly Fee' : 
                                             feeStats.feeType === 'YEARLY' ? 'Yearly Fee' : 'Total Course Fee'}
                                        </p> 
                                        <h3 className="text-2xl font-bold text-slate-900">
                                            {formatCurrency(feeStats.displayTotal)}
                                            {feeStats.feeType === 'MONTHLY' && <span className="text-sm text-slate-500 font-normal"> /mo</span>}
                                            {feeStats.feeType === 'YEARLY' && <span className="text-sm text-slate-500 font-normal"> /yr</span>}
                                        </h3> 
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center"><Building className="w-6 h-6 text-blue-600" /></div> 
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200 shadow-sm"> 
                                <CardContent className="p-5 flex items-center justify-between"> 
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-1">Amount Paid</p> 
                                        <h3 className="text-2xl font-bold text-emerald-700">{formatCurrency(feeStats.paid)}</h3> 
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center"><CheckCircle2 className="w-6 h-6 text-emerald-600" /></div> 
                                </CardContent>
                            </Card>

                            <Card className={`border-slate-200 shadow-sm ${feeStats.pending > 0 ? 'bg-red-50/50 border-red-100' : ''}`}> 
                                <CardContent className="p-5 flex items-center justify-between"> 
                                    <div>
                                        <p className={`text-sm font-medium mb-1 ${feeStats.pending > 0 ? 'text-red-600' : 'text-slate-500'}`}>Pending Dues</p> 
                                        <h3 className={`text-2xl font-bold ${feeStats.pending > 0 ? 'text-red-700' : 'text-slate-900'}`}>{formatCurrency(feeStats.pending)}</h3> 
                                    </div>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${feeStats.pending > 0 ? 'bg-red-100' : 'bg-slate-100'}`}> 
                                        <AlertCircle className={`w-6 h-6 ${feeStats.pending > 0 ? 'text-red-600' : 'text-slate-400'}`} /> 
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Receipt className="w-5 h-5 text-blue-600" />
                                Payment History
                            </h3>
                            
                            <Card className="border-slate-200 shadow-sm overflow-hidden">
                                {receipts.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500">
                                        <p>No payment history found.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                                <tr>
                                                    <th className="px-4 py-3">Date</th>
                                                    <th className="px-4 py-3">Course</th>
                                                    <th className="px-4 py-3">Transaction ID</th>
                                                    <th className="px-4 py-3">Mode</th>
                                                    <th className="px-4 py-3 text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {receipts.map((receipt) => (
                                                    <tr key={receipt._id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-4 py-3 text-slate-700">
                                                            {new Date(receipt.createdAt).toLocaleDateString('en-IN', {
                                                                day: 'numeric', month: 'short', year: 'numeric'
                                                            })}
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-600">
                                                            {receipt.course?.title || 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                                                            {receipt.transactionReference}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                                                                {receipt.paymentMode}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-bold text-emerald-600">
                                                            {formatCurrency(receipt.amountPaid)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StudentFees;