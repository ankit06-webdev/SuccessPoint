import mongoose from 'mongoose';
// Make sure to adjust these import paths to match your project's folder structure
import { User, Student, Teacher, Admin } from './models/User.js';
import Course from './models/Course.js';
import Assignment from './models/Assignment.js';
import Notice from './models/Notice.js';
import FeeReceipt from './models/FeeReceipt.js';
import dotenv from 'dotenv';

dotenv.config({ path: './config/.env' });

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB. Starting database seed...');

        // Clear existing data to prevent duplicate key errors on unique fields
        // await User.deleteMany({});
        await Course.deleteMany({});
        await Assignment.deleteMany({});
        await Notice.deleteMany({});
        await FeeReceipt.deleteMany({});

        // ==========================================
        // 1. SEED COURSES
        // ==========================================
        const courses = await Course.insertMany([
            {
                courseCode: 'JAC-12-CS',
                title: '12th JAC Computer Science & Tech',
                description: 'Complete board preparation for 12th standard',
                price: 5000,
                durationInMonths: 12,
                subjects: ['Computer Science', 'Physics', 'Mathematics'],
                isActive: true
            },
            {
                courseCode: 'WEB-DEV-MERN',
                title: 'Full Stack Web Development (MERN)',
                description: 'Master React, Node.js, and SQL/NoSQL databases',
                price: 15000,
                durationInMonths: 6,
                subjects: ['JavaScript', 'React', 'Node.js', 'SQL', 'MongoDB'],
                isActive: true
            },
            {
                courseCode: 'DIGITAL-CREATOR',
                title: 'Digital Content Creation Masterclass',
                description: 'Learn scriptwriting, video editing, and custom thumbnail design',
                price: 4000,
                durationInMonths: 3,
                subjects: ['Video Editing', 'Thumbnail Design', 'Scriptwriting'],
                isActive: true
            }
        ]);

        console.log('✅ Courses seeded');

        // ==========================================
        // 2. SEED USERS (Admins, Teachers, Students)
        // ==========================================
        const admin = await Admin.create({
            name: 'System Admin',
            email: 'admin@institute.com',
            password: 'hashed_password_123',
            profileDetails: { phone: '9999999999', address: 'Main Campus Office' },
            adminLevel: 1
        });

        const teacher1 = await Teacher.create({
            name: 'Vikash Sharma',
            email: 'vikash@institute.com',
            password: 'hashed_password_123',
            profileDetails: { phone: '8888888881', address: 'Faculty Quarters' },
            subjectsTaught: ['JavaScript', 'React', 'Node.js', 'SQL'],
            experienceInYears: 5
        });

        const teacher2 = await Teacher.create({
            name: 'Rohan Gupta',
            email: 'rohan@institute.com',
            password: 'hashed_password_123',
            profileDetails: { phone: '8888888882', address: 'City Center' },
            subjectsTaught: ['Video Editing', 'Thumbnail Design', 'Computer Science'],
            experienceInYears: 4
        });

        const students = await Student.insertMany([
            {
                name: 'Abhishek Kumar',
                email: 'abhishek.k@example.com',
                password: 'hashed_password_123',
                profileDetails: { phone: '7777777771', address: 'Jamshedpur, Jharkhand' },
                enrolledCourses: [courses[0]._id, courses[1]._id],
                feesDetails: { totalFees: 20000, amountPaid: 5000 },
                parentDetails: { fatherName: 'Santosh Pandit', primaryContactNumber: '6666666661' }
            },
            {
                name: 'Rahul Verma',
                email: 'rahul.v@example.com',
                password: 'hashed_password_123',
                profileDetails: { phone: '7777777772', address: 'Ranchi, Jharkhand' },
                enrolledCourses: [courses[1]._id],
                feesDetails: { totalFees: 15000, amountPaid: 15000 },
                parentDetails: { fatherName: 'Sanjay Verma', primaryContactNumber: '6666666662' }
            },
            {
                name: 'Priya Singh',
                email: 'priya.s@example.com',
                password: 'hashed_password_123',
                profileDetails: { phone: '7777777773', address: 'Jamshedpur, Jharkhand' },
                enrolledCourses: [courses[2]._id],
                feesDetails: { totalFees: 4000, amountPaid: 2000 },
                parentDetails: { fatherName: 'Rajesh Singh', primaryContactNumber: '6666666663' }
            },
            {
                name: 'Amit Patel',
                email: 'amit.p@example.com',
                password: 'hashed_password_123',
                profileDetails: { phone: '7777777774', address: 'Dhanbad, Jharkhand' },
                enrolledCourses: [courses[0]._id],
                feesDetails: { totalFees: 5000, amountPaid: 0 },
                parentDetails: { fatherName: 'Vijay Patel', primaryContactNumber: '6666666664' }
            }
        ]);

        console.log('✅ Users (Admins, Teachers, Students) seeded');

        // ==========================================
        // 3. SEED ASSIGNMENTS
        // ==========================================
        const assignments = await Assignment.insertMany([
            {
                title: 'Build Homework Portal V2 API',
                description: 'Write backend routing code and page layout parameters using Node.js.',
                course: courses[1]._id,
                subject: 'Node.js',
                createdBy: teacher1._id,
                dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), 
                totalMarks: 100,
                attachments: []
            },
            {
                title: 'SQL Database Normalization',
                description: 'Design schemas for fresh SQL developers focusing on table relationships.',
                course: courses[1]._id,
                subject: 'SQL',
                createdBy: teacher1._id,
                dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
                totalMarks: 50,
                attachments: []
            },
            {
                title: 'High-Contrast YT Shorts Thumbnail',
                description: 'Generate custom thumbnail designs optimized for online video platforms.',
                course: courses[2]._id,
                subject: 'Thumbnail Design',
                createdBy: teacher2._id,
                dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
                totalMarks: 100,
                attachments: []
            },
            {
                title: 'Computer Science Basics - Ch 1',
                description: 'Complete the basic networking questions from the JAC syllabus.',
                course: courses[0]._id,
                subject: 'Computer Science',
                createdBy: teacher2._id,
                totalMarks: 20,
                attachments: []
            }
        ]);

        console.log('✅ Assignments seeded');

        // ==========================================
        // 4. SEED NOTICES
        // ==========================================
        const notices = await Notice.insertMany([
            {
                title: 'Server Maintenance for Web Portal',
                content: 'The student portal will be down for UI updates and code execution tests this Sunday.',
                targetType: 'ALL',
                createdBy: admin._id
            },
            {
                title: 'MERN Stack Batch Kickoff',
                content: 'Welcome to the new batch! Ensure your local development environments are set up.',
                targetType: 'COURSE',
                targetCourse: courses[1]._id,
                createdBy: teacher1._id
            },
            {
                title: 'Outstanding Fee Reminder',
                content: 'Please clear your pending dues for the JAC course before the upcoming mock exams.',
                targetType: 'STUDENT',
                targetStudent: students[3]._id, 
                createdBy: admin._id
            }
        ]);

        console.log('✅ Notices seeded');

        // ==========================================
        // 5. SEED FEE RECEIPTS
        // ==========================================
        const feeReceipts = await FeeReceipt.insertMany([
            {
                student: students[0]._id,
                course: courses[1]._id,
                amountPaid: 5000,
                paymentMode: 'UPI',
                transactionReference: 'UPI987654321',
                collectedBy: admin._id,
                remarks: 'First Installment for Web Dev'
            },
            {
                student: students[1]._id,
                course: courses[1]._id,
                amountPaid: 15000,
                paymentMode: 'BANK_TRANSFER',
                transactionReference: 'NEFT123456789',
                collectedBy: admin._id,
                remarks: 'Full Payment'
            },
            {
                student: students[2]._id,
                course: courses[2]._id,
                amountPaid: 2000,
                paymentMode: 'CASH',
                collectedBy: admin._id,
                remarks: 'Advance Payment for Creator Course'
            }
        ]);

        console.log('✅ Fee Receipts seeded');
        console.log('🎉 Database setup complete! Total documents inserted: 20+');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();