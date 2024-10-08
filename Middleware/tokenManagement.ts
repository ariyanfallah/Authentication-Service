import { NextFunction, Request, Response } from "express";
import logger from "../Configs/logger";
import { generateAccessToken, generateRefreshToken } from "../Utils/tokenGenerator";
import { tokenVerify } from "../Utils/tokenVerify";
import { redisClient } from "../server";

const tokenManagement = async (req: Request, res: Response, next: NextFunction) => {
  logger.info("Initiating token authorization");
  const accessToken = req.cookies["accessToken"];
  const refreshToken = req.cookies["refreshToken"];

  if (!accessToken && !refreshToken) {
    logger.info("No tokens provided");
    return next();
  }

  // Verify the access token
  let user: any | null;
  logger.info("Verifying access token");
  const tokenBlacklist = await redisClient.lrange(`blacklist` , 0 , -1);
  if(tokenBlacklist.includes(accessToken) || tokenBlacklist.includes(refreshToken)){
    logger.warn("Token Blacklisted");
    return next();
  }


  user = tokenVerify(accessToken);

    if(!user) {
      logger.warn("Access token invalid or expired, verifying refresh token");

      if (!refreshToken) {
        logger.info("No refresh token provided");
        return next();
      }

      let user: any | null;
      logger.info("Verifying refresh token");
      user = tokenVerify(refreshToken);

        if (!user) {
          logger.warn("Refresh token invalid or expired");
          return next();
        }
        const newAccessToken = generateAccessToken(user.userId , user.email , user.name );

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: true,
        });
        logger.info("New access token generated");
        const newRefreshToken = generateRefreshToken(user.userId , user.email , user.name);
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true
        });
        // fetch session if exists
        logger.info("new refreshToken generated");
        return res.status(200).json({message: "Already Logged In"});

    }
  // If access token is valid, proceed
  logger.info("Access token is valid");
  const newAccessToken = generateAccessToken(user.userId , user.email , user.name);
  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: true,
  });
  const newRefreshToken = generateRefreshToken(user.userId , user.email , user.name);
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({message: "Already Logged In"});
};

export {tokenManagement};