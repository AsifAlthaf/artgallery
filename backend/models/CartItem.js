import mongoose from 'mongoose';

const cartItemSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        artwork: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Artwork',
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        qty: {
            type: Number,
            required: true,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

const CartItem = mongoose.model('CartItem', cartItemSchema);

export default CartItem;