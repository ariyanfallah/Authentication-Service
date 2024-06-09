import { Request, Response, NextFunction } from "express";
import { redisClient } from "../server";
import logger from "../Configs/logger";
import { tokenVerify } from "../Utils/tokenVerify";
import { generateAccessToken, generateRefreshToken } from "../Utils/tokenGenerator";

const authorization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies["accessToken"];
        const refreshToken = req.cookies["refreshToken"];
        const isBlacklist = await redisClient.lrange("blacklist" , 0 , -1);
        if(isBlacklist.includes(accessToken) || isBlacklist.includes(refreshToken)){
            logger.warn("Token is blacklisted")
            return res.status(401).json({message: "Unauthorized"});
        }

        if (!accessToken || !tokenVerify(accessToken)) {
            if(!refreshToken){
                logger.warn("No tokens provided");
                return res.status(401).json({message: "Unauthorized"});
            }
            if(!tokenVerify(refreshToken)){
                logger.warn("Unauthorized");
                return res.status(401).json({message: "Unauthorized"});
            }

            const isBlacklisted = await redisClient.lrange("blacklist" , 0 , -1);

            if (isBlacklisted.includes(accessToken) || isBlacklisted.includes(refreshToken)){
                return res.status(401).json({ message: "Token is blacklisted. Please log in again." });
            }
            const user = await tokenVerify(refreshToken);
            if(!user){
                logger.warn("Unauthorized");
                return res.status(401).json({message: "Unauthorized"});
            }
            const newAccessToken = generateAccessToken(user.id);
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: true,
            });
            const newRefreshToken = generateRefreshToken(user.id);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: true
            });
            // next();
            res.status(200).json({message: "Already Logged In"});
        }



        // next(); // Token is not blacklisted, proceed with the request
        res.status(200).json({message: "Already Logged In"});

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default authorization;

//blacklist is not checking correctly