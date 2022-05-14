import {Server} from "http";
import {Server as IOServer} from "socket.io";
import {PayloadType} from "./shared/enum";
import {ReqEnterChat} from "./shared/model/dto";

export default function createWsServer(httpServer: Server) {
    const io = new IOServer(httpServer);

    io.on("connection", socket => {
        socket.on(PayloadType.REQ_CHAT_ENTER, (payload: ReqEnterChat, done) => {
            try {
                socket.join(payload.roomName);
                done({entered: true});
            } catch (e) {
                done({entered: false});
            }
        });
    });

}