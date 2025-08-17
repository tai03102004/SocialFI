import express from "express";
import { socialController } from "../controllers/social.controller";

const router = express.Router();

// User profile routes
router.get("/profile/:address", socialController.getUserProfile);
router.put("/profile/:address", socialController.updateUserProfile);

// Posts routes
router.get("/posts", socialController.getAllPosts);
router.get("/posts/trending", socialController.getTrendingPosts);
router.get("/posts/:postId", socialController.getPost);
router.post("/posts/:postId/comments", socialController.addComment);

// User content routes
router.get("/user/:address/posts", socialController.getUserPosts);
router.get("/user/:address/analytics", socialController.getUserAnalytics);

// Social features
router.get("/leaderboard", socialController.getSocialLeaderboard);
router.get("/search", socialController.search);

export default router;
