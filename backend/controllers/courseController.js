import Course from '../models/Course.js';

// Get all courses
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching courses', error: error.message });
    }
};

// 2. Get a single course (UPDATED)
const getCourse = async (req, res) => {
    try {
        // HATA DIYA: .populate('enrolledStudents') kyunki ab wo schema mein nahi hai
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid course ID' });
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create a new course (UPDATED)
const createCourse = async (req, res) => {
    try {
        // NAYA: 'subjects' ko req.body se nikaalna
        const { courseCode, title, description, price, durationInMonths, subjects } = req.body;

        if (!courseCode || !title || price === undefined || !durationInMonths) {
            return res.status(400).json({
                message: 'Course Code, Title, price, and durationInMonths are required'
            });
        }

        const course = await Course.create({
            courseCode, 
            title,
            description,
            price,
            durationInMonths,
            subjects // NAYA: isko database mein save karna
        });

        res.status(201).json(course);
    } catch (error) {
        
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Course code must be unique.' });
        }
        if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a course (UPDATED)
const updateCourse = async (req, res) => {
    try {
        // NAYA: 'subjects' ko req.body se nikaalna
        const { title, description, price, durationInMonths, isActive, subjects } = req.body;
        
        // NAYA: 'subjects' ko safeUpdates mein add karna
        const safeUpdates = { title, description, price, durationInMonths, isActive, subjects };

        Object.keys(safeUpdates).forEach(key => safeUpdates[key] === undefined && delete safeUpdates[key]);

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            safeUpdates,
            { new: true, runValidators: true }
        );

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        // Frontend ko updated data return kar diya
        res.status(200).json({ message: 'Course updated successfully', course });
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid course ID' });
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a course
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid course ID' });
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export { getCourses, getCourse, createCourse, updateCourse, deleteCourse };