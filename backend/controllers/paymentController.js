import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import Order from '../models/Order.js'; // Assuming you have an Order model

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create a Stripe checkout session
// @route   POST /api/payment/create-checkout-session
// @access  Private
const createCheckoutSession = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, orderId } = req.body; // orderId is crucial for post-payment

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items provided for checkout.');
    }

    // Map order items to Stripe's line_items format
    const line_items = orderItems.map((item) => ({
        price_data: {
            currency: 'usd', // Or your preferred currency
            product_data: {
                name: item.name,
                images: [item.image], // Assuming item.image is a URL
            },
            unit_amount: Math.round(item.price * 100), // Price in cents
        },
        quantity: item.qty,
    }));

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/order/${orderId}?payment=success`, // Redirect to your order success page
            cancel_url: `${process.env.CLIENT_URL}/order/${orderId}?payment=cancel`,   // Redirect to your order cancellation page
            metadata: {
                orderId: orderId, // Store your internal order ID
                userId: req.user._id.toString(), // Store the user ID
            },
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR'], // Add countries you ship to
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: Math.round(req.body.shippingPrice * 100), // Dynamic shipping price
                            currency: 'usd',
                        },
                        display_name: 'Standard Shipping',
                        delivery_estimate: {
                            minimum: { unit: 'business_day', value: 5 },
                            maximum: { unit: 'business_day', value: 10 },
                        },
                    },
                },
            ],
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Stripe checkout session creation failed:', error);
        res.status(500);
        throw new Error('Failed to create Stripe checkout session.');
    }
});


// @desc    Stripe webhook handler for payment events
// @route   POST /api/payment/webhook (Stripe will send events here)
// @access  Public (but secured by Stripe signature)
const stripeWebhook = asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const { orderId, userId } = session.metadata;

            // Fulfill the purchase: Update your database (e.g., mark order as paid)
            const order = await Order.findById(orderId);

            if (order) {
                order.isPaid = true;
                order.paidAt = new Date(session.created * 1000); // Stripe timestamp is in seconds
                order.paymentResult = {
                    id: session.payment_intent,
                    status: session.payment_status,
                    update_time: new Date(session.created * 1000).toISOString(),
                    email_address: session.customer_details ? session.customer_details.email : 'N/A',
                };
                // Also update shipping address if collected via Stripe
                if (session.shipping_details && session.shipping_details.address) {
                    order.shippingAddress = {
                        address: session.shipping_details.address.line1,
                        city: session.shipping_details.address.city,
                        postalCode: session.shipping_details.address.postal_code,
                        country: session.shipping_details.address.country,
                    };
                }

                await order.save();
                console.log(`Order ${orderId} marked as paid.`);
                // You might also send a confirmation email here
            } else {
                console.error(`Order with ID ${orderId} not found for payment fulfillment.`);
            }
            break;
        // Add more event types if needed (e.g., payment_intent.succeeded, customer.subscription.created)
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
});

// @desc    Get Stripe Public Key
// @route   GET /api/payment/config
// @access  Public
const getStripeConfig = asyncHandler(async (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});


export {
    createCheckoutSession,
    stripeWebhook,
    getStripeConfig
};