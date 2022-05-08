import {MessageType} from "../enum";

export interface CommonSocketMessage {
    type: MessageType;
    payload: any;
}

export interface ReqSendMessage extends CommonSocketMessage {
    type: 'REQ_CHAT_SEND_MESSAGE';
    payload: {
        message: string;
    }
}

export interface ReqEnterChat extends CommonSocketMessage {
    type: 'REQ_CHAT_ENTER';
    payload: {
        nickname: string;
    }
}

export interface ReqChangeNickname extends CommonSocketMessage {
    type: 'REQ_NICKNAME_CHANGE';
    payload: {
        nickname: string;
    }
}

export interface MsgChatEntered extends CommonSocketMessage {
    type: 'CHAT_ENTERED';
    payload: {
        nickname: string;
    }
}

export interface MsgChatNewMessage extends CommonSocketMessage {
    type: 'CHAT_NEW_MESSAGE';
    payload: {
        nickname: string;
        message: string;
    }
}

export interface MsgChatNicknameChanged extends CommonSocketMessage {
    type: 'NICKNAME_CHANGED';
    payload: {
        preNickname: string;
        nowNickname: string;
    }
}

export interface MsgChatLeft extends CommonSocketMessage {
    type: 'CHAT_LEFT';
    payload: {
        nickname: string;
    }
}

