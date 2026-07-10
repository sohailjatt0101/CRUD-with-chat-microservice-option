import mongoose from "mongoose";
import process from "process";

export const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Chat DB connected ");
    }
    catch (err) {
        console.error("chat DB connection failed", err);
        process.exit(1);
    }
};

