import jwt from "jsonwebtoken";

const generateAccessToken = (userID: string) => {
  const options = {
    expiresIn: process.env.JWT_ACCESS_EXPIRE || "1h",
  };
  const payload = {
    userID
  };
  return `Bearer ${generateToken(options, payload)}`;
};

const generateRefreshToken = (phoneNumber: string) => {
  const options = { expiresIn: process.env.JWT_REFRESH_EXPIRE || "72h" };
  const payload = {
    phoneNumber
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
