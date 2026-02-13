import { io } from "socket.io-client";

const token = localStorage.getItem('token');

console.log("token::", token);


let socket;

if (token) {
  socket = io("http://localhost:8001", {
    auth: {
      token: token
    },
    transports: ["websocket"]
  });
}



export default socket;