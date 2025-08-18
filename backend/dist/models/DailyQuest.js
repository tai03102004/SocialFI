import mongoose, { Schema } from "mongoose";
const DailyQuestSchema = new Schema({
    questId: { type: String, required: true, unique: true },
    questType: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    completionCriteria: { type: Schema.Types.Mixed, default: {} },
    timeLimit: { type: Number, required: true, default: 24 },
    rewards: {
        points: { type: Number, default: 100 },
        tokens: Number,
        nft: String,
    },
    difficulty: { type: Number, min: 1, max: 10, default: 5 },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    participants: [
        {
            address: { type: String, required: true, lowercase: true },
            status: {
                type: String,
                enum: ["pending", "completed", "failed"],
                default: "pending",
            },
            submittedAt: Date,
            result: Schema.Types.Mixed,
            prediction: String,
            actualResult: String,
        },
    ],
});
DailyQuestSchema.index({ questId: 1 });
DailyQuestSchema.index({ active: 1, expiresAt: 1 });
DailyQuestSchema.index({ createdAt: -1 });
export const DailyQuest = mongoose.model("DailyQuest", DailyQuestSchema);
//# sourceMappingURL=DailyQuest.js.map