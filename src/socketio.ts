import {Server} from "http";
import {Server as IOServer} from "socket.io";
import {instrument} from "@socket.io/admin-ui";
import {PayloadType} from "./shared/enum";
import {
    EnterRoomDone,
    MsgChatEntered,
    MsgChatLeft,
    MsgChatNewMessage,
    MsgChatNicknameChanged,
    MsgJoinRoom,
    MsgRoomChanged, MsgRtcSendAnswer,
    MsgRtcSendOffer,
    ReqChangeNickname,
    ReqEnterChat,
    ReqJoinRoom, ReqRtcSendAnswer,
    ReqRtcSendOffer,
    ReqSendMessage
} from "./shared/model/dto";

export default function createWsServer(httpServer: Server) {
    // https://admin.socket.io/ 에서 접속
    const io = new IOServer(httpServer, {
        cors: {
            origin: ["https://admin.socket.io"],
            credentials: true
        }
    });

    instrument(io, {auth: false});

    io.on("connection", socket => {
        let socketNickname = "";

        const emitRoomChanged = () => {
            io.sockets.emit(PayloadType.ROOM_CHANGED, {
                type: PayloadType.ROOM_CHANGED,
                rooms: getPublicRoomList(io)
            } as MsgRoomChanged);
        };

        const getUserCountInRoom = (roomName: string) => {
            return io.sockets.adapter.rooms.get(roomName)?.size || 0;
        };

        emitRoomChanged();

        socket.on(PayloadType.REQ_CHAT_ENTER, ({roomName, nickname}: ReqEnterChat, done) => {
            try {
                socket.join(roomName);
                socketNickname = nickname;
                const userCount = getUserCountInRoom(roomName);
                socket.to(roomName).emit(PayloadType.CHAT_ENTERED, {
                    type: PayloadType.CHAT_ENTERED,
                    nickname,
                    userCount
                } as MsgChatEntered);
                emitRoomChanged();
                done({result: true, userCount} as EnterRoomDone);
            } catch (e) {
                done({result: false});
                console.error(e);
            }
        });

        socket.on(PayloadType.REQ_CHAT_SEND_MESSAGE, ({message, room}: ReqSendMessage, done) => {
            try {
                socket.to(room).emit(PayloadType.CHAT_NEW_MESSAGE, {
                    type: PayloadType.CHAT_NEW_MESSAGE,
                    nickname: socketNickname,
                    message
                } as MsgChatNewMessage);
                done({result: true});
            } catch (e) {
                done({result: false});
                console.error(e);
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
                console.error(e);
            }
        });

        // video

        socket.on(PayloadType.REQ_JOIN_ROOM, ({roomName, nickname}: ReqJoinRoom, done) => {
            socket.join(roomName);
            socketNickname = nickname;
            done({result: true});
            socket.to(roomName).emit(PayloadType.MSG_JOIN_ROOM, {type: PayloadType.MSG_JOIN_ROOM} as MsgJoinRoom);
        });

        socket.on(PayloadType.RTC_SEND_OFFER, ({roomName, offer}: ReqRtcSendOffer, done) => {
            socket.to(roomName).emit(PayloadType.RTC_SEND_OFFER, {type: PayloadType.RTC_SEND_OFFER, offer} as MsgRtcSendOffer);
            done({result: true});
        });

        socket.on(PayloadType.RTC_SEND_ANSWER, ({roomName, answer}: ReqRtcSendAnswer, done) => {
            socket.to(roomName).emit(PayloadType.RTC_SEND_ANSWER, {type: PayloadType.RTC_SEND_ANSWER, answer} as MsgRtcSendAnswer);
            done({result: true});
        });

        socket.on("disconnecting", () => {
            socket.rooms.forEach(roomName => {
                socket.to(roomName).emit(PayloadType.CHAT_LEFT, {
                    type: PayloadType.CHAT_LEFT,
                    nickname: socketNickname,
                    userCount: getUserCountInRoom(roomName) - 1
                } as MsgChatLeft);
            });
        });

        socket.on("disconnect", () => {
            emitRoomChanged();
        });
    });

}

function getPublicRoomList(io: IOServer): string[] {
    const {sockets: {adapter: {sids, rooms}}} = io;
    const publicRooms: string[] = [];
    rooms.forEach((_, key) => {
        !sids.has(key) && publicRooms.push(key);
    });
    return publicRooms;
}
