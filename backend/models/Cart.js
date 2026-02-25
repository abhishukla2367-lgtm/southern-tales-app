const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            // ✅ FIX: Changed from String to ObjectId with ref for proper Menu item referencing
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Menu'
            },
            name:     { type: String, required: true },
            price:    { type: Number, required: true },
            quantity: { type: Number, required: true, default: 1 },
            image:    { type: String }
        }
    ],
    totalBill: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// ✅ FIX: Unique index ensures one cart per user — prevents duplicate cart bug
cartSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Cart', cartSchema);