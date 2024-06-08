import { Request, Response } from "express";
import logger from "../Configs/logger";
import { validateEmail } from "../Utils/validateEmail";
import User from "../Models/User";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../Utils/tokenGenerator";

const loginController = async (req: Request , res: Response) => {

    try {
    
        logger.info("Initiating login process...");
        const {email, password} = req.body;

        if(!email || !password){
            logger.warn("All fields required.")
            return res.status(400).json({message: "Please fill all the fields."});
        }

        if(!validateEmail(email)){
            logger.warn("Invalid email");
            return res.status(400).json({message: "Invalid Email"});
        }

        const user = await User.findOne({email}); 
        
        if(!user){
            logger.warn("Invalid email or password");
            return res.status(401).json({message:"Invalid email or password"})
        }
        
        bcrypt.compare(password, user.hashedPassword, (err, isMatch) => {
            if(err){
                logger.error(`Error in comparing password ${err}"`);
                return res.status(500).json({message: "Internal server error"});
            }

            if(!isMatch){
                logger.warn("Invalid email or password");
                return res.status(401).json({message:"Invalid email or password"});
            }

            logger.info("Successfuly loggedIn.")
            const accToken = generateAccessToken(user._id);
            const refToken = generateRefreshToken(user._id);
            res.cookie("accessToken", accToken);
            res.cookie("refreshToken", refToken);
            return res.status(202).json({message: "Logged in successfuly"});
        });
       
    } catch (error) {
        logger.error(`Error in loginController: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }

};

export {loginController}