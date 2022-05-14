import {SocketIoController} from "./socketio";

const socketController = SocketIoController.instance;

function getElementOrCreate<HTMLELEMENT extends HTMLElement>(selector: HTMLELEMENT | null, tagName: string): HTMLELEMENT {
    return selector || (document.createElement(tagName) as HTMLELEMENT);
}

const welcome = getElementOrCreate(document.getElementById("welcome"), "div");
const form = getElementOrCreate(welcome.querySelector("form"), "form");

const room = getElementOrCreate(document.getElementById("room"), "div");
const roomTitle = getElementOrCreate(room.querySelector("h3"), "h3");

init();

function init() {
    welcome.hidden = false;
    room.hidden = true;
}

function enterRoom(roomName: string) {
    welcome.hidden = true;
    room.hidden = false;
    roomTitle.innerText = roomName;
}

function handleRoomSubmit(e: Event) {
    e.preventDefault();
    const input = getElementOrCreate(form.querySelector("input"), "input");
    const roomName = input.value;
    socketController.enterRoom("익명", roomName, (entered) => entered && enterRoom(roomName));
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);