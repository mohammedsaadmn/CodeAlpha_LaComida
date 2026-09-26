const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: false
        },

        name: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        image: {
            type: String,
            default: ""
        },

        size: {
            type: String,
            default: ""
        }
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
        },

        customerName: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        address: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        items: {
            type: [orderItemSchema],
            required: true
        },

        subtotal: {
            type: Number,
            required: true
        },

        deliveryFee: {
            type: Number,
            default: 40
        },

        total: {
            type: Number,
            required: true
        },

        paymentMethod: {
            type: String,
            required: true
        },

        paymentStatus: {
            type: String,
            default: "Pending"
        },

        transactionId: {
            type: String,
            default: ""
        },

        orderStatus: {
            type: String,
            default: "Order Placed"
        },

        orderDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);