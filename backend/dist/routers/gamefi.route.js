import express from "express";
import { gamefiController } from "../controllers/gamefi.controller";
const router = express.Router();
// Player routes
router.get("/player/:address/stats", gamefiController.getPlayerStats);
router.get("/player/:address/predictions", gamefiController.getPlayerPredictions);
router.put("/player/:address/profile", gamefiController.updateProfile);
// Game routes
router.get("/leaderboard", gamefiController.getLeaderboard);
export default router;
//# sourceMappingURL=gamefi.route.js.map