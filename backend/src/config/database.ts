import mongoose from "mongoose";

export const connect = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connect Success!");
  } catch (err) {
    console.error("Connect Error!", err);
  }
};
