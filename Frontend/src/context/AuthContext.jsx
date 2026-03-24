import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { requestPermissionAndGetToken } from '../services/pushNotificationService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('hotel_user');
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            setUser(parsed);
            setRole(parsed.role || 'user');

            // SMARTER RECOVERY: Ensure push notifications are active for current session
            // We check this every time a session is loaded
            if (parsed._id) {
                console.log('Ensuring Push Token is synchronized for existing user...');
                requestPermissionAndGetToken(parsed._id);
            }
        }
        setLoading(false);
    }, []);

    // Login logic updated for 2FA
    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            if (data.otpRequired) {
                return { otpRequired: true, email: data.email, mobile: data.mobile };
            }

            const userData = data.user || data;
            setUser(userData);
            setRole(userData.role || 'user');
            localStorage.setItem('hotel_user', JSON.stringify(userData));

            // Trigger push permission immediately on login
            await requestPermissionAndGetToken(userData._id);

            return { success: true, role: userData.role || 'user' };
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message);
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    // Signup logic
    const signup = async (userData) => {
        try {
            const { data } = await api.post('/auth/register', userData);
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Signup failed' };
        }
    };

    // OTP Verification - Finalizes the session
    const verifyOtp = async (email, otp) => {
        try {
            const { data } = await api.post('/auth/verify-otp', { email, otp });
            if (data.success) {
                const userData = data.user;
                setUser(userData);
                setRole(userData.role || 'user');
                localStorage.setItem('hotel_user', JSON.stringify(userData));

                // Initialize Push Notifications immediately after OTP success
                await requestPermissionAndGetToken(userData._id);

                return { success: true, role: userData.role || 'user' };
            }
            return { success: false, message: data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'OTP verification failed' };
        }
    };

    const logout = () => {
        setUser(null);
        setRole('user');
        localStorage.removeItem('hotel_user');
        localStorage.removeItem('fcmToken'); // Clear token on logout
    };

    const updateProfile = (newData) => {
        const updatedUser = { ...user, ...newData };
        setUser(updatedUser);
        localStorage.setItem('hotel_user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, role, login, signup, verifyOtp, logout, updateProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
