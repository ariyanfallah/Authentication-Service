import { Request, Response, NextFunction } from "express";
import { redisClient } from "../server";
import logger from "../Configs/logger";
import { tokenVerify } from "../Utils/tokenVerify";
import { generateAccessToken, generateRefreshToken } from "../Utils/tokenGenerator";

const authorization = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Initializing authorization")
    try {
        logger.info("fetching accessToken")
        const accessToken = req.cookies["accessToken"];
        logger.info("fetching refreshToken")
        const refreshToken = req.cookies["refreshToken"];
        
        logger.info("Getting redis isBlacklist")
        const isBlacklist = await redisClient.lrange("blacklist" , 0 , -1);
        logger.info("Fetched isBlackListed")

        logger.info("Checking if tokens are blackListed")
        if(isBlacklist.includes(accessToken) || isBlacklist.includes(refreshToken)){
            logger.warn("Token is blacklisted")
            return res.status(401).json({message: "Unauthorized"});
        }

        logger.info("Cheching if accessToken doesn't exist or is invalid")
        if (!accessToken || !tokenVerify(accessToken)) {
            logger.warn("AccessToken doesn't exist or invalid perecidure started")
            logger.info("Cheching if accessToken doesn't exist")
            if(!refreshToken){
                logger.warn("No tokens provided");
                return res.status(401).json({message: "Unauthorized"});
            }
            logger.info("Cheching if refreshToken isn valid")
            if(!tokenVerify(refreshToken)){
                logger.warn("Unauthorized");
                return res.status(401).json({message: "Unauthorized"});
            }
            logger.info("RefreshToken was valid now we continue to regenerate tokens if it isn't blacklisted")
            logger.info("Getting redis isBlacklist")
            const isBlacklisted = await redisClient.lrange("blacklist" , 0 , -1);
            logger.info("Fetched isBlackListed")

            logger.info("Checking if access or refresh token is blacklisted")
            if (isBlacklisted.includes(accessToken) || isBlacklisted.includes(refreshToken)){
                logger.warn("Token was blacklisted")
                return res.status(401).json({ message: "Token is blacklisted. Please log in again." });
            }

            logger.info("Fetching user with verifying refresh token")

            const user = tokenVerify(refreshToken);

            if(!user){
                logger.info("User didn't exist")
                logger.warn("Unauthorized");
                return res.status(401).json({message: "Unauthorized"});
            }
            
            logger.info("Generating new AccessToken")
            const newAccessToken = generateAccessToken(user.userId , user.email);
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: true,
            });
            logger.info("Generating new RefreshToken")
            const newRefreshToken = generateRefreshToken(user.userId, user.email);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: true
            });
            logger.info("Precedure finished successfully")
            return res.status(200).json({message: `Already Logged In As ${user.email} `});
        }
        
        logger.info("accessToken existed and was valid")

        logger.info("Fetching user with verify accessToken")
        const user = tokenVerify(accessToken);
        if(!user){
            logger.info("User didn't exist")
            logger.warn("Unauthorized");
            return res.status(401).json({message: "Unauthorized"});
        }

        return res.status(200).json({message: `Already Logged In As: ${user.email}`});

    } catch (error) {
        logger.error(`Error authorizing : ${error}`)
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default authorization;
