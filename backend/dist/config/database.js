import mongoose from "mongoose";
export const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connect Success!");
    }
    catch (err) {
        console.error("Connect Error!", err);
    }
};
//# sourceMappingURL=database.js.map