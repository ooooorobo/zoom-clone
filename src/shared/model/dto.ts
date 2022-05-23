import {PayloadType} from "../enum";

export interface CommonSocketMessage {
    type: PayloadType;
}

export interface ReqSendMessage extends CommonSocketMessage {
    type: PayloadType.REQ_CHAT_SEND_MESSAGE;
    message: string;
    room: string;
}

export interface ReqEnterChat extends CommonSocketMessage {
    type: PayloadType.REQ_CHAT_ENTER;
    nickname: string;
    roomName: string;
}

export interface OnMessageDone {
    result: boolean;
}

export interface EnterRoomDone extends OnMessageDone {
    userCount: number;
}

export interface ReqChangeNickname extends CommonSocketMessage {
    type: PayloadType.REQ_NICKNAME_CHANGE;
    nickname: string;
    roomName: string;
}

export interface ReqJoinRoom extends CommonSocketMessage {
    type: PayloadType.REQ_JOIN_ROOM;
    roomName: string;
    nickname: string;
}

export interface MsgChatEntered extends CommonSocketMessage {
    type: PayloadType.CHAT_ENTERED;
    nickname: string;
    userCount: number;
}


export interface MsgChatNewMessage extends CommonSocketMessage {
    type: PayloadType.CHAT_NEW_MESSAGE;
    nickname: string;
    message: string;

}

export interface MsgChatNicknameChanged extends CommonSocketMessage {
    type: PayloadType.NICKNAME_CHANGED;
    preNickname: string;
    nowNickname: string;
}

export interface MsgChatLeft extends CommonSocketMessage {
    type: PayloadType.CHAT_LEFT;
    nickname: string;
    userCount: number;
}

export interface MsgRoomChanged extends CommonSocketMessage {
    type: PayloadType.ROOM_CHANGED;
    rooms: string[]
}

export interface MsgJoinRoom extends CommonSocketMessage {
    type: PayloadType.MSG_JOIN_ROOM;

}

export interface ReqRtcSendOffer extends CommonSocketMessage {
    type: PayloadType.RTC_SEND_OFFER;
    offer: RTCSessionDescriptionInit;
    roomName: string;
}

export interface MsgRtcSendOffer extends CommonSocketMessage {
    type: PayloadType.RTC_SEND_OFFER;
    offer: RTCSessionDescriptionInit;
}

export interface ReqRtcSendAnswer extends CommonSocketMessage {
    type: PayloadType.RTC_SEND_ANSWER;
    answer: RTCSessionDescriptionInit;
    roomName: string;
}

export interface MsgRtcSendAnswer extends CommonSocketMessage {
    type: PayloadType.RTC_SEND_ANSWER;
    answer: RTCSessionDescriptionInit;
}