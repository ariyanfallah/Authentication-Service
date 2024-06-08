import { NextFunction, Request, Response } from "express";
import logger from "../Configs/logger";
import { generateAccessToken, generateRefreshToken } from "../Utils/tokenGenerator";
import { tokenVerify } from "../Utils/tokenVerify";

const tokenManagement = (req: Request, res: Response, next: NextFunction) => {
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
      logger.info(user);

        if (!user) {
          logger.warn("Refresh token invalid or expired");
          return next();
        }
        const newAccessToken = generateAccessToken(user.id);

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: true,
        });
        logger.info("New access token generated");
        const newRefreshToken = generateRefreshToken(user.id);
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
  const newAccessToken = generateAccessToken(user._id);
  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: true,
  });
  const newRefreshToken = generateRefreshToken(user._id);
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({message: "Already Logged In"});
};


// we will change this to work with whiteLists

export {tokenManagement};