import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Please log in.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (!token) {
            return res.status(401).json({ message: 'Access denied. Please log in.' });
        }
        return res.status(400).json({ message: 'Invalid token.' });
    }
}

export default verifyToken;
