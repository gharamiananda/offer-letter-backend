"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
const socket_1 = require("./app/socket/socket"); // optional, explained below
let server = null;
// Database connection
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.db_url);
            console.log("🛢 Database connected successfully");
        }
        catch (err) {
            console.error("❌ Failed to connect to database:", err);
            process.exit(1);
        }
    });
}
// Graceful shutdown
function gracefulShutdown(signal) {
    console.log(`📦 Received ${signal}. Closing server...`);
    if (server) {
        server.close(() => {
            console.log("✅ Server closed gracefully");
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
}
// Application bootstrap
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connectToDatabase();
            // Create HTTP server from Express app
            const httpServer = http_1.default.createServer(app_1.default);
            // Initialize Socket.IO with CORS config
            const io = new socket_io_1.Server(httpServer, {
                cors: {
                    origin: ["http://localhost:3000", "http://localhost:5173"],
                    methods: ["GET", "POST"],
                    credentials: true,
                },
            });
            // Optional: make `io` available globally via custom setter
            (0, socket_1.setSocketIO)(io);
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
            server = httpServer.listen(config_1.default.port, () => {
                console.log(`🚀 Server running on port ${config_1.default.port}`);
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
        }
        catch (error) {
            console.error("❌ Error during bootstrap:", error);
            process.exit(1);
        }
    });
}
bootstrap();
