import {CommonSocketMessage} from "../../shared/model/dto";
import {SocketController} from "./socket";

const SOCKET_ENDPOINT = `ws://${window.location.host}`;
export class WebSocketController extends SocketController<WebSocket>{

    static INSTANCE: SocketController<WebSocket>;

    static get instance() {
        return this.INSTANCE ?? (this.INSTANCE = new WebSocketController());
    }

    createSocket(): WebSocket {
        return new WebSocket(SOCKET_ENDPOINT);
    }

    addSocketEvent() {
        this.socket.addEventListener("open", () => {
            console.log("✅ 서버 연결 완료!");
        });

        this.socket.addEventListener("message", (res) => {
            const data: CommonSocketMessage = JSON.parse(res.data);
            this.listeners.forEach(l => l.onReceiveMessage(data));
        });

        this.socket.addEventListener("close", () => {
            console.log("❎ 서버 연결 종료됨");
        });

    }

    sendSocketMessage(payload: CommonSocketMessage) {
        this.socket.send(JSON.stringify(payload));
    }
}
