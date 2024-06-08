import jwt, { JwtPayload } from "jsonwebtoken";
import logger from "../Configs/logger";


const tokenVerify = (bearerToken: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (!bearerToken) {
            logger.warn("No token provided");
            reject("No token provided");
        }
        const token = bearerToken.split(" ")[1];
        const tokenSecret = process.env.JWT_SECRET || "";
        jwt.verify(token, tokenSecret, (err: any, payload: any) => {
            if (err) {
                logger.warn(`Failed to verify token: ${err}`);
                return null;
            } else if(!payload){
                logger.warn("No payload found in token");
                return null;
            }
            logger.info("Token verified successfully");
            return payload;
             
        });
    });
    
};

export {tokenVerify}

