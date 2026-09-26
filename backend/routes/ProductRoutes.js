const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// =====================================
// GET ALL PRODUCTS
// =====================================

router.get("/", async (req, res) => {
    try {
        const products = await Product.find({
            available: true
        });

        res.status(200).json(products);

    } catch (error) {
        console.error("Get products error:", error);

        res.status(500).json({
            message: "Server error while fetching products."
        });
    }
});


// =====================================
// GET SINGLE PRODUCT
// =====================================

router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        res.status(200).json(product);

    } catch (error) {
        console.error("Get product error:", error);

        res.status(500).json({
            message: "Server error while fetching product."
        });
    }
});


// =====================================
// CREATE PRODUCT
// =====================================

router.post("/", async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            image,
            category
        } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({
                message: "Name and price are required."
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            image,
            category
        });

        res.status(201).json({
            message: "Product created successfully!",
            product
        });

    } catch (error) {
        console.error("Create product error:", error);

        res.status(500).json({
            message: "Server error while creating product."
        });
    }
});

// UPDATE PRODUCT
router.put("/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        res.status(200).json({
            message: "Product updated successfully!",
            product
        });
    } catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({
            message: "Server error while updating product."
        });
    }
});


// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        res.status(200).json({
            message: "Product deleted successfully!",
            product
        });
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({
            message: "Server error while deleting product."
        });
    }
});

module.exports = router;