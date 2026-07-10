import {Router} from "express";
import {register, login, verifyOtpController, logout} from "../controllers/auth.controller";
import { registerValidator, loginValidator, verifyOtpValidator } from "../middlewares/validators/auth.validator";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";


const router = Router();

router.post("/register", registerValidator,validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/verify-otp", verifyOtpValidator,validate, verifyOtpController);
router.post("/logout", authenticate, logout);
export default router;
