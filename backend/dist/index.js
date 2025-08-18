import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import routes from "./routers/index.route";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
import { connect } from "./config/database";
import { cronService } from "./services/CronService";
// Initialize database and cron jobs
const initializeApp = async () => {
    try {
        await connect();
        console.log("🗄️ Database connected");
        // Initialize cron jobs after DB connection
        cronService.initializeCronJobs();
        console.log("⏰ Cron jobs initialized");
    }
    catch (error) {
        console.error("❌ Initialization error:", error);
        process.exit(1);
    }
};
// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(morgan("combined"));
app.use(express.json());
// Routes
app.use("/api", routes);
// Manual triggers for testing
app.post("/api/admin/trigger-ai", async (req, res) => {
    try {
        await cronService.triggerDailyProcessing();
        res.json({ success: true, message: "AI processing triggered" });
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, error: "Failed to trigger AI processing" });
    }
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});
// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
});
// Start server
const startServer = async () => {
    await initializeApp();
    app.listen(PORT, () => {
        console.log(`🚀 ZetaSocialFi Backend running on port ${PORT}`);
        console.log(`🤖 AI Cron: Active`);
        console.log(`🔧 Manual trigger: POST /api/admin/trigger-ai`);
    });
};
startServer().catch(console.error);
export default app;
//# sourceMappingURL=index.js.map