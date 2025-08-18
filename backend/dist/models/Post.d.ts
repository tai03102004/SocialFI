import mongoose, { Document } from "mongoose";
export interface IComment {
    author: string;
    content: string;
    timestamp: Date;
    likes?: number;
}
export interface IPost extends Document {
    postId: number;
    author: string;
    content: string;
    timestamp: Date;
    likes: number;
    chainId: number;
    txHash: string;
    blockNumber: number;
    comments: IComment[];
    tags: string[];
    mentions: string[];
    mediaUrls?: string[];
    edited: boolean;
    editedAt?: Date;
    isPromoted: boolean;
}
export declare const Post: mongoose.Model<IPost, {}, {}, {}, mongoose.Document<unknown, {}, IPost> & IPost & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=Post.d.ts.map