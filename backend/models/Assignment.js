import mongoose from 'mongoose';
const { Schema } = mongoose;

const assignmentSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    // NAYA FIELD: Yeh assignment kis subject ka hai
    subject: {
        type: String,
        required: true,
        trim: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dueDate: {
        type: Date
    },
    totalMarks: {
        type: Number,
        default: 100
    },
    attachments: [{
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

// Yeh indexing ensure karegi ki ek course mein ek subject ke andar same title ka assignment na bane
assignmentSchema.index({ title: 1, course: 1, subject: 1 }, { unique: true });

const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;