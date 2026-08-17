import express from "express";
import "dotenv/config";
import { askGemini } from "./ai.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

console.log(
    "🔑 Gemini API key loaded:",
    Boolean(process.env.GEMINI_API_KEY)
);

app.use(express.json());

app.post("/api/chat", async (req, res) => {
    console.log("📨 /api/chat received:", req.body);

    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
        return res.status(400).json({
            error: "Message is required.",
        });
    }

    try {
        console.log("🤖 Calling Gemini...");

        const answer = await askGemini(message.trim());

        console.log("✅ Gemini responded.");

        res.json({ answer });
    } catch (error) {
        console.error("❌ Gemini error:", error);

        res.status(500).json({
            error: error instanceof Error ? error.message : String(error),
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 QA Robot server running on http://localhost:${PORT}`);
});
