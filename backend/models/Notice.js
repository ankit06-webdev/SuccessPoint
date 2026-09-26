import mongoose from 'mongoose';
const { Schema } = mongoose;

const noticeSchema = new Schema({
    title: { 
        type: String, 
        required: true,
        trim: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    // 🟢 The 3 Levels of Targeting
    targetType: {
        type: String,
        enum: ['ALL', 'COURSE', 'STUDENT'],
        required: true
    },
    // Used ONLY if targetType is 'COURSE'
    targetCourse: { 
        type: Schema.Types.ObjectId, 
        ref: 'Course',
        default: null
    },
    // Used ONLY if targetType is 'STUDENT'
    targetStudent: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        default: null
    },
    // The Admin or Teacher who posted it
    createdBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    attachments: [{ 
        url: { type: String },
        public_id: { type: String }
    }]
}, { 
    timestamps: true 
});

const Notice = mongoose.model('Notice', noticeSchema);
export default Notice;