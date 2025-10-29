import Order from '../models/Order.js';
import asyncHandler from 'express-async-handler';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order({
            orderItems: orderItems.map(x => ({
                ...x,
                artwork: x._id, // Map _id to artwork to reference Artwork model
                _id: undefined // Remove original _id to avoid Mongoose conflict
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate('orderItems.artwork', 'name image price artist'); // Populate artwork details and artist name

    if (order) {
        // Ensure the logged-in user is the owner of the order or an admin
        if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            res.status(403);
            throw new Error('Not authorized to view this order');
        }
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).populate('orderItems.artwork', 'name image');
    res.json(orders);
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
        .populate('user', 'id name')
        .populate('orderItems.artwork', 'name image');
    res.json(orders);
});

// @desc    Get orders by user ID
// @route   GET /api/orders/user/:id
// @access  Private (must be same user or admin)
const getOrdersByUserId = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.id })
            .populate("orderItems.artwork", "title imageUrl price") // adjust fields to your Artwork schema
            .populate("user", "name email");

        // Security: only allow the logged-in user to see their orders unless admin
        if (
            req.user._id.toString() !== req.params.id &&
            !req.user.isAdmin
        ) {
            res.status(403);
            throw new Error("Not authorized to view these orders");
        }

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user orders" });
    }
});


export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
    getOrdersByUserId,
};