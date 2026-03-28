import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log(`DEBUG AUTH: Verifying token: ${token.substring(0, 15)}...`);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                console.warn(`DEBUG AUTH: User not found for ID: ${decoded.id}`);
                return res.status(401).json({ message: 'User not found' });
            }
            return next();
        } catch (error) {
            console.error('DEBUG AUTH Error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        console.warn('DEBUG AUTH: No Bearer token provided in headers.');
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};
