const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const router = express.Router();


// =====================================
// REGISTER USER
// =====================================

router.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;


        // Check required fields

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Please fill all required fields."
            });

        }


        // Check if user already exists

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });


        if (existingUser) {

            return res.status(400).json({
                message: "An account with this email already exists."
            });

        }


        // Hash password

        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Create user

        const user = await User.create({

            name: name,

            email: email.toLowerCase(),

            password: hashedPassword

        });


        // Send response

        res.status(201).json({

            message: "Account created successfully!",

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }

        });

    } catch (error) {

        console.error("Registration error:", error);

        res.status(500).json({
            message: "Server error while creating account."
        });

    }

});

// =====================================
// LOGIN USER
// =====================================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password."
            });
        }

        // Find user
        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Login successful
        res.status(200).json({
            message: "Login successful!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error while logging in."
        });
    }
});

module.exports = router;