import {SocketController} from "./socket";
import {CommonSocketMessage, ReqEnterChat} from "../../shared/model/dto";
// eslint-disable-next-line
// @ts-ignore
import {io, Socket} from "socket-io-client";
import {PayloadType} from "../../shared/enum";

export class SocketIoController extends SocketController<Socket>{

    static INSTANCE: SocketController<Socket>;

    static get instance() {
        return this.INSTANCE ?? (this.INSTANCE = new SocketIoController());
    }

    createSocket(): Socket {
        return io();
    }

    addSocketEvent() {
        //
    }

    sendSocketMessage(payload: CommonSocketMessage) {
        this.socket.send(JSON.stringify(payload));
    }

    enterRoom(nickname: string) {
        const msg: ReqEnterChat = {type: PayloadType.REQ_CHAT_ENTER, nickname};
        this.socket.emit("REQ_CHAT_ENTER", msg);
    }
}
