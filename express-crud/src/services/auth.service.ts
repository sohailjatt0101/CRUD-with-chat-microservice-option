import bcrypt from "bcrypt";
import User from "../models/user.model";
import { generateToken } from "../utils/jwt";
import { generateOTP } from "../utils/otp";
import redisClient from "../config/redis";
import { errorMonitor } from "node:events";
import logger from "../utils/logger";

const OTP_TTL = Number(process.env.OTP_TTL) || 300;
const TOKEN_TTL = Number(process.env.TOKEN_TTL) || 84600; // 24 hours in seconds

logger.info(`OTP TTL resolve to : ${OTP_TTL}`);
logger.info(`TOKEN TTL resolve to : ${TOKEN_TTL}`);

export const registerUser = async (name: string, email: string, password: string) => {
    const existing = await User.findOne({ email });
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = generateToken(user._id.toString(), user.name);
    return { user, token };
};

export const loginUser = async (email: string, password: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid password");

    const otp = generateOTP();

    console.log(`OTP for ${email}: ${otp}`);

    await redisClient.setex(`otp:${normalizedEmail}`, OTP_TTL, otp);

    const verifyImmediately = await redisClient.get(`otp:${normalizedEmail}`);
    logger.info(`Immediate re-read after setex:, ${verifyImmediately}`);

    logger.info(`OTP for ${email}: ${otp}`);
    logger.info(`Setting OTP with key:, otp:${normalizedEmail}`);

    return { message: "OTP sent to your email", email };
};

export const verifyOTP = async (email: string, otp: string) => {

    const normalizedEmail = email.toLowerCase().trim();

    // Here i was not calling the normalizedEmail 

    const storedOTP = await redisClient.get(`otp:${normalizedEmail}`);

    logger.info(`Looking up OTP with key:, otp:${normalizedEmail}`);

    logger.info(`Stored OTP in Redis:, ${storedOTP}`);
    logger.info(`OTP received from request:, ${otp}`);

    if (!storedOTP) throw new Error("OTP expired or not found. please login again");
    if (storedOTP !== otp.trim()) throw new Error("Invalid OTP");

    await redisClient.del(`otp:${email}`);

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    // store the session so it can e checked/revoked later

    const token = generateToken(user._id.toString(), user.name);

    const result = await redisClient.setex(`session:${user._id}`, TOKEN_TTL, token);

    console.log("Session write result:", result);
    console.log("Session key used:", `session:${user._id}`);
    return { user, token };
}

export const logoutUser = async (userId: string) => {
    await redisClient.del(`session: ${userId}`);
}

