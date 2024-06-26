const dbHost = process.env.DB_HOST || "mongodb";
const dbPort = process.env.DB_PORT || 27017;
const dbName = process.env.DB_NAME || "Authentication";
const dbUser = process.env.DB_USER || "";
const dbPass = process.env.DB_PASS || "";
const dbLink = process.env.DB_LINK || "";

export const mongoDB = {
  host: dbHost,
  port: dbPort,
  name: dbName,
  user: dbUser,
  pass: dbPass,
  link: dbLink,
  URI:`${dbHost}://mongo:${dbPort}/${dbName}`
};