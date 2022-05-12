import {CommonSocketMessage, ReqEnterChat} from "../../shared/model/dto";
import {SocketControllerListener} from "../../utils/types";
import {PayloadType} from "../../shared/enum";

export abstract class SocketController<SOCKET> {
    socket: SOCKET;
    listeners: Set<SocketControllerListener>;

    protected constructor() {
        this.listeners = new Set<SocketControllerListener>();

        this.socket = this.createSocket();
        this.addSocketEvent();
    }

    abstract createSocket(): SOCKET;

    abstract addSocketEvent(): void;

    addListener(listener: SocketControllerListener) {
        this.listeners.add(listener);
    }

    removeListener(listener: SocketControllerListener) {
        this.listeners.delete(listener);
    }

    abstract sendSocketMessage(payload: CommonSocketMessage): void;

    enterRoom(nickname: string, roomName: string) {
        const msg: ReqEnterChat = {type: PayloadType.REQ_CHAT_ENTER, nickname, roomName};
        this.sendSocketMessage(msg);
    }
}
