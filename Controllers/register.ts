import { Request, Response } from "express";
import logger from "../Configs/logger";
import Participant from "../Models/Participant";
import bcrypt from "bcrypt";
import {validateEmail} from "../Utils/validateEmail";

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
        
        const user = await Participant.findOne({email});
        
        if(user){
            logger.warn("Email already exists.");
            return res.status(400).json({message: "Email already exists."});
        }
        
        logger.info("Creating new user...");

        const saltRounds = parseInt(process.env.HASH_SALT_ROUND || "10", 10);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        if(!hashedPassword){
            logger.warn("Error in hashing password.");
            return res.status(500).json({message: "Internal server error."});
        }
        const newUser = new Participant({
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