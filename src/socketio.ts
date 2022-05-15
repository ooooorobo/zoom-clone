import {Server} from "http";
import {Server as IOServer} from "socket.io";
import {PayloadType} from "./shared/enum";
import {
    MsgChatEntered, MsgChatLeft,
    MsgChatNewMessage,
    MsgChatNicknameChanged, MsgRoomChanged,
    ReqChangeNickname,
    ReqEnterChat,
    ReqSendMessage
} from "./shared/model/dto";

export default function createWsServer(httpServer: Server) {
    const io = new IOServer(httpServer);

    io.on("connection", socket => {
        let socketNickname = "";

        const emitRoomChanged = () => {
            io.sockets.emit(PayloadType.ROOM_CHANGED, {type: PayloadType.ROOM_CHANGED, rooms: getPublicRoomList(io)} as MsgRoomChanged);
        };

        emitRoomChanged();
        
        socket.on(PayloadType.REQ_CHAT_ENTER, ({roomName, nickname}: ReqEnterChat, done) => {
            try {
                socket.join(roomName);
                done({result: true});
                socketNickname = nickname;
                socket.to(roomName).emit(PayloadType.CHAT_ENTERED, {type: PayloadType.CHAT_ENTERED, nickname} as MsgChatEntered);
                emitRoomChanged();
            } catch (e) {
                done({result: false});
            }
        });

        socket.on(PayloadType.REQ_CHAT_SEND_MESSAGE, ({message, room}: ReqSendMessage, done) => {
            try {
                socket.to(room).emit(PayloadType.CHAT_NEW_MESSAGE, {type: PayloadType.CHAT_NEW_MESSAGE, nickname: socketNickname, message} as MsgChatNewMessage);
                done({result: true});
            } catch (e) {
                done({result: false});
            }
        });

        socket.on(PayloadType.REQ_NICKNAME_CHANGE, ({roomName, nickname}: ReqChangeNickname, done) => {
            try {
                socket.to(roomName).emit(PayloadType.NICKNAME_CHANGED, {
                    type: PayloadType.NICKNAME_CHANGED,
                    preNickname: socketNickname,
                    nowNickname: nickname
                } as MsgChatNicknameChanged);
                socketNickname = nickname;
                done({result: true});
            } catch (e) {
                done({result: false});
            }
        });

        socket.on("disconnect", () => {
            socket.to(Array.from(socket.rooms.values())).emit(PayloadType.CHAT_LEFT, {
                type: PayloadType.CHAT_LEFT,
                nickname: socketNickname
            } as MsgChatLeft);
            emitRoomChanged();
        });
    });

}

function getPublicRoomList(io: IOServer): string[] {
    const {sockets: {adapter: {sids, rooms}}} = io;
    const publicRooms: string[] = [];
    rooms.forEach((_, key) => {!sids.has(key) && publicRooms.push(key);});
    return publicRooms;
}
