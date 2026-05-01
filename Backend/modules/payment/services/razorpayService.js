import Razorpay from 'razorpay';
import dotenv from 'dotenv';

/**
 * Razorpay Service
 * Handles Razorpay instance management with support for dynamic credential updates
 */

let instance = null;
let cachedKeyId = null;

/**
 * Get Razorpay Instance
 * Re-initializes if credentials in .env have changed
 */
export const getRazorpayInstance = () => {
    // Reload env variables to detect changes without process restart (useful for dev/config updates)
    dotenv.config();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        console.error('❌ Razorpay credentials missing in .env');
        throw new Error('Razorpay credentials not configured');
    }

    // Re-initialize if keys changed or first time
    if (!instance || cachedKeyId !== keyId) {
        console.log(`🔄 ${instance ? 'Re-initializing' : 'Initializing'} Razorpay client with Key ID: ${keyId}`);
        instance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
        cachedKeyId = keyId;
    }

    return instance;
};

/**
 * Create a Razorpay Order
 */
export const createOrder = async (options) => {
    const rzp = getRazorpayInstance();
    return await rzp.orders.create(options);
};

/**
 * Verify Payment Signature
 */
export const verifySignature = (orderId, paymentId, signature) => {
    const crypto = require('crypto');
    const secret = process.env.RAZORPAY_KEY_SECRET;
    
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(orderId + "|" + paymentId);
    const generatedSignature = hmac.digest('hex');
    
    return generatedSignature === signature;
};

export default {
    getRazorpayInstance,
    createOrder,
    verifySignature
};
