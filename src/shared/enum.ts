export enum PayloadType {
    REQ_NICKNAME_CHANGE = "NICKNAME",
    REQ_CHAT_SEND_MESSAGE = "REQ_CHAT_SEND_MESSAGE",
    REQ_CHAT_ENTER = "REQ_CHAT_ENTER",
    CHAT_ENTERED = "CHAT_ENTERED",
    CHAT_LEFT = "CHAT_LEFT",
    NICKNAME_CHANGED = "NICKNAME_CHANGED",
    CHAT_NEW_MESSAGE = "CHAT_NEW_MESSAGE",
    ROOM_CHANGED = "ROOM_CHANGED",
    REQ_JOIN_ROOM = "REQ_JOIN_ROOM",
    MSG_JOIN_ROOM = "MSG_JOIN_ROOM",
    RTC_SEND_OFFER = "RTC_SEND_OFFER"
}

export const MESSAGE_TYPE = {
    ALERT: "alert",
    MINE: "mine",
    OTHERS: "others"
};

export type MessageType = typeof MESSAGE_TYPE[keyof typeof MESSAGE_TYPE]

export const StorageKey = {
    NICKNAME: "NICKNAME"
};

export default {};