import {MESSAGE_TYPE, MessageType, StorageKey} from "../../shared/enum";
import { saveToStorage, getFromStorage } from "./storage";
import {
    CommonSocketMessage, MsgChatEntered, MsgChatLeft,
    MsgChatNewMessage, MsgChatNicknameChanged,
    ReqChangeNickname,
    ReqSendMessage
} from "../../shared/model/dto";
import {SocketIoController} from "./socketio";

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

const addNewMessage = (type: MessageType, message: string) => {
    const element = document.createElement("div");
    element.className = `message ${type}`;
    element.innerText = message;
    messageList?.appendChild(element);
};

const onReceiveMessage = (message: CommonSocketMessage) => {
    switch (message.type) {
    case "CHAT_NEW_MESSAGE": {
        const {payload}: MsgChatNewMessage = message as MsgChatNewMessage;
        addNewMessage(MESSAGE_TYPE.OTHERS, `${payload.nickname}: ${payload.message}`);
        break;
    }
    case "CHAT_ENTERED": {
        const {payload}: MsgChatEntered = message as MsgChatEntered;
        addNewMessage(MESSAGE_TYPE.ALERT, `📣 ${payload.nickname} 님, 환영합니다! 🎉`);
        break;
    }
    case "CHAT_LEFT": {
        const {payload}: MsgChatLeft = message as MsgChatLeft;
        addNewMessage(MESSAGE_TYPE.ALERT, `📣 ${payload.nickname} 님, 안녕히 가세요. 😢`);
        break;
    }
    case "NICKNAME_CHANGED": {
        const {payload}: MsgChatNicknameChanged = message as MsgChatNicknameChanged;
        addNewMessage(MESSAGE_TYPE.ALERT, `📣 지금부터 ${payload.preNickname} 님을 ${payload.nowNickname} 님이라고 불러주세요.`);
        break;
    }
    }
};

// 초기화 코드 실행
init();
const socketController = SocketIoController.instance;
socketController.addListener({onReceiveMessage});

// 이벤트 핸들러
const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (messageForm) {
        const input = messageForm.querySelector("input");
        if (input) {
            const msg: ReqSendMessage = {type: "REQ_CHAT_SEND_MESSAGE", payload: {message: input.value}};
            socketController.sendSocketMessage(msg);
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
            socketController.sendSocketMessage(msg);
            state.nickname = input.value;
            saveToStorage(StorageKey.NICKNAME, input.value);
        }
    }
};

// 핸들러 등록
if (messageForm && nicknameForm) {
    messageForm.addEventListener("submit", handleSubmit);
    nicknameForm.addEventListener("submit", handleNickSubmit);
}
