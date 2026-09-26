import Assignment from '../models/Assignment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { v2 as cloudinary } from 'cloudinary';

// Create assignments

const createAssignment = async (req, res) => {
    try {

        const { title, description, course, subject, dueDate, totalMarks } = req.body;

        if (!title || !description || !course || !subject) {
            return res.status(400).json({ message: 'Title, description, course are required' });
        }

        const existingCourse = await Course.findById(course);
        if (!existingCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const duplicateAssignment = await Assignment.findOne({ title, course });
        if (duplicateAssignment) {
            return res.status(400).json({
                message: 'An assignment with this exact title already exists in this course.'
            });
        }

        const attachments = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                attachments.push({
                    url: file.path,
                    public_id: file.filename
                });
            });
        }

        const assignment = await Assignment.create({
            title,
            description,
            course,
            subject,
            dueDate,
            totalMarks,
            attachments,
            createdBy: req.user.id
        });

        await assignment.populate('course', 'title courseCode');
        await assignment.populate('createdBy', 'name email');

        res.status(201).json(assignment);

    } catch (error) {
        if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}


// Get all assignments

const getAllAssignments = async (req, res) => {
    try {
        let filter = {};

        if (req.query.course) {
            filter.course = req.query.course;
        }

        if (req.user.role === 'student') {
            const student = await User.findById(req.user.id).select('enrolledCourses');
            
            if (req.query.course) {
                if (!student.enrolledCourses.includes(req.query.course)) {
                    return res.status(403).json({ message: 'Not enrolled in this course.' });
                }
            } else {
                filter.course = { $in: student.enrolledCourses };
            }
        }

        const assignments = await Assignment.find(filter)
            .populate('course', 'title courseCode')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 }); 

        return res.status(200).json(assignments);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}


// delete assignments

const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        if (req.user.role !== 'admin' && assignment.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ 
                message: 'Unauthorized. You can only modify your own assignments.' 
            });
        }

        if (assignment.attachments && assignment.attachments.length > 0) {
            for (const file of assignment.attachments) {
                // cloudinary.uploader.destroy deletes the file from their servers
                await cloudinary.uploader.destroy(file.public_id);
            }
        }

        await Assignment.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: 'Assignment and associated files deleted successfully' });

    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid assignment ID' });
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}


// update assignments

const updateAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        if (req.user.role !== 'admin' && assignment.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ 
                message: 'Unauthorized. You can only modify your own assignments.' 
            });
        }

        const { title, description, subject, dueDate, totalMarks } = req.body;
        const safeUpdates = { title, description, subject, dueDate, totalMarks };
        
        Object.keys(safeUpdates).forEach(key => safeUpdates[key] === undefined && delete safeUpdates[key]);

        Object.assign(assignment, safeUpdates);

        await assignment.save();
        await assignment.populate('course', 'title courseCode');
        await assignment.populate('createdBy', 'name email');

        return res.status(200).json(assignment);
        
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid assignment ID' });
        if (error.name === 'ValidationError') return res.status(400).json({ message: error.message }); 
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}


export { getAllAssignments, createAssignment, updateAssignment, deleteAssignment };