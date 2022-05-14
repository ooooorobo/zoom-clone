import {MESSAGE_TYPE, MessageType, PayloadType} from "../../shared/enum";
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
import {getElementOrCreate} from "./domUtil";
import {DataStore} from "./store";

const messageList = getElementOrCreate<HTMLElement>(document.querySelector("#list"), "div");
const messageForm = getElementOrCreate<HTMLElement>(document.querySelector("#chat"), "form");
const nicknameForm = getElementOrCreate<HTMLElement>(document.getElementById("nick"), "form");

const init = () => {
    const nickname = DataStore.instance.nickname;
    const input = getElementOrCreate<HTMLInputElement>(nicknameForm.querySelector("input"), "input");
    input.value = nickname;
    DataStore.instance.setNickname(nickname);
};

const addNewMessage = (type: MessageType, message: string) => {
    const element = document.createElement("div");
    element.className = `message ${type}`;
    element.innerText = message;
    messageList.appendChild(element);
};

const onReceiveMessage = (payload: CommonSocketMessage) => {
    switch (payload.type) {
    case PayloadType.CHAT_NEW_MESSAGE: {
        const {nickname, message}: MsgChatNewMessage = payload as MsgChatNewMessage;
        addNewMessage(MESSAGE_TYPE.OTHERS, `${nickname}: ${message}`);
        break;
    }
    case PayloadType.CHAT_ENTERED: {
        const {nickname}: MsgChatEntered = payload as MsgChatEntered;
        addNewMessage(MESSAGE_TYPE.ALERT, `📣 ${nickname} 님, 환영합니다! 🎉`);
        break;
    }
    case PayloadType.CHAT_LEFT: {
        const {nickname}: MsgChatLeft = payload as MsgChatLeft;
        addNewMessage(MESSAGE_TYPE.ALERT, `📣 ${nickname} 님, 안녕히 가세요. 😢`);
        break;
    }
    case PayloadType.NICKNAME_CHANGED: {
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
    const input = getElementOrCreate<HTMLInputElement>(messageForm.querySelector("input"), "input");
    if (DataStore.instance.room) {
        const msg: ReqSendMessage = {
            type: PayloadType.REQ_CHAT_SEND_MESSAGE,
            message: input.value,
            nickname: DataStore.instance.nickname,
            room: DataStore.instance.room
        };
        socketController.sendSocketMessage(msg);
        addNewMessage(MESSAGE_TYPE.MINE, `나: ${input.value}`);
        input.value = "";
    }
};

const handleNickSubmit = (e: Event) => {
    console.log(e);
    e.preventDefault();
    const input = getElementOrCreate<HTMLInputElement>(nicknameForm.querySelector("input"), "input");
    console.log(input.value, DataStore.instance.nickname, DataStore.instance.room);
    if (input.value !== DataStore.instance.nickname && DataStore.instance.room) {
        const msg: ReqChangeNickname = {
            type: PayloadType.REQ_NICKNAME_CHANGE,
            nickname: input.value,
            preNickname: DataStore.instance.nickname,
            roomName: DataStore.instance.room
        };
        socketController.sendSocketMessage(msg);
        DataStore.instance.setNickname(input.value);
    }
};

// 핸들러 등록
messageForm.addEventListener("submit", handleSubmit);
nicknameForm.addEventListener("submit", handleNickSubmit);
console.log(nicknameForm);