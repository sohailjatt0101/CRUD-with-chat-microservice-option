import {Request, Response} from "express";
import {registerUser, loginUser, verifyOTP, logoutUser} from "../services/auth.service";
import logger from "../utils/logger";
import { AuthRequest } from "../middlewares/auth.middleware";


// Register a new user
export const register = async(req : Request, res : Response) =>{
      logger.info(`BODY:, ${req.body}`);
    try {
        const {name, email, password} = req.body;
        const {user, token} = await registerUser(name, email, password);
        res.status(201).json({user, token});
    } catch (error : any){
        res.status(400).json({message : error.message});
    }
};

// login a user and send OTP
export const login = async(req : Request, res : Response) =>{
    try{
        const {email, password} = req.body;
        const result = await loginUser(email, password);
        res.status(200).json(result);

    } catch (error : any){
        res.status(401).json({message : error.message});
    }
};
// verify OTP and return user and token
export const verifyOtpController = async (req: Request, res: Response) =>{
    try{
        logger.info(`verify-otp endpoint hit with body: , ${req.body}`);
        const{email, otp} = req.body;
        const{user, token} = await verifyOTP(email, otp);
        res.status(200).json({user, token});
    } catch (err: any){
        res.status(400).json({message: err.message});
    }
};
// logout a user and delete session
export const logout = async( req: AuthRequest, res: Response) => {
    try{
        await logoutUser(req.userId!);
        res.status(200).json({message: "Logged out successfully"});
    
    } catch (err: any){
        res.status(400).json({message: err.message});
    }
};

