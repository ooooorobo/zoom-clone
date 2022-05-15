import {DomUtil} from "../util/DomUtil";
import {DataStore} from "../dc/DataStore";
import {ISocketController} from "../../../utils/types";
import {CommonSocketMessage, MsgRoomChanged} from "../../../shared/model/dto";
import {PayloadType} from "../../../shared/enum";

export class HomeView {
    private welcome: HTMLElement;
    private form: HTMLElement;
    private roomList: HTMLElement;

    constructor(
        private socketController: ISocketController,
        private onEnterRoom: () => void
    ) {
        this.welcome = DomUtil.getElementOrCreate(document.getElementById("welcome"), "div");
        this.form = DomUtil.getElementOrCreate(this.welcome.querySelector("form"), "form");
        this.roomList = DomUtil.getElementOrCreate(document.getElementById("room-list"), "div");
        // add event handler
        this.form.addEventListener("submit", this.handleRoomSubmit.bind(this));
        this.socketController.addListener({onReceiveMessage: this.onReceiveMessage.bind(this)});
        // init view
        this.init();
    }

    private init() {
        DomUtil.showElement(this.welcome);
    }

    private onReceiveMessage (payload: CommonSocketMessage) {
        switch (payload.type) {
        case PayloadType.ROOM_CHANGED: {
            const {rooms} = payload as MsgRoomChanged;
            this.renderRoomList(rooms);
            break;
        }
        }
    }

    private renderRoomList(roomList: string[]) {
        const ul = document.createElement("ul");
        roomList.forEach((name) => {
            const li = document.createElement("li");
            li.innerText = name;
            li.addEventListener("click", () => this.enterRoom(name));
            ul.appendChild(li);
        });
        this.roomList.replaceWith(ul);
        this.roomList = ul;
    }

    private enterRoom(roomName: string) {
        DomUtil.hideElement(this.welcome);
        DataStore.instance.room = roomName;
        this.onEnterRoom();
    }

    private handleRoomSubmit(e: Event) {
        e.preventDefault();
        const input = DomUtil.getElementOrCreate(this.form.querySelector("input"), "input");
        const roomName = input.value;
        this.socketController.enterRoom(DataStore.instance.nickname, roomName, (entered) => entered && this.enterRoom(roomName));
        input.value = "";
    }
}


