import { io } from "socket.io-client";

const token = localStorage.getItem('token');

const socket = io("http://localhost:8001", {
  auth:{
    token:token
  },
  transports: ["websocket"]
});

export default socket;