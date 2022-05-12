import {
    CommonSocketMessage,
    ReqEnterChat
} from "../../shared/model/dto";
import {SocketControllerListener} from "../../utils/types";

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

    enterRoom(nickname: string) {
        const msg: ReqEnterChat = {type: "REQ_CHAT_ENTER", payload: {nickname}};
        this.sendSocketMessage(msg);
    }
}
