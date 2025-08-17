import mongoose, { Document, Schema } from "mongoose";

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

const CommentSchema = new Schema<IComment>({
  author: {
    type: String,
    required: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 280,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

const PostSchema = new Schema<IPost>({
  postId: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  author: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 500,
  },
  timestamp: {
    type: Date,
    required: true,
    index: true,
  },
  likes: {
    type: Number,
    default: 0,
    index: true,
  },
  chainId: {
    type: Number,
    required: true,
  },
  txHash: {
    type: String,
    required: true,
    index: true,
  },
  blockNumber: {
    type: Number,
    required: true,
  },
  comments: [CommentSchema],
  tags: [
    {
      type: String,
      lowercase: true,
    },
  ],
  mentions: [
    {
      type: String,
      lowercase: true,
    },
  ],
  mediaUrls: [String],
  edited: {
    type: Boolean,
    default: false,
  },
  editedAt: Date,
  isPromoted: {
    type: Boolean,
    default: false,
  },
});

// Text index for search
PostSchema.index({ content: "text", tags: "text" });

// Compound index for trending posts
PostSchema.index({ likes: -1, timestamp: -1 });

// Method to extract tags and mentions
PostSchema.methods.extractTagsAndMentions = function () {
  const tagRegex = /#(\w+)/g;
  const mentionRegex = /@(\w+)/g;

  const tags = [...this.content.matchAll(tagRegex)].map((match) => match[1]);
  const mentions = [...this.content.matchAll(mentionRegex)].map(
    (match) => match[1]
  );

  this.tags = tags;
  this.mentions = mentions;
};

export const Post = mongoose.model<IPost>("Post", PostSchema);
