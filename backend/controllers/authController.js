import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Course from '../models/Course.js';
import jwt from 'jsonwebtoken';

const registerUser = async (req, res) => {
    const {
        name,
        email,
        password,
        role,
        profileDetails, 
        enrolledCourses,
        parentDetails,
        feesDetails,    
        subjectsTaught,
        experienceInYears 
    } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    try {
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        if (role !== 'student' && role !== 'teacher' && role !== 'admin') {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        let hashedPassword = await bcrypt.hash(password, 10);
        const newUserData = {
            name,
            email,
            password: hashedPassword,
            role,
            profileDetails
        };

        if (role === 'student') {
            newUserData.parentDetails = parentDetails;
            newUserData.enrolledCourses = enrolledCourses;

            if (feesDetails) {
                newUserData.feesDetails = feesDetails;
            }
        }
        else if (role === 'teacher') {
            if (subjectsTaught) {
                newUserData.subjectsTaught = subjectsTaught;
            }
            if (experienceInYears) {
                newUserData.experienceInYears = experienceInYears;
            }
        }

        const newUser = await User.create(newUserData);

        if (role === 'student' && enrolledCourses && enrolledCourses.length > 0) {
            await Course.updateMany(
                { _id: { $in: enrolledCourses } }, 
                { $addToSet: { enrolledStudents: newUser._id } } 
            );
        }

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '5h' }
        );

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000
        };

        res.status(201)
            .cookie('token', token, cookieOptions)
            .json({
                message: 'User registered successfully',
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    role: newUser.role,
                    enrolledCourses: newUser.enrolledCourses || [],
                }
            });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000
        };

        res.status(200)
            .cookie('token', token, cookieOptions)
            .json({
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    role: user.role
                }
            });

    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const logoutUser = (req, res) => {
    try {
        // Options MUST exactly match how the cookie was created to properly clear it
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        };

        res.clearCookie('token', cookieOptions);

        return res.status(200).json({ message: 'Logged out successfully' });

    } catch (error) {
        return res.status(500).json({
            message: 'Server error during logout',
            error: error.message
        });
    }
}

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password') 
            .populate('enrolledCourses', 'title'); 

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export { registerUser, loginUser, logoutUser, getMyProfile };