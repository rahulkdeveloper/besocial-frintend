import { io } from "socket.io-client";

let socket = null;

export const initSocket = () => {
  if (!socket) {
    const token = localStorage.getItem("token");
    console.log("Socket token:", token);
    

    socket = io("http://13.232.114.16:8001", {
      auth: { token },
      transports: ["polling", "websocket"],
      autoConnect: true
    });
  }
  return socket;
};

export const getSocket = () => socket;