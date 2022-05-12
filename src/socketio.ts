import {Server} from "http";
import {Server as IOServer} from "socket.io";

export default function createWsServer(httpServer: Server) {
    const io = new IOServer(httpServer);

    io.on("connection", socket => {
        console.log(socket);
    });
    
}