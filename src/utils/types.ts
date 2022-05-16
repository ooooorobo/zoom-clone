import {WebSocket as _WebSocket} from "ws";
import {CommonSocketMessage, EnterRoomDone} from "../shared/model/dto";

declare global {
    interface WebSocket extends _WebSocket {
        nickname: string;
    }
} 

export interface ISocketController {
    addListener: (listener: SocketControllerListener) => void;
    sendSocketMessage: (payload: CommonSocketMessage, callback?: () => any) => void;
    enterRoom: (nickname: string, roomName: string, onEnterRoom?: (res: EnterRoomDone) => any) => void;
}

export interface SocketControllerListener {
    onReceiveMessage: (payload: CommonSocketMessage) => void;
}