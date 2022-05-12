import {WebSocket as _WebSocket} from "ws";
import {CommonSocketMessage} from "../shared/model/dto";

declare global {
    interface WebSocket extends _WebSocket {
        nickname: string;
    }
} 

export interface SocketController {
    sendSocketMessage: (payload: CommonSocketMessage) => void;
    enterRoom: (nickname: string) => void;
}

export interface SocketControllerListener {
    onReceiveMessage: (payload: CommonSocketMessage) => void;
}