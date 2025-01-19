import dotenv from "dotenv"
dotenv.config({ path: './.env' });
export default {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 4000,
    DATABASE: process.env.DATABASE,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE_IN: process.env.JWT_EXPIRE_IN,
    JWT_COOKIE_EXPIRE_IN: process.env.JWT_COOKIE_EXPIRE_IN,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    BUCKET_NAME: process.env.BUCKET_NAME,
    S3_FOLDER_NAME: process.env.S3_FOLDER_NAME,
    EMAIL_USERNAME: process.env.EMAIL_USERNAME,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
  }