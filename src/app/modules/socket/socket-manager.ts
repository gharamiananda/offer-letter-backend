import { Server } from "socket.io";
import { Server as HttpServer } from "http";
export interface IBulkProcessStatus {
  processId: string;
  total: number;
  sent: number;
  failed: number;
  pending: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  completedEmails: string[];
  failedEmails: string[];
}
export class SocketManager {
  private static io: Server;

  static initialize(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.setupEventHandlers();
  }

  private static setupEventHandlers() {
    this.io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on("join-process", (processId: string) => {
        socket.join(`process-${processId}`);
        console.log(`Client ${socket.id} joined process ${processId}`);
      });

      socket.on("leave-process", (processId: string) => {
        socket.leave(`process-${processId}`);
        console.log(`Client ${socket.id} left process ${processId}`);
      });

      socket.on("get-process-status", (processId: string, callback) => {
        const {
          offerLetterService,
        } = require("../services/offerLetterService");
        const status = offerLetterService.getProcessStatus(processId);
        callback(status);
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  static emitProcessUpdate(processId: string, status: IBulkProcessStatus) {
    if (this.io) {
      this.io.to(`process-${processId}`).emit("process-update", status);
    }
  }

  static emitProcessComplete(
    processId: string,
    finalStatus: IBulkProcessStatus
  ) {
    if (this.io) {
      this.io.to(`process-${processId}`).emit("process-complete", finalStatus);
    }
  }

  static emitProcessCancelled(processId: string) {
    if (this.io) {
      this.io
        .to(`process-${processId}`)
        .emit("process-cancelled", { processId });
    }
  }

  static getConnectedClientsCount(): number {
    return this.io?.engine?.clientsCount || 0;
  }
}
