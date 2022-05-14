import {SocketController} from "./socket";
import {CommonSocketMessage, DoneEnterChat, ReqEnterChat} from "../../shared/model/dto";
import {io, Socket} from "socket.io-client";
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

    sendSocketMessage<CALLBACK_PARAM>(payload: CommonSocketMessage, callback?: (res: CALLBACK_PARAM) => void) {
        this.socket.emit(payload.type, payload, callback);
    }

    enterRoom(nickname: string, roomName: string, onEnterRoom?: (entered: boolean) => any) {
        const msg: ReqEnterChat = {type: PayloadType.REQ_CHAT_ENTER, nickname, roomName};
        this.sendSocketMessage<DoneEnterChat>(msg, ({entered}) => onEnterRoom?.(entered));
    }
}
