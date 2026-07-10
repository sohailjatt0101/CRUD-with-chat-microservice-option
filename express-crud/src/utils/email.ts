import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "@gmail",
    auth: {
        user:process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOTPEmail = async (to: string, otp: string) =>{
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "Your Login OTP",
        text: `Your OTP is ${otp}. it is valid for 5 minutes`,
    });
};