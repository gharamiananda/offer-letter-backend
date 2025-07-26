"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocketIO = exports.setSocketIO = void 0;
let io = null;
/**
 * Sets the global Socket.IO instance.
 * Should be called once during server bootstrap.
 */
const setSocketIO = (ioInstance) => {
    io = ioInstance;
};
exports.setSocketIO = setSocketIO;
/**
 * Returns the globally stored Socket.IO instance.
 * Throws an error if accessed before initialization.
 */
const getSocketIO = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized. Call setSocketIO() first.");
    }
    return io;
};
exports.getSocketIO = getSocketIO;
