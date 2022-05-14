import {SocketIoController} from "./socketio";
import {CommonSocketMessage} from "../../shared/model/dto";
import {PayloadType} from "../../shared/enum";
import {getElementOrCreate} from "./domUtil";
import "./chatroom";
import {DataStore} from "./store";

const socketController = SocketIoController.instance;

function handleSocketMessage(payload: CommonSocketMessage) {
    switch (payload.type) {
    case PayloadType.CHAT_ENTERED:
        break;
    case PayloadType.CHAT_LEFT:
        break;
    case PayloadType.NICKNAME_CHANGED:
        break;
    case PayloadType.CHAT_NEW_MESSAGE:
        break;
    default:
        break;
    }
}
socketController.addListener({onReceiveMessage: handleSocketMessage});


const welcome = getElementOrCreate(document.getElementById("welcome"), "div");
const form = getElementOrCreate(welcome.querySelector("form"), "form");

const room = getElementOrCreate(document.getElementById("room"), "div");
const roomTitle = getElementOrCreate(room.querySelector("h3"), "h3");

init();

function init() {
    welcome.hidden = false;
    room.classList.add("hidden");
}

function enterRoom(roomName: string) {
    welcome.hidden = true;
    room.classList.remove("hidden");
    roomTitle.innerText = roomName;
    DataStore.instance.setRoom(roomName);
}

function handleRoomSubmit(e: Event) {
    e.preventDefault();
    const input = getElementOrCreate(form.querySelector("input"), "input");
    const roomName = input.value;
    socketController.enterRoom(DataStore.instance.nickname, roomName, (entered) => entered && enterRoom(roomName));
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);