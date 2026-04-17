import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['dine', 'dip', 'care'],
        required: true
    },
    category: {
        type: String,
        default: 'General'
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        default: 0
    },
    image: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    items: [{
        name: String,
        price: Number,
        description: String
    }]
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
