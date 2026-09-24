const express = require("express");
const cors = require("cors");
const { retrieveRelevantDocuments } = require("./services/ragService");

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
// RAG retrieval
app.post("/api/rag/retrieve", async (req, res) => {
    try {
        const {
            brand,
            garment,
            chest,
            height,
            fit,
            topK = 3
        } = req.body;

        const documents = await retrieveRelevantDocuments({
            brand,
            garment,
            chest,
            height,
            fit,
            topK
        });

        res.json({
            documents
        });
    } catch (error) {
        console.error("RAG retrieval error:", error.message);

        res.status(500).json({
            error: "Failed to retrieve relevant documents"
        });
    }
});

module.exports = app;