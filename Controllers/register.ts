import { Request, Response } from "express";
import logger from "../Configs/logger";
import {validateEmail} from "../Utils/validateEmail";
import User from "../Models/User";
import argon2 from "argon2";

const register = async (req:Request , res: Response) => {
    logger.info("Initiating registration process...");

    try {
        const {name , email , password} = req.body;
        if(!name || !email || !password){
            logger.warn("All fields are required.");
            return res.status(400).json({message: "Please fill all the fields."});
        }
        if(!validateEmail(email)){
            logger.warn("Invalid email.");
            return res.status(400).json({message: "Invalid email."});
        }
        
        const user = await User.findOne({email});
        
        if(user){
            logger.warn("Email already exists.");
            return res.status(400).json({message: "Email already exists."});
        }
        
        logger.info("Creating new user...");

        // const saltRounds = parseInt(process.env.HASH_SALT_ROUND || "10", 10);
        const hashedPassword = await argon2.hash(password);
        if(!hashedPassword){
            logger.warn("Error in hashing password.");
            return res.status(500).json({message: "Internal server error."});
        }
        const newUser = new User({
            name,
            email,
            hashedPassword
        });
        await newUser.save();
        logger.info("User created successfully.");
        return res.status(201).json({message: "User created successfully."});
        
        

    } catch (error) {
        logger.warn(`Error in registration process: ${error}`);
        return res.status(500).json({message: "Internal server error."});
    }
};

export {register}