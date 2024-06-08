import jwt from "jsonwebtoken";
import {Types} from "mongoose";
import logger from "../Configs/logger";


const generateAccessToken = (userID: Types.ObjectId) => {
  logger.info("Generating access token");
  const options = {
    expiresIn: process.env.JWT_ACCESS_EXPIRE || "1h",
  };
  const payload = {
    id: userID,
  };
  return `Bearer ${generateToken(options, payload)}`;
};

const generateRefreshToken = (userID: Types.ObjectId) => {
  logger.info("Generating refresh token");
  const options = { expiresIn: process.env.JWT_REFRESH_EXPIRE || "72h" };
  const payload = {
    id: userID
  };
  return `Bearer ${generateToken(options, payload)}`;
};

const generateToken = (options: object, payload: object) => {
  const secretKey = process.env.JWT_SECRET || "";
  const token = jwt.sign(payload, secretKey, options);
  return token;
};

export default generateToken;
export { generateAccessToken, generateRefreshToken };
