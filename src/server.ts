import http, { Server } from "http";
import mongoose from "mongoose";
import { Server as SocketIOServer } from "socket.io";
import app from "./app";
import config from "./app/config";
import { setSocketIO } from "./app/socket/socket"; // optional, explained below

let server: Server | null = null;

// Database connection
async function connectToDatabase() {
  try {
    await mongoose.connect(config.db_url as string);
    console.log("🛢 Database connected successfully");
  } catch (err) {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  }
}

// Graceful shutdown
function gracefulShutdown(signal: string) {
  console.log(`📦 Received ${signal}. Closing server...`);
  if (server) {
    server.close(() => {
      console.log("✅ Server closed gracefully");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

// Application bootstrap
async function bootstrap() {
  try {
    await connectToDatabase();

    // Create HTTP server from Express app
    const httpServer = http.createServer(app);

    // Initialize Socket.IO with CORS config
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: ["http://localhost:3000", "http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    // Optional: make `io` available globally via custom setter
    setSocketIO(io);

    // Define basic socket events
    io.on("connection", (socket) => {
      console.log(`🟢 Socket connected: ${socket.id}`);

      socket.on("message", (data) => {
        console.log("📨 Received message:", data);
        io.emit("message", data);
      });

      socket.on("disconnect", () => {
        console.log(`🔴 Socket disconnected: ${socket.id}`);
      });
    });

    // Start server
    server = httpServer.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
    });

    // Listen for termination signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle uncaught errors
    process.on("uncaughtException", (error) => {
      console.error("❗ Uncaught Exception:", error);
      gracefulShutdown("uncaughtException");
    });

    process.on("unhandledRejection", (error) => {
      console.error("❗ Unhandled Rejection:", error);
      gracefulShutdown("unhandledRejection");
    });
  } catch (error) {
    console.error("❌ Error during bootstrap:", error);
    process.exit(1);
  }
}

bootstrap();
