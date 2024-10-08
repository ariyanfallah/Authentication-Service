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
            logger.warn("User doesn't exist");
            return res.status(404).json({message:"User doesn't exist"})
        }
        
        bcrypt.compare(password, user.hashedPassword, (err, isMatch) => {
            if(err){
                logger.error(`Error in comparing password ${err}"`);
                return res.status(500).json({message: "Internal server error"});
            }

            if(!isMatch){
                logger.warn("Invalid email or password");
                return res.status(406).json({message:"Invalid email or password"});
            }

            logger.info("Successfuly loggedIn.")
            const accToken = generateAccessToken(String(user.userId) , user.email , user.name);
            const refToken = generateRefreshToken(String(user.userId), user.email , user.name);
            res.cookie("accessToken", accToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax"
              });
              res.cookie("refreshToken", refToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax"
              });
            user.lastLogin = new Date();
            user.save();
            return res.status(202).json({message: "Logged in successfuly" , accessToken:accToken, refreshToken:refToken});
        });
       
    } catch (error) {
        logger.error(`Error in loginController: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }

};

export {loginController}