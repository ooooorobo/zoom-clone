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
        this.socket.emit(payload.type, payload);
    }

    enterRoom(nickname: string, roomName: string) {
        const msg: ReqEnterChat = {type: PayloadType.REQ_CHAT_ENTER, nickname, roomName};
        this.sendSocketMessage(msg);
    }
}
