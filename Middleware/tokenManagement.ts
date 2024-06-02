import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import logger from "../Configs/logger";
import { generateAccessToken, generateRefreshToken } from "../Utils/tokenGenerator";

const tokenAuthorize = (req: Request, res: Response, next: NextFunction) => {
  logger.info("Initiating token authorization");
  const accessToken = req.cookies["accessToken"];
  const refreshToken = req.cookies["refreshToken"];

  const accessSecret = process.env.ACCESS_TOKEN_SECRET || "";
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET || "";

  if (!accessToken && !refreshToken) {
    logger.error("No tokens provided");
    return res.status(401).json({ message: "No tokens provided" });
  }

  // Verify the access token
  jwt.verify(accessToken, accessSecret, (err: any, user: any) => {
    logger.info("Initiated verifying access token");
    if (err) {
      // If access token is invalid or expired, try verifying the refresh token
      logger.warn("Access token invalid or expired, verifying refresh token");

      if (!refreshToken) {
        logger.error("No refresh token provided");
        return res.status(401).json({ message: "No refresh token provided" });
      }

      jwt.verify(refreshToken, refreshSecret, (err: any, user: any) => {
        if (err) {
          logger.error("Refresh token invalid or expired");
          return res
            .status(403)
            .json({ message: "Refresh token invalid or expired" });
        }

        const newAccessToken = generateAccessToken(user._id);
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: true,
        });
        logger.info("New access token generated from refresh token");

        const newRefreshToken = generateRefreshToken(user._id);
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true
        });
        logger.info("new refreshToken generated");
        next();
      });
    } else {
      // If access token is valid, proceed
      logger.info("Access token is valid");
      const newAccessToken = generateAccessToken(user._id);
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
      });

      next();
    }
  });
  next();
};


// we will change this to work with whiteLists