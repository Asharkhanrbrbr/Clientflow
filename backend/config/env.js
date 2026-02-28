import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  clientUrl: process.env.CLIENT_URL,
};
