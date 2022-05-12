import {SocketIoController} from "./socketio";

const socketController = SocketIoController.instance;

const welcome = document.getElementById("welcome") || document.createElement("div");
const form = welcome.querySelector("form") || document.createElement("form");

function handleRoomSubmit(e: Event) {
    e.preventDefault();
    const input = form.querySelector("input") || document.createElement("input");
    socketController.enterRoom("익명", input.value);
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);