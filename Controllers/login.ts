import { Request, Response } from "express";
import logger from "../Configs/logger";
import { validateEmail } from "../Utils/validateEmail";
import User from "../Models/User";
import argon2 from "argon2";

const loginController = async (req: Request , res: Response) => {

    try {
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
        
        const isMatch = await argon2.verify(password , user.hashedPassword);

        if(!isMatch){
            logger.warn("Invalid email or password");
            return res.status(401).json({message:"Invalid email or password"});
        }

        logger.info("Successfuly loggedIn.")
        return res.status(202).json({message: "Logged in successfuly"});
        


    } catch (error) {
        logger.error(`Error in logging in controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }

};

export {loginController}