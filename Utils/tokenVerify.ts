import jwt from "jsonwebtoken";
import logger from "../Configs/logger";


const tokenVerify = (token: string , tokenSecret: string) => {
    jwt.verify(token, tokenSecret, (err: any, user: any) => {
        if (err) {
            logger.warn(`Failed to verify token: ${err}`);
            return null;
        } else if (user){
            logger.info("Token verified successfully");
            return user;
        } 
        return null;
      });
};

export {tokenVerify}