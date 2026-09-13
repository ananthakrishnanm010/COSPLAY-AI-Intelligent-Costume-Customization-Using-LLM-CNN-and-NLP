const express = require("express");

const app = express();

const PORT = process.env.PORT || 8000;

// Middleware
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

// Start server
app.listen(PORT, () => {
    console.log(`COSPLAY AI Backend running on http://localhost:${PORT}`);
});