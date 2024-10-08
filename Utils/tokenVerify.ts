import jwt from "jsonwebtoken";
import logger from "../Configs/logger";


interface JwtPayload {
    userId: string;
    email: string;
    name: string;
  }
  
  const tokenVerify = (bearerToken: string): JwtPayload | null => {
      try {
          if (!bearerToken) {
              logger.warn("No token provided");
              return null;
          }
  
          const token = bearerToken.split(" ")[1];
          const tokenSecret = process.env.JWT_SECRET || "";
  
          const payload = jwt.verify(token, tokenSecret) as JwtPayload;
  
          logger.info("Token verified successfully");
          
          return payload;
  
      } catch (error) {
          if (error instanceof jwt.JsonWebTokenError) {
              logger.warn(`Failed to verify token: ${error}`);
              return null;
          } else {
              logger.error(`Error verifying token: ${error}`);
              return null;
          }
      }
  };
  
export {tokenVerify}

