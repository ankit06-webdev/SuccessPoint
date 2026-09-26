import mongoose from 'mongoose';
const { Schema } = mongoose;

const courseSchema = new Schema({
    courseCode: {
        type: String,
        required: true,
        unique: true, 
        uppercase: true, 
        trim: true
    },
    title: {
        type: String, // Example: "Class 9th Foundation"
        required: true,
        trim: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: 0,
        required: true
    },
    durationInMonths: {
        type: Number,
        required: true
    },
    // NAYA FIELD: Is class/course mein padhaye jane wale subjects
    subjects: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);
export default Course;