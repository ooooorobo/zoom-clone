import {PayloadType} from "../enum";

export interface CommonSocketMessage {
    type: PayloadType;
}

export interface ReqSendMessage extends CommonSocketMessage {
    type: PayloadType.REQ_CHAT_SEND_MESSAGE;
    message: string;
    nickname: string;
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

export interface ReqChangeNickname extends CommonSocketMessage {
    type: PayloadType.REQ_NICKNAME_CHANGE;
    nickname: string;
    roomName: string;
    preNickname: string;
}

export interface MsgChatEntered extends CommonSocketMessage {
    type: PayloadType.CHAT_ENTERED;
    nickname: string;
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
}


