import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import mongoose from 'mongoose';
import { mongoDB } from './Configs/mongoDB';
import logger from './Configs/logger'

import registerRouter from './Routes/register';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.APP_PORT || 3000;

// mongoose.connect(`mongodb://${mongoDB.user}:${mongoDB.pass}@${mongoDB.host}:${mongoDB.port}/${mongoDB.name}${mongoDB.link}`)
mongoose.connect(`mongodb://${mongoDB.host}:${mongoDB.port}/${mongoDB.name}${mongoDB.link}`)
  .then(() => logger.info('Connected to MongoDB...'))
  .catch(err => console.log(err));

app.use("/auth" , registerRouter);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});