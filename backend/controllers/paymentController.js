import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import User from "../models/User.js";
import FeeReceipt from "../models/FeeReceipt.js";

const createPaymentOrder = async (req, res) => {
    try {
        const options = {
            amount: req.body.amount * 100,  // Amount is in currency subunits. 
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex")
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({ order, message: "Payment order created successfully." });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const verifyPaymentOrder = async (req, res) => {
    const {
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        amount, 
        courseId 
    } = req.body;

    if (!orderId || !paymentId || !signature) {
        return res.status(400).json({
            message: "Order ID, payment ID, and payment signature are required."
        });
    }

    if (!courseId) {
        return res.status(400).json({
            message: "A course is required to generate the fee receipt."
        });
    }

    try {
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");

        const isValid = expectedSignature === signature;

        if (!isValid) {
            return res.status(400).json({ message: "Invalid payment signature." });
        }

        // 🔴 NAYA LOGIC: Amount ko strictly Number mein cast kiya gaya hai
        const numericAmount = Number(amount); 

        // 1. Student ki paid fees update karo
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { 'feesDetails.amountPaid': numericAmount } // String issue fixed here[cite: 8]
        });

        // 2. Fee Receipt generate karo
        const newReceipt = await FeeReceipt.create({
            student: req.user.id,
            course: courseId,
            amountPaid: numericAmount, // Yahan bhi Number bhej rahe hain[cite: 8]
            paymentMode: 'UPI', 
            transactionReference: paymentId,
            collectedBy: req.user.id, 
            remarks: "Online Payment via Razorpay"
        });

        return res.status(200).json({
            success: true,
            message: "Payment verified and receipt generated successfully.",
            receipt: newReceipt
        });
    } catch (error) {
        console.error("Payment Verification Error:", error);
        return res.status(500).json({ message: error.message });
    }
};

const getAllReceipts = async (req, res) => {
    try {
        const receipts = await FeeReceipt.find({})
            .populate('course', 'title')
            .populate('student', 'name')
            .sort({ createdAt: -1 }); 

        res.status(200).json(receipts);
    } catch (error) {
        console.error("Error fetching receipts:", error);
        res.status(500).json({ message: error.message });
    }
};
const getMyReceipts = async (req, res) => {
    try {
        const receipts = await FeeReceipt.find({ student: req.user.id })
            .populate('course', 'title')
            .sort({ createdAt: -1 }); 

        res.status(200).json(receipts);
    } catch (error) {
        console.error("Error fetching receipts:", error);
        res.status(500).json({ message: error.message });
    }
};

export { createPaymentOrder, verifyPaymentOrder, getMyReceipts, getAllReceipts };