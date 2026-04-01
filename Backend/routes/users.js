import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// @desc    Update user profile or role (works for both user updating their own profile and admin updating role)
// @route   PUT /api/users/:id
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email ? req.body.email.toLowerCase() : user.email;
            user.mobile = req.body.mobile || user.mobile;
            user.city = req.body.city || user.city;
            user.country = req.body.country || user.country;

            if (req.body.password) {
                if (!req.body.oldPassword) {
                    return res.status(400).json({ message: 'Old password is required to set a new password' });
                }
                const isMatch = await user.matchPassword(req.body.oldPassword);
                if (!isMatch) {
                    return res.status(400).json({ message: 'Invalid old password' });
                }
                user.password = req.body.password;
            }

            // Optional admin updates
            user.role = req.body.role || user.role;
            user.walletBalance = req.body.walletBalance !== undefined ? req.body.walletBalance : user.walletBalance;
            user.status = req.body.status || user.status;

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
});

export default router;
