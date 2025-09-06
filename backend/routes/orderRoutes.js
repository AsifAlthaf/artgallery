import express from 'express';
const router = express.Router();
import {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
    .post(protect, addOrderItems) // Create new order
    .get(protect, admin, getOrders); // Admin can get all orders

router.route('/myorders')
    .get(protect, getMyOrders); // Get logged-in user's orders

router.route('/:id')
    .get(protect, getOrderById); // Get a specific order by ID (protected to owner/admin)

router.route('/:id/pay')
    .put(protect, updateOrderToPaid); // Mark order as paid

router.route('/:id/deliver')
    .put(protect, admin, updateOrderToDelivered); // Admin can mark order as delivered

export default router;