const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");

// ===============================
// CREATE ORDER
// POST /api/orders
// ===============================

router.post("/", async (req, res) => {
    try {
        console.log("📦 ORDER DATA RECEIVED:");
        console.log(JSON.stringify(req.body, null, 2));

        const {
            user,
            customerName,
            phone,
            address,
            city,
            items,
            subtotal,
            deliveryFee,
            total,
            paymentMethod,
            paymentStatus,
            transactionId,
            orderStatus,
            orderDate
        } = req.body;

        console.log("👤 User ID received by orderRoutes:", user);
        console.log("Is valid ObjectId?:", mongoose.Types.ObjectId.isValid(user));

        // ===============================
        // VALIDATION
        // ===============================

        if (!customerName) {
            return res.status(400).json({
                message: "Customer name is required."
            });
        }

        if (!phone) {
            return res.status(400).json({
                message: "Phone number is required."
            });
        }

        if (!address) {
            return res.status(400).json({
                message: "Address is required."
            });
        }

        if (!city) {
            return res.status(400).json({
                message: "City is required."
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Order must contain at least one item."
            });
        }

        if (subtotal === undefined || subtotal === null) {
            return res.status(400).json({
                message: "Subtotal is required."
            });
        }

        if (total === undefined || total === null) {
            return res.status(400).json({
                message: "Total is required."
            });
        }

        if (!paymentMethod) {
            return res.status(400).json({
                message: "Payment method is required."
            });
        }

        // ===============================
        // CREATE ORDER DATA
        // ===============================
const orderData = {

    user: mongoose.Types.ObjectId.isValid(user)
        ? user
        : undefined,
        
    customerName: customerName.trim(),
            phone: phone.trim(),
            address: address.trim(),
            city: city.trim(),

            items: items.map(item => ({
                productId: mongoose.Types.ObjectId.isValid(item.productId)
                    ? item.productId
                    : undefined,

                name: item.name,
                price: Number(item.price),
                quantity: Number(item.quantity),
                image: item.image || "",
                size: item.size || ""
            })),

            subtotal: Number(subtotal),

            deliveryFee:
                deliveryFee !== undefined
                    ? Number(deliveryFee)
                    : 40,

            total: Number(total),

            paymentMethod,

            paymentStatus:
                paymentStatus || "Pending",

            transactionId:
                transactionId || "",

            orderStatus:
                orderStatus || "Order Placed"
        };

        // Only add orderDate if frontend sent it
        if (orderDate) {
            orderData.orderDate = new Date(orderDate);
        }

        // ===============================
        // SAVE TO MONGODB
        // ===============================

        const order = new Order(orderData);

        const savedOrder = await order.save();

        console.log("✅ ORDER SAVED:");
        console.log("✅ Saved Order User ID:", savedOrder.user);
        console.log(savedOrder);

        res.status(201).json({
            message: "Order created successfully!",
            order: savedOrder
        });

    } catch (error) {

        console.error("❌ CREATE ORDER ERROR:");
        console.error(error);

        res.status(500).json({
            message: "Failed to create order.",
            error: error.message,

            // Very useful during development
            details: error.errors
                ? Object.keys(error.errors).map(field => ({
                    field,
                    message: error.errors[field].message
                }))
                : null
        });
    }
});


// ===============================
// GET ALL ORDERS
// GET /api/orders
// ===============================

router.get("/", async (req, res) => {

    try {

        const orders = await Order.find()
            .sort({ createdAt: -1 });

        res.status(200).json(orders);

    } catch (error) {

        console.error("Get orders error:", error);

        res.status(500).json({
            message: "Failed to fetch orders.",
            error: error.message
        });
    }
});


module.exports = router;