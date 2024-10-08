import { Request, Response, NextFunction } from "express";
import logger from "../Configs/logger";
import { isTokenBlacklisted, validateAndRegenerateTokens, verifyUserFromToken } from "../Utils/tokenUtils";

const authorization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info("Initializing authorization");
        
        const accessToken = req.cookies["accessToken"];
        const refreshToken = req.cookies["refreshToken"];

        if (await isTokenBlacklisted(accessToken, refreshToken)) {
            logger.warn("Token is blacklisted");
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!accessToken || !verifyUserFromToken(accessToken)) {
            if (!refreshToken) {
                logger.warn("No tokens provided");
                return res.status(401).json({ message: "Unauthorized" });
            }

            try {
                const { user } = await validateAndRegenerateTokens(refreshToken, res);
                return res.status(200).json({ message: "Already logged in", user });
            } catch (error: any) {
                return res.status(401).json({ message: error.message });
            }
        }

        const user = verifyUserFromToken(accessToken);
        return res.status(200).json({ message: "Already logged in", user });

    } catch (error: any) {
        logger.error(`Error during authorization: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default authorization;
