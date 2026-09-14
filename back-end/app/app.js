const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
    res.json({
        message: "COSPLAY AI Backend is running!"
    });
});

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

module.exports = app;