import express from "express";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import authenticate from "./middlewares/authenticate.js";
import sessionRoutes from "./routes/session.route.js";
import cors from "cors";
import { corsOptions } from "./configs/cors.js";
import clientHintsMiddleware from "./middlewares/clientHints.js";
import trackSession from "./middlewares/trackSession.js";

const app = express();

// Security: Identify real user IPs behind proxies (Vercel, Render, AWS)
app.set("trust proxy", 1);

// Global Security/Standard Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Header-related Middlewares
app.use(clientHintsMiddleware);

// Health Check
app.get("/", (req, res) => {
  res.json({ status: "healthy" });
});

// Auth Routes
app.use("/api/auth", authRoutes);

// Protected Routes
app.use("/api/user", authenticate, trackSession, userRoutes);
app.use("/api/sessions", authenticate, trackSession, sessionRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
