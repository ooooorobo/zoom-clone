import { MessageType, StorageKey } from "../../shared/enum";
import { saveToStorage, getFromStorage } from "./storage";
import {
    CommonSocketMessage, MsgChatEntered, MsgChatLeft,
    MsgChatNewMessage, MsgChatNicknameChanged,
    ReqChangeNickname,
    ReqEnterChat,
    ReqSendMessage
} from "../../shared/model/dto";
import {io, Socket} from "socket.io-client";

const SOCKET_ENDPOINT = `ws://${window.location.host}`;
const MESSAGE_TYPE = {
    ALERT: "alert",
    MINE: "mine", 
    OTHERS: "others"
};

const messageList = document.querySelector("#list");
const messageForm = document.querySelector("#chat");
const nicknameForm = document.querySelector("#nick");

const state = {nickname: "익명"};

const init = () => {
    const nickname = getFromStorage(StorageKey.NICKNAME) || "";
    if (nickname && nicknameForm) {
        const input = nicknameForm.querySelector("input");
        input && (input.value = nickname);
        state.nickname = nickname;
    }
};

init();

// 이벤트 핸들러
const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (messageForm) {
        const input = messageForm.querySelector("input");
        if (input) {
            const msg: ReqSendMessage = {type: "REQ_CHAT_SEND_MESSAGE", payload: {message: input.value}};
            sendSocketMessage(socket, msg);
            addNewMessage(MESSAGE_TYPE.MINE, `나: ${input.value}`);
            input.value = "";
        }
    }
};

const handleNickSubmit = (e: Event) => {
    e.preventDefault();
    if (nicknameForm) {
        const input = nicknameForm.querySelector("input");
        if (input && input.value !== state.nickname) {
            const msg: ReqChangeNickname = {type: "REQ_NICKNAME_CHANGE", payload: {nickname: input.value}};
            sendSocketMessage(socket, msg);
            state.nickname = input.value;
            saveToStorage(StorageKey.NICKNAME, input.value);
        }
    }
};

const addNewMessage = (type: MessageType, message: string) => {
    const element = document.createElement("div");
    element.className = `message ${type}`;
    element.innerText = message;
    messageList?.appendChild(element);
};

if (messageForm && nicknameForm) {
    messageForm.addEventListener("submit", handleSubmit);
    nicknameForm.addEventListener("submit", handleNickSubmit);
}

// 소켓 핸들러

const socket = io();
function sendSocketMessage(socket: Socket, payload: CommonSocketMessage) {
    // socket.send(JSON.stringify(payload));
}

/* -- 아래: 웹소켓 사용
 * socket -> 연결된 서버
 * WebSocket 인스턴스를 생성하면 서버와의 WS 커넥션을 생성함 - socket 인스턴스를 통해 서버와 통신 가능
const socket = new WebSocket(SOCKET_ENDPOINT);

socket.addEventListener("open", () => {
    console.log("✅ 서버 연결 완료!");
    const msg: ReqEnterChat = {type: "REQ_CHAT_ENTER", payload: {nickname: state.nickname}};
    sendSocketMessage(socket, msg);
});

socket.addEventListener("message", (res) => {
    const data: CommonSocketMessage = JSON.parse(res.data.toString());

    switch (data.type) {
    case "CHAT_NEW_MESSAGE": {
        const {payload}: MsgChatNewMessage = data as MsgChatNewMessage;
        addNewMessage(MESSAGE_TYPE.OTHERS, `${payload.nickname}: ${payload.message}`);
        break;
    }
    case "CHAT_ENTERED": {
        const {payload}: MsgChatEntered = data as MsgChatEntered;
        addNewMessage(MESSAGE_TYPE.ALERT, `📣 ${payload.nickname} 님, 환영합니다! 🎉`);
        break;
    }
    case "CHAT_LEFT": {
        const {payload}: MsgChatLeft = data as MsgChatLeft;
        addNewMessage(MESSAGE_TYPE.ALERT, `📣 ${payload.nickname} 님, 안녕히 가세요. 😢`);
        break;
    }
    case "NICKNAME_CHANGED": {
        const {payload}: MsgChatNicknameChanged = data as MsgChatNicknameChanged;
        addNewMessage(MESSAGE_TYPE.ALERT, `📣 지금부터 ${payload.preNickname} 님을 ${payload.nowNickname} 님이라고 불러주세요.`);
        break;
    }
    }
});

socket.addEventListener("close", () => {
    console.log("❎ 서버 연결 종료됨");
});
*/