import { Request, Response } from "express";
export declare class SocialController {
    getUserProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateUserProfile(req: Request, res: Response): Promise<void>;
    getUserPosts(req: Request, res: Response): Promise<void>;
    getAllPosts(req: Request, res: Response): Promise<void>;
    getPost(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    addComment(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getSocialLeaderboard(req: Request, res: Response): Promise<void>;
    getTrendingPosts(req: Request, res: Response): Promise<void>;
    search(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getUserAnalytics(req: Request, res: Response): Promise<void>;
}
export declare const socialController: SocialController;
//# sourceMappingURL=social.controller.d.ts.map