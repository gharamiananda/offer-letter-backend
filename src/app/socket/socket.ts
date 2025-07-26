import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

/**
 * Sets the global Socket.IO instance.
 * Should be called once during server bootstrap.
 */
export const setSocketIO = (ioInstance: SocketIOServer) => {
  io = ioInstance;
};

/**
 * Returns the globally stored Socket.IO instance.
 * Throws an error if accessed before initialization.
 */
export const getSocketIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.IO not initialized. Call setSocketIO() first.");
  }
  return io;
};
