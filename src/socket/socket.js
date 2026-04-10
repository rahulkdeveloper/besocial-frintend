import { io } from "socket.io-client";

let socket = null;

export const initSocket = () => {
  if (!socket) {
    const token = localStorage.getItem("token");
    console.log("Socket token:", token,import.meta.env.VITE_API_URL);
    

    socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      transports: ["polling", "websocket"],
      autoConnect: true
    });
  }
  return socket;
};

export const getSocket = () => socket;