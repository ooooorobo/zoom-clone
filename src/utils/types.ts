import {WebSocket as _WebSocket} from 'ws'

declare global {
    interface WebSocket extends _WebSocket {
        nickname: string;
    }
}
