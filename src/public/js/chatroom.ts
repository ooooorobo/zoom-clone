import {MESSAGE_TYPE, MessageType, PayloadType, StorageKey} from "../../shared/enum";
import {getFromStorage, saveToStorage} from "./storage";
import {
    CommonSocketMessage,
    MsgChatEntered,
    MsgChatLeft,
    MsgChatNewMessage,
    MsgChatNicknameChanged,
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

const onReceiveMessage = (payload: CommonSocketMessage) => {
    switch (payload.type) {
    case "CHAT_NEW_MESSAGE": {
        const {nickname, message}: MsgChatNewMessage = payload as MsgChatNewMessage;
        addNewMessage(MESSAGE_TYPE.OTHERS, `${nickname}: ${message}`);
        break;
    }
    case "CHAT_ENTERED": {
        const {nickname}: MsgChatEntered = payload as MsgChatEntered;
        addNewMessage(MESSAGE_TYPE.ALERT, `📣 ${nickname} 님, 환영합니다! 🎉`);
        break;
    }
    case "CHAT_LEFT": {
        const {nickname}: MsgChatLeft = payload as MsgChatLeft;
        addNewMessage(MESSAGE_TYPE.ALERT, `📣 ${nickname} 님, 안녕히 가세요. 😢`);
        break;
    }
    case "NICKNAME_CHANGED": {
        const {preNickname, nowNickname}: MsgChatNicknameChanged = payload as MsgChatNicknameChanged;
        addNewMessage(MESSAGE_TYPE.ALERT, `📣 지금부터 ${preNickname} 님을 ${nowNickname} 님이라고 불러주세요.`);
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
            const msg: ReqSendMessage = {type: PayloadType.REQ_CHAT_SEND_MESSAGE, message: input.value};
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
            const msg: ReqChangeNickname = {type: PayloadType.REQ_NICKNAME_CHANGE, nickname: input.value};
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
