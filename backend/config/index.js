// backend/config/index.js

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend/.env first, then workspace-root .env as fallback.
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envNumber = (value, fallback) => {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeEmailPassword = (rawValue = '') => {
  // Supports values copied with trailing comments, e.g. "xxxx xxxx xxxx xxxx # app password".
  const withoutComment = rawValue.split('#')[0].trim();
  return withoutComment.replace(/\s+/g, '');
};

const emailHost = process.env.EMAIL_SERVICE_HOST || process.env.EMAIL_HOST;
const emailPort = envNumber(process.env.EMAIL_SERVICE_PORT || process.env.EMAIL_PORT, 587);
const emailUser = process.env.EMAIL_SERVICE_USER || process.env.EMAIL_USER;
const emailPass = normalizeEmailPassword(process.env.EMAIL_SERVICE_PASS || process.env.EMAIL_PASS || '');

const config = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  EMAIL_SERVICE_HOST: emailHost,
  EMAIL_SERVICE_PORT: emailPort,
  EMAIL_SERVICE_USER: emailUser,
  EMAIL_SERVICE_PASS: emailPass,
  EMAIL_HOST: emailHost,
  EMAIL_PORT: emailPort,
  EMAIL_USER: emailUser,
  EMAIL_PASS: emailPass,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  NODE_ENV: process.env.NODE_ENV
};

export default config;