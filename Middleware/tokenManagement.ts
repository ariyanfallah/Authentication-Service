import { NextFunction, Request, Response } from "express";
import logger from "../Configs/logger";
import { generateAccessToken, generateRefreshToken } from "../Utils/tokenGenerator";
import { tokenVerify } from "../Utils/tokenVerify";

const tokenAuthorize = (req: Request, res: Response, next: NextFunction) => {
  logger.info("Initiating token authorization");
  const accessToken = req.cookies["accessToken"];
  const refreshToken = req.cookies["refreshToken"];

  const accessSecret = process.env.JWT_SECRET || "";
  const refreshSecret = process.env.JWT_SECRET || "";

  if (!accessToken && !refreshToken) {
    logger.error("No tokens provided");
    return res.status(401).json({ message: "No tokens provided" });
  }

  // Verify the access token
  let user: any | null;
  user = tokenVerify(accessToken, accessSecret);

    if(!user) {
      logger.warn("Access token invalid or expired, verifying refresh token");

      if (!refreshToken) {
        logger.error("No refresh token provided");
        return res.status(401).json({ message: "Unauthorized. No refresh token provided" });
      }

      let user: any | null;
      user = tokenVerify(refreshToken, refreshSecret);

        if (!user) {
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
        logger.info("New access token generated");

        const newRefreshToken = generateRefreshToken(user._id);
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true
        });
        // fetch session if exists
        logger.info("new refreshToken generated");
        next();

    }


      

  // If access token is valid, proceed
  logger.info("Access token is valid");
  const newAccessToken = generateAccessToken(user._id);
  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: true,
  });
  // fetch session if exists
  next();
  
};


// we will change this to work with whiteLists

export {tokenAuthorize};