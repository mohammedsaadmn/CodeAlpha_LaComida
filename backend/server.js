const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const cors = require("cors");
const authRoutes = require("./routes/authroutes");

const app = express();

const PORT = process.env.PORT || 5000;


// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());
app.use(express.json());


// =====================================
// MONGODB CONNECTION
// =====================================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully! ✅");
    })
    .catch((error) => {
        console.error("MongoDB connection failed ❌");
        console.error(error.message);
    });


// =====================================
// AUTHENTICATION ROUTES
// =====================================

app.use("/api/auth", authRoutes);


// =====================================
// TEST ROUTE
// =====================================

app.get("/", (req, res) => {
    res.send("La comida backend is running! 🚀");
});


// =====================================
// START SERVER
// =====================================

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});