const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        price: {
            type: Number,
            required: true
        },

        image: {
            type: String,
            default: ""
        },

        category: {
            type: String,
            default: "Food"
        },

        available: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;