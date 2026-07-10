import {body} from "express-validator";
import User from "../../models/user.model";

export const registerValidator = [
    body("name").trim().notEmpty().withMessage("Name is required").custom(async (value) => {
        const existingUser = await User.findOne({name: value});
        if (existingUser){
            throw new Error("Name is already taken");
        }
        return true;

    }),

    body("email")
    .trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Email must be a valid email address").normalizeEmail(),

    body("password").isLength({min: 8}).withMessage("Password must be at least 8 characters long"),
];

export const loginValidator = [
    body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Email must be in a valid email address"),

    body("password").notEmpty().withMessage("Password is required"),

];

export const verifyOtpValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email must be valid"),

  body("otp")
    .trim()
    .notEmpty().withMessage("OTP is required")
    .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits")
    .isNumeric().withMessage("OTP must contain only numbers"),
];