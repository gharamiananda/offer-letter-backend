"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketManager = void 0;
const socket_io_1 = require("socket.io");
class SocketManager {
    static initialize(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: process.env.FRONTEND_URL || "http://localhost:3000",
                methods: ["GET", "POST"],
                credentials: true,
            },
        });
        this.setupEventHandlers();
    }
    static setupEventHandlers() {
        this.io.on("connection", (socket) => {
            console.log(`Client connected: ${socket.id}`);
            socket.on("join-process", (processId) => {
                socket.join(`process-${processId}`);
                console.log(`Client ${socket.id} joined process ${processId}`);
            });
            socket.on("leave-process", (processId) => {
                socket.leave(`process-${processId}`);
                console.log(`Client ${socket.id} left process ${processId}`);
            });
            socket.on("get-process-status", (processId, callback) => {
                const { offerLetterService, } = require("../services/offerLetterService");
                const status = offerLetterService.getProcessStatus(processId);
                callback(status);
            });
            socket.on("disconnect", () => {
                console.log(`Client disconnected: ${socket.id}`);
            });
        });
    }
    static emitProcessUpdate(processId, status) {
        if (this.io) {
            this.io.to(`process-${processId}`).emit("process-update", status);
        }
    }
    static emitProcessComplete(processId, finalStatus) {
        if (this.io) {
            this.io.to(`process-${processId}`).emit("process-complete", finalStatus);
        }
    }
    static emitProcessCancelled(processId) {
        if (this.io) {
            this.io
                .to(`process-${processId}`)
                .emit("process-cancelled", { processId });
        }
    }
    static getConnectedClientsCount() {
        var _a, _b;
        return ((_b = (_a = this.io) === null || _a === void 0 ? void 0 : _a.engine) === null || _b === void 0 ? void 0 : _b.clientsCount) || 0;
    }
}
exports.SocketManager = SocketManager;
