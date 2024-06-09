import { Request, Response } from "express";
import { redisClient } from "../server";
import { tokenVerify } from "../Utils/tokenVerify";
import { verify } from "jsonwebtoken";
import logger from "../Configs/logger";

const logoutController = async (req: Request, res: Response) => {
    try {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if (!accessToken && !refreshToken) {
            return res.status(400).json({message: "No tokens provided"});
        }

        if(!accessToken){
            if(!tokenVerify(refreshToken)){
                logger.warn("Unauthorized");
                return res.status(401).json({message: "Unauthorized"});
            }
            if (accessToken) {
                await redisClient.set(`blacklist:${accessToken}`, 'true', 'EX', 60 * 60);
            }
            if (refreshToken) {
                await redisClient.set(`blacklist:${refreshToken}`, 'true', 'EX', 60 * 60);
            }
    
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            logger.info("Logged out successfully...");
            return res.status(200).json({message: "Logged out successfully"});
        }

        if(!tokenVerify(accessToken) || !tokenVerify(refreshToken)){
            return res.status(401).json({message: "Unauthorized"});
        }

        if (accessToken) {
            await redisClient.rpush(`blacklist`, accessToken);
            const tokenBlacklistStatus = await redisClient.lrange(`blacklist` , 0 , -1);
            logger.warn(`Blacklist status...${tokenBlacklistStatus}`);
        
        }
        if (refreshToken) {
            await redisClient.rpush(`blacklist` , refreshToken);
            const tokenBlacklistStatus = await redisClient.lrange(`blacklist` , 0 , -1);
            logger.warn(`Blacklist status ...${tokenBlacklistStatus}`);
        }

        // res.clearCookie("accessToken");
        // res.clearCookie("refreshToken");
        logger.info("Logged out successfully...");
        return res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        logger.error(`Internal server error: ${error}`)
        return res.status(500).json({message: "Internal server error"});
    }
};

export {logoutController}