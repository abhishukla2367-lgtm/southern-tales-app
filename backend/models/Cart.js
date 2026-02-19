const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    // FIX 1: Changed 'user' to 'userId' to match cartController.js
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            // FIX 3: Added productId and image to match cartController.js
            productId: { type: String },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true, default: 1 },
            image: { type: String }
        }
    ],
    // FIX 2: Changed 'totalPrice' to 'totalBill' to match cartController.js
    totalBill: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);