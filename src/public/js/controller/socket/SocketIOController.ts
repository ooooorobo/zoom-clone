import {SocketController} from "./SocketController";
import {
    CommonSocketMessage,
    OnMessageDone,
    MsgChatEntered,
    ReqEnterChat,
    EnterRoomDone
} from "../../../../shared/model/dto";
import {io, Socket} from "socket.io-client";
import {PayloadType} from "../../../../shared/enum";

export class SocketIoController extends SocketController<Socket>{

    static INSTANCE: SocketController<Socket>;

    static get instance() {
        return this.INSTANCE ?? (this.INSTANCE = new SocketIoController());
    }

    createSocket(): Socket {
        return io();
    }

    addSocketEvent() {
        this.socket.onAny((ev: string, payload: MsgChatEntered) => {
            this.listeners.forEach((listener) => listener.onReceiveMessage(payload));
        });
    }

    sendSocketMessage<CALLBACK_PARAM>(payload: CommonSocketMessage, callback?: (res: CALLBACK_PARAM) => void) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.socket.emit(payload.type, payload, callback || (() => {}));
    }

    enterRoom(nickname: string, roomName: string, onEnterRoom?: (res: EnterRoomDone) => any) {
        const msg: ReqEnterChat = {type: PayloadType.REQ_CHAT_ENTER, nickname, roomName};
        this.sendSocketMessage<EnterRoomDone>(msg, (res: EnterRoomDone) => onEnterRoom?.(res));
    }
}
