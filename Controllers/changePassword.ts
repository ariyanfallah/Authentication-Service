import {Request , Response} from 'express'
import logger from '../Configs/logger';
import { tokenVerify } from '../Utils/tokenVerify';
import User from '../Models/User';
import bcrypt from "bcryptjs"


const changePasswordController = async (req: Request , res: Response) => {
    try {
        logger.info("initilizing change password controller...")

        const {oldPassword, newPassword , repeatNewPassword} = req.body;

        if(!oldPassword || !newPassword || !repeatNewPassword){
            logger.warn("All fields are required")
            return res.status(400).json({message: "All fields are required"})
        }

        if(newPassword !== repeatNewPassword){
            logger.warn("New passwords must match")
            return res.status(400).json({message: "New passwords must match"})
        }

        const token = req.cookies["accessToken"];

        if(!token){
            logger.warn("No token provided");
            return res.status(401).json({message: "Unauthorized"})
        }

        const tokenPayload = tokenVerify(token)

        if(!tokenPayload){
            logger.warn("Unverified token");
            return res.status(401).json({message: "Unauthorized"})
        }

        const userId = tokenPayload.userId;

        if(!userId){
            logger.warn("No userId provided in token");
            return res.status(401).json({message: "Unauthorized"})
        }

        const user = await User.findOne({userId});

        if(!user){
            logger.warn("User wasn't found")
            return res.status(404).json({message: "User not found"})
        }

        const currentHashedPassword = user.hashedPassword;


        try{
            const isPasswordValid = await bcrypt.compare(oldPassword, user.hashedPassword);
            if (!isPasswordValid) {
                logger.warn("Old password is incorrect");
                return res.status(400).json({ message: "Old password is incorrect" });
            }
        } catch(err){
            logger.error(`Error while comparing old password: ${err}`)
            return res.status(500).json({message: "Internal server error."})
        }

        bcrypt.genSalt(10, function(err, salt) {
            logger.info("Initilizing generating salt...")

            if(err){
                logger.warn(`Error in generating salt: ${err}`);
                return res.status(500).json({message: "Internal server error."});
            }

            bcrypt.hash(newPassword , salt , async (err , hash) => {
                logger.info("Initilizing hashing new password...")

                if(err){
                    logger.warn(`Error in hashing password: ${err}`);
                    return res.status(500).json({message: "Internal server error."});
                }

                user.hashedPassword = hash;

                await user.save();

                logger.info("Successfully changed password")

                return res.status(200).json({message: "Successfuly changed password"})
            })
        });

    } catch (error) {
        logger.error(`Error changing password: ${error}`)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export {changePasswordController}