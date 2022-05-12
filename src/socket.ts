import {RawData, WebSocketServer} from "ws";
import {Server} from "http";
import {getUniqueID} from "./utils/util";
import {MessageType, PayloadType} from "./shared/enum";
import {
    CommonSocketMessage,
    MsgChatEntered,
    MsgChatLeft,
    MsgChatNewMessage,
    MsgChatNicknameChanged,
    ReqChangeNickname,
    ReqEnterChat,
    ReqSendMessage
} from "./shared/model/dto";

export default function startWsServer(httpServer: Server) {
    const wss = new WebSocketServer({server: httpServer});

    /** WS **/
    const sockets: Map<string, WebSocket> = new Map<string, WebSocket>();
    const sendMessageToAll = (exceptId: string | null, payload: CommonSocketMessage) => {
        Array.from(sockets.keys())
            .filter(key => key !== exceptId)
            .forEach(key => {
                sockets.get(key)?.send(JSON.stringify(payload));
            });
    };

    const handleChatEnter = (id: string, nickname: string) => {
        const socket = sockets.get(id);
        if (socket) {
            socket.nickname = nickname;
            const msg: MsgChatEntered = {type: PayloadType.CHAT_ENTERED, nickname};
            sendMessageToAll(null, msg);
        }
    };

    const handleChatMessage = (id: string, data: string) => {
        const sender = sockets.get(id)?.nickname || "알 수 없음";
        const msg: MsgChatNewMessage = {type: PayloadType.CHAT_NEW_MESSAGE, nickname: sender, message: data};
        sendMessageToAll(id, msg);
    };

    const handleChangeNickname = (id: string, nickname: string) => {
        const target = sockets.get(id);
        if (target) {
            const original = target.nickname;
            target.nickname = nickname;
            const msg: MsgChatNicknameChanged = {
                type: PayloadType.NICKNAME_CHANGED,
                preNickname: original,
                nowNickname: nickname
            };
            sendMessageToAll(null, msg);
        }
    };

    const onSocketConnected = (socket: WebSocket) => {
        const socketId = getUniqueID();
        sockets.set(socketId, socket);
        return socketId;
    };

    const onSocketMessage = (id: string, message: RawData) => {
        const data = JSON.parse(message.toString());
        console.log(`메시지 도착 - ${data.type.toString()}`);
        switch (data.type as MessageType) {
        case "REQ_CHAT_SEND_MESSAGE": {
            const {message}: ReqSendMessage = data as ReqSendMessage;
            handleChatMessage(id, message);
            break;
        }
        case "REQ_NICKNAME_CHANGE": {
            const {nickname}: ReqChangeNickname = data as ReqChangeNickname;
            handleChangeNickname(id, nickname);
            break;
        }
        case "REQ_CHAT_ENTER": {
            const {nickname}: ReqEnterChat = data as ReqEnterChat;
            handleChatEnter(id, nickname);
            break;
        }
        }
    };

    const onSocketClosed = (id: string) => {
        console.log(`❌ 클라이언트 연결 끊김, 현재 ${sockets.size}개 연결중`);
        const msg: MsgChatLeft = {type: PayloadType.CHAT_LEFT, nickname: sockets.get(id)?.nickname || "알 수 없음"};
        sendMessageToAll(null, msg);
        sockets.delete(id);
    };

    wss.on("connection", (socket: WebSocket) => {
        const connected: WebSocket = socket;
        connected.nickname = "익명";
        const socketId = onSocketConnected(connected);
        console.log(`✅ ${socketId} 클라이언트 연결 완료!, 현재 ${sockets.size}개 연결중`);

        socket.on("message", (m: RawData) => onSocketMessage(socketId, m));
        socket.on("close", () => onSocketClosed(socketId));
    });

    return wss;
}