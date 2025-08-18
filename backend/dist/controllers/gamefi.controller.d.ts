import { Request, Response } from "express";
export declare class GameFiController {
    getPlayerStats(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getPlayerPredictions(req: Request, res: Response): Promise<void>;
    getLeaderboard(req: Request, res: Response): Promise<void>;
    updateProfile(req: Request, res: Response): Promise<void>;
}
export declare const gamefiController: GameFiController;
//# sourceMappingURL=gamefi.controller.d.ts.map