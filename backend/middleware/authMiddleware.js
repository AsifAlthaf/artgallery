import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import admin from "firebase-admin";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

let serviceAccount = null;
try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    // Render Deployment
    serviceAccount = {
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    };
  } else {
    // Local Development
    serviceAccount = require("../serviceAccountKey.json");
  }
} catch (error) {
  console.warn("⚠️ Firebase Service Account missing. Google Sign-in verification will fail locally, but Email/Password JWT will still work.");
}

// Initialize Firebase Admin SDK
if (serviceAccount && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Protect routes (only logged-in users can access)
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Secure Administrative Bypass (for the master admin token)
      if (process.env.VITE_ADMIN_TOKEN && token === process.env.VITE_ADMIN_TOKEN) {
         req.user = { _id: 'admin_master_1', isAdmin: true };
         return next();
      }

      // First try JWT (for your own issued tokens)
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
      } catch {
        // If JWT fails, try Firebase
        const decodedToken = await admin.auth().verifyIdToken(token);
        if (!decodedToken || !decodedToken.uid) {
          throw new Error("Invalid Google/Firebase token");
        }
        req.user = await User.findOne({ googleId: decodedToken.uid }).select("-password");
      }

      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Admin middleware
const adminOnly = (req, res, next) => {
  if (req.user?.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
};

// Artist middleware
const artistOnly = (req, res, next) => {
  if (req.user?.isArtist) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an artist");
  }
};

export { protect, adminOnly as admin, artistOnly as artist };
