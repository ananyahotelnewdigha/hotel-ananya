import Razorpay from 'razorpay';
import dotenv from 'dotenv';

let instance = null;
let cachedKeyId = null;

const getRazorpayInstance = () => {
    dotenv.config();
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!instance || cachedKeyId !== keyId) {
        instance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
        cachedKeyId = keyId;
    }
    return instance;
};

// Export a proxy that always uses the latest instance
const razorpayProxy = new Proxy({}, {
    get: (target, prop) => {
        const rzp = getRazorpayInstance();
        return rzp[prop];
    }
});

export default razorpayProxy;

