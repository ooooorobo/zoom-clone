import {SocketController} from "./socket";
import {CommonSocketMessage} from "../../shared/model/dto";
// eslint-disable-next-line
// @ts-ignore
import { io, Socket } from "socket-io-client";
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
}
