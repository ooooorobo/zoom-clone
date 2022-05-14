import {WebSocket as _WebSocket} from "ws";
import {CommonSocketMessage} from "../shared/model/dto";

declare global {
    interface WebSocket extends _WebSocket {
        nickname: string;
    }
} 

export interface ISocketController {
    addListener: (listener: SocketControllerListener) => void;
    sendSocketMessage: (payload: CommonSocketMessage) => void;
    enterRoom: (nickname: string, roomName: string, onEnterRoom?: (entered: boolean) => any) => void;
}

export interface SocketControllerListener {
    onReceiveMessage: (payload: CommonSocketMessage) => void;
}