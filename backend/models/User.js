import mongoose from 'mongoose';

const { Schema } = mongoose;

const baseOptions = {
  discriminatorKey: 'role',
  collection: 'users',
  timestamps: true,
};

// 1. BASE SCHEMA (Shared)
const baseUserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileDetails: {
    phone: String,
    address: String
  }
}, baseOptions);

const User = mongoose.model('User', baseUserSchema);

// 2. STUDENT SCHEMA (with Parent Details)
const Student = User.discriminator('student', new Schema({
  enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course', required: true }],
  
  // 🔴 UPDATED: Added feeType and baseAmount
  feesDetails: {
    feeType: { type: String, enum: ['MONTHLY', 'YEARLY', 'ONE_TIME'], default: 'YEARLY' },
    baseAmount: { type: Number, required: true, default: 0 },
    totalFees: { type: Number, required: true, default: 0 },
    amountPaid: { type: Number, default: 0 }
  },
  
  parentDetails: {
    fatherName: { type: String, required: true },
    motherName: { type: String },
    guardianName: { type: String }, 
    primaryContactNumber: { type: String, required: true },
    secondaryContactNumber: { type: String },
    email: { type: String }, 
    occupation: { type: String }
  }
}));

// 3. TEACHER SCHEMA (Unchanged)
const Teacher = User.discriminator('teacher', new Schema({
  subjectsTaught: [String],
  experienceInYears: Number
}));

// 4. ADMIN SCHEMA (Unchanged)
const Admin = User.discriminator('admin', new Schema({
  adminLevel: { type: Number, default: 1 } 
}));

export { User, Student, Teacher, Admin };
export default User;