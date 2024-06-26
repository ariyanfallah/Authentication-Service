import express from 'express';
import RedisStore from 'connect-redis';
import { redisCreateClient } from './Lib/redisClient';
import session from 'express-session';

import cookieParser from 'cookie-parser';
import 'dotenv/config';
import mongoose from 'mongoose';
import { mongoDB } from './Configs/mongoDB';
import logger from './Configs/logger'

import registerRouter from './Routes/register';
import loginRouter from './Routes/login'
import logoutRouter from './Routes/logout'
import authRouter from './Routes/auth'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.APP_PORT || 3000;

app.set('trust proxy', 1);

// mongoose.connect(`mongodb://${mongoDB.user}:${mongoDB.pass}@${mongoDB.host}:${mongoDB.port}/${mongoDB.name}${mongoDB.link}`)
// mongoose.connect(`mongodb://${mongoDB.host}:${mongoDB.port}/${mongoDB.name}${mongoDB.link}`)
//   .then(() => logger.info('Connected to MongoDB...'))
//   .catch(err => console.log(err));

mongoose.connect(mongoDB.URI || "mongodb://mongo:27017/Authentication")
.then(() => logger.info("Connected to MongoDB..."))
.catch((err) => logger.warn(`Error connecting to MongoDB ${err}`))

export const redisClient = redisCreateClient();
  
app.use(session({
secret: process.env.SESSION_SECRET || 'mySecret',
resave: false,
saveUninitialized: false,
store: new RedisStore({ client: redisClient }),
cookie: { maxAge: 1000 * 60 * 45 }
}));

app.use("/auth" , registerRouter);
app.use("/auth" , loginRouter);
app.use("/auth" , logoutRouter);
app.use("/auth" , authRouter);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});