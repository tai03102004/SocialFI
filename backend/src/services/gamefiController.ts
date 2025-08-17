import { Request, Response } from "express";
import { contractService } from "../services/contractService";
import { User } from "../models/User";
import { Prediction } from "../models/Prediction";

export class GameFiController {
  // Get player stats (blockchain + database)
  async getPlayerStats(req: Request, res: Response) {
    try {
      const { address } = req.params;

      if (!address) {
        return res.status(400).json({ error: "Address is required" });
      }

      const playerData = await contractService.getPlayerData(address);

      res.json({
        success: true,
        data: playerData,
      });
    } catch (error) {
      console.error("Error getting player stats:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch player stats",
      });
    }
  }

  // Get player predictions
  async getPlayerPredictions(req: Request, res: Response) {
    try {
      const { address } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const predictions = await Prediction.find({
        playerAddress: address.toLowerCase(),
      })
        .sort({ timestamp: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      const total = await Prediction.countDocuments({
        playerAddress: address.toLowerCase(),
      });

      res.json({
        success: true,
        data: {
          predictions,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        },
      });
    } catch (error) {
      console.error("Error getting predictions:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch predictions",
      });
    }
  }

  // Get leaderboard
  async getLeaderboard(req: Request, res: Response) {
    try {
      const { type = "game", limit = 10 } = req.query;

      const sortField = type === "social" ? "socialScore" : "gameScore";

      const leaderboard = await User.find()
        .sort({ [sortField]: -1 })
        .limit(Number(limit))
        .select(
          "address username gameScore socialScore correctPredictions totalPredictions"
        );

      res.json({
        success: true,
        data: leaderboard,
      });
    } catch (error) {
      console.error("Error getting leaderboard:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch leaderboard",
      });
    }
  }

  // Update user profile
  async updateProfile(req: Request, res: Response) {
    try {
      const { address } = req.params;
      const { username, email, profileImage } = req.body;

      const user = await User.findOneAndUpdate(
        { address: address.toLowerCase() },
        {
          username,
          email,
          profileImage,
          lastActive: new Date(),
        },
        { upsert: true, new: true }
      );

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update profile",
      });
    }
  }
}

export const gamefiController = new GameFiController();
