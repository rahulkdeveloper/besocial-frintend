import { io } from "socket.io-client";

let socket = null;

export const initSocket = () => {
  if (!socket) {
    const token = localStorage.getItem("token");

    socket = io("http://localhost:8001", {
      auth: { token },
      transports: ["websocket"],
      autoConnect: true
    });
  }
  return socket;
};

export const getSocket = () => socket;