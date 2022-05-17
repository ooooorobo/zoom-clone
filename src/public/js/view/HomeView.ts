import {DomUtil} from "../util/DomUtil";
import {DataStore} from "../dc/DataStore";
import {ISocketController} from "../../../utils/types";
import {CommonSocketMessage, MsgRoomChanged} from "../../../shared/model/dto";
import {PayloadType} from "../../../shared/enum";
import {View} from "./View";

export class HomeView extends View {
    private form: HTMLElement;
    private roomList: HTMLElement;

    constructor(
        private socketController: ISocketController,
        private onEnterRoom: (userCount: number) => void
    ) {
        super();

        this.container = DomUtil.getElementOrCreate(document.getElementById("welcome"), "div");
        this.form = DomUtil.getElementOrCreate(this.container.querySelector("form"), "form");
        this.roomList = DomUtil.getElementOrCreate(document.getElementById("room-list"), "div");
        // add event handler
        this.form.addEventListener("submit", this.handleRoomSubmit.bind(this));
        this.socketController.addListener({onReceiveMessage: this.onReceiveMessage.bind(this)});
        // init view
        this.init();
    }

    private init() {
        DomUtil.showElement(this.container);
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
        this.socketController.enterRoom(DataStore.instance.nickname, roomName, (res) => {
            if (res.result) {
                DomUtil.hideElement(this.container);
                DataStore.instance.room = roomName;
                this.onEnterRoom(res.userCount);
            }
        });
    }

    private handleRoomSubmit(e: Event) {
        e.preventDefault();
        const input = DomUtil.getElementOrCreate(this.form.querySelector("input"), "input");
        const roomName = input.value;
        this.enterRoom(roomName);
        input.value = "";
    }
}


