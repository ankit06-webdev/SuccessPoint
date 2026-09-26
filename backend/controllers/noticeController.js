import Notice from '../models/Notice.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { v2 as cloudinary } from 'cloudinary';

const createNotice = async (req, res) => {
    try {
        const { title, content, targetType, targetCourse, targetStudent } = req.body;

        if (!title || !content || !targetType) {
            return res.status(400).json({ message: 'Title, content, and targetType are required.' });
        }

        if (targetType === 'COURSE') {
            if (!targetCourse) {
                return res.status(400).json({ message: 'Course ID is required when targeting a specific course.' });
            }
            const courseExists = await Course.findById(targetCourse);
            if (!courseExists) return res.status(404).json({ message: 'Target course not found.' });
        }

        if (targetType === 'STUDENT') {
            if (!targetStudent) {
                return res.status(400).json({ message: 'Student ID is required when targeting a specific student.' });
            }
            const studentExists = await User.findById(targetStudent);
            if (!studentExists || studentExists.role !== 'student') {
                return res.status(404).json({ message: 'Target student not found or invalid role.' });
            }
        }

        const attachments = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                attachments.push({ url: file.path, public_id: file.filename });
            });
        }

        const notice = await Notice.create({
            title,
            content,
            targetType,
            targetCourse: targetType === 'COURSE' ? targetCourse : null,
            targetStudent: targetType === 'STUDENT' ? targetStudent : null,
            attachments,
            createdBy: req.user.id
        });

        await notice.populate('createdBy', 'name email role');
        if (targetType === 'COURSE') await notice.populate('targetCourse', 'title');
        if (targetType === 'STUDENT') await notice.populate('targetStudent', 'name email');

        return res.status(201).json({
            message: 'Notice published successfully',
            notice
        });

    } catch (error) {

        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const getAllNotices = async (req, res) => {
    try {

        const userId = req.user.id;
        const userRole = req.user.role;

        let query = {};

        if (userRole === 'student') {
            const student = await User.findById(userId).select('enrolledCourses');

            query = {
                $or: [
                    { targetType: 'ALL' },
                    { targetType: 'COURSE', targetCourse: { $in: student.enrolledCourses } },
                    { targetType: 'STUDENT', targetStudent: userId }
                ]
            };
        }

        else if (userRole === 'admin' || userRole === 'teacher') {
            query = {};
        }

        const notices = await Notice.find(query)
            .populate('createdBy', 'name email role')
            .populate('targetCourse', 'title')
            .populate('targetStudent', 'name email')
            .sort({ createdAt: -1 });

        return res.status(200).json(notices);

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}
const deleteNotice = async (req, res) => {
    try {
        const noticeId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        const notice = await Notice.findById(noticeId);

        if (!notice) {
            return res.status(404).json({ message: 'Notice not found.' });
        }

        if (userRole !== 'admin' && notice.createdBy.toString() !== userId) {
            return res.status(403).json({
                message: 'Unauthorized. You can only delete notices that you created.'
            });
        }

        if (notice.attachments && notice.attachments.length > 0) {
            for (const file of notice.attachments) {

                if (file.public_id) {
                    await cloudinary.uploader.destroy(file.public_id);
                }
            }
        }

        await Notice.findByIdAndDelete(noticeId);

        return res.status(200).json({ message: 'Notice and associated files deleted successfully.' });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid notice ID format.' });
        }
        return res.status(500).json({ message: 'Server error during deletion', error: error.message });
    }
}

export { createNotice, getAllNotices, deleteNotice };