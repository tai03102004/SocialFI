import express from "express";
import gamefiRoutes from "./gamefi.route";
import socialRoutes from "./social.route";
import aiRoutes from "./ai.route";

const router = express.Router();

router.use("/gamefi", gamefiRoutes);
router.use("/social", socialRoutes);
router.use("/ai", aiRoutes);

// Health check
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    mongodb: "connected",
  });
});

export default router;
