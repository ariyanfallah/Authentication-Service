import { Request, Response } from "express";
import logger from "../Configs/logger";
import {validateEmail} from "../Utils/validateEmail";
import User from "../Models/User";
import bcrypt from "bcryptjs"
import { generateAccessToken, generateRefreshToken } from "../Utils/tokenGenerator";
import mongoose from "mongoose";

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

        const newId = new mongoose.Types.ObjectId();

        // const saltRounds = parseInt(process.env.HASH_SALT_ROUND || "10", 10);
        // const hashedPassword = await bcrypt.hash(password);
        bcrypt.genSalt(10, function(err, salt) {
            if(err){
                logger.warn(`Error in generating salt: ${err}`);
                return res.status(500).json({message: "Internal server error."});
            }
            bcrypt.hash(password, salt, async (err, hash) => {
                if(err){
                    logger.warn(`Error in hashing password: ${err}`);
                    return res.status(500).json({message: "Internal server error."});
                }
                const newUser = new User({
                    name,
                    email,
                    hashedPassword: hash,
                    userId: newId
                });
                await newUser.save();
                logger.info("User created successfully.");
                const accToken = generateAccessToken(String(newUser.userId) , newUser.email);
                const refToken = generateRefreshToken(String(newUser.userId) , newUser.email);
                res.cookie("accessToken", accToken);
                res.cookie("refreshToken", refToken);
                return res.status(201).json({message: "User created successfully."});

            });
        });
        
    } catch (error) {
        logger.warn(`Error in registration process: ${error}`);
        return res.status(500).json({message: "Internal server error."});
    }
};

export {register}