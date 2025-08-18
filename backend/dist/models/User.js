import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema({
    address: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
    },
    username: {
        type: String,
        sparse: true,
        minlength: 3,
        maxlength: 20,
        match: /^[a-zA-Z0-9_]+$/,
    },
    email: {
        type: String,
        sparse: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    profileImage: String,
    bio: {
        type: String,
        maxlength: 160,
    },
    socialScore: { type: Number, default: 0, index: true },
    gameScore: { type: Number, default: 0, index: true },
    totalPredictions: { type: Number, default: 0 },
    correctPredictions: { type: Number, default: 0 },
    stakedAmount: { type: String, default: "0" },
    preferredAsset: { type: String, default: "" },
    achievements: [{ type: String }],
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now, index: true },
    createdAt: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    socialLinks: {
        twitter: String,
        discord: String,
        telegram: String,
    },
});
// Index for search
UserSchema.index({ username: "text", address: "text" });
// Virtual for accuracy rate
UserSchema.virtual("accuracyRate").get(function () {
    return this.totalPredictions > 0
        ? ((this.correctPredictions / this.totalPredictions) * 100).toFixed(2)
        : 0;
});
// Virtual for engagement score
UserSchema.virtual("engagementScore").get(function () {
    return this.socialScore + this.gameScore;
});
UserSchema.set("toJSON", { virtuals: true });
export const User = mongoose.model("User", UserSchema);
//# sourceMappingURL=User.js.map