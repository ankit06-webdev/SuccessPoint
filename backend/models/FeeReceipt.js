import mongoose from 'mongoose';
const { Schema } = mongoose;

const feeReceiptSchema = new Schema({
    // Kis student ne fees di hai
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Kis course ki fees di hai
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    // Kitna amount pay kiya
    amountPaid: {
        type: Number,
        required: true,
        min: 1
    },
    // Kaise pay kiya (Cash, UPI, etc.)
    paymentMode: {
        type: String,
        enum: ['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE'],
        required: true,
        default: 'CASH'
    },
    // Agar UPI ya bank se diya, toh uska transaction/reference number
    transactionReference: {
        type: String,
        trim: true,
        default: 'N/A'
    },
    // Kis Admin ya Teacher ne payment receive kiya
    collectedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Koi extra note (e.g., "Installment 1 of 3")
    remarks: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const FeeReceipt = mongoose.model('FeeReceipt', feeReceiptSchema);
export default FeeReceipt;