import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    address: string;
    username?: string;
    email?: string;
    profileImage?: string;
    bio?: string;
    socialScore: number;
    gameScore: number;
    totalPredictions: number;
    correctPredictions: number;
    stakedAmount: string;
    preferredAsset: string;
    achievements: string[];
    followers: number;
    following: number;
    lastActive: Date;
    createdAt: Date;
    isVerified: boolean;
    socialLinks?: {
        twitter?: string;
        discord?: string;
        telegram?: string;
    };
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=User.d.ts.map