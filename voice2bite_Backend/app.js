import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import registerRoute from "./routes/auth.route.js";
import customerRoute from "./routes/customer.route.js";
import hotelAdminRoute from "./routes/hotelAdmin.route.js";
import companyAdminRoute from "./routes/companyAdmin.route.js";
import searchRoute from "./routes/search.routes.js";
import cookieParser from 'cookie-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { rateLimiter } from './middlewares/rateLimiter.js';
import http from 'http';
import { initSocket } from './lib/socket.js';
import { initWorker } from './workers/orderWorker.js';

dotenv.config({ path: "./.env" });
export const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

// Initialize Socket.io and Worker
initSocket(server);
initWorker();


app.use(
  helmet({
    contentSecurityPolicy: envMode !== "DEVELOPMENT",
    crossOriginEmbedderPolicy: envMode !== "DEVELOPMENT",
  })
);
app.use(cookieParser());


app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:3000", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, 
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api", registerRoute);
app.use("/api/customer", customerRoute);
app.use("/api/hotelAdmin", hotelAdminRoute);
app.use("/api/companyAdmin", companyAdminRoute);
app.use("/api/search", searchRoute);

// API Gateway Proxy for Voice Service (Phase 3)
app.use(
  "/api/voice",
  rateLimiter({ capacity: 5, refillRate: 1, keyPrefix: 'ratelimit:voice:' }),
  createProxyMiddleware({
    target: "http://127.0.0.1:5000",
    changeOrigin: true,
    pathRewrite: {
      "^/api/voice": "",
    },
  })
);

// 404 Handler
// app.all("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Page not found",
//   });
// });

// Global error handler
app.use(errorMiddleware);

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port} in ${envMode} mode.`);
});
