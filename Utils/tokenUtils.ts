import { redisClient } from "../server";
import { tokenVerify } from "./tokenVerify";
import { generateAccessToken, generateRefreshToken } from "./tokenGenerator";
import logger from "../Configs/logger";
import { Response } from "express";

// Check if tokens are blacklisted
export const isTokenBlacklisted = async (accessToken: string, refreshToken: string) => {
    logger.info("Checking if tokens are blacklisted");
    const isBlacklist = await redisClient.lrange("blacklist", 0, -1);
    return isBlacklist.includes(accessToken) || isBlacklist.includes(refreshToken);
};

// Validate and regenerate tokens
export const validateAndRegenerateTokens = async (refreshToken: string, res: Response) => {
    logger.info("Checking if refresh token is valid");

    if (!tokenVerify(refreshToken)) {
        logger.warn("Unauthorized: Invalid refresh token");
        throw new Error("Unauthorized");
    }

    const user = tokenVerify(refreshToken);
    if (!user) {
        logger.warn("Unauthorized: User not found");
        throw new Error("Unauthorized");
    }

    logger.info("Generating new access token and refresh token");
    const newAccessToken = generateAccessToken(user.userId, user.email , user.name);
    const newRefreshToken = generateRefreshToken(user.userId, user.email , user.name);

    res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
    });

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
    });

    logger.info("Tokens regenerated successfully");
    return { user };
};

// Verify token and return user
export const verifyUserFromToken = (token: string) => {
    logger.info("Verifying token to fetch user");
    const user = tokenVerify(token);
    if (!user) {
        logger.warn("Unauthorized: User not found");
        throw new Error("Unauthorized");
    }
    return user;
};
