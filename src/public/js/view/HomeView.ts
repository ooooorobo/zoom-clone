import {DomUtil} from "../util/DomUtil";
import "./ChatroomView";
import {DataStore} from "../dc/DataStore";
import {ISocketController} from "../../../utils/types";

export class HomeView {
    private welcome: HTMLElement;
    private form: HTMLElement;

    constructor(
        private socketController: ISocketController,
        private onEnterRoom: () => void
    ) {
        this.welcome = DomUtil.getElementOrCreate(document.getElementById("welcome"), "div");
        this.form = DomUtil.getElementOrCreate(this.welcome.querySelector("form"), "form");
        // bind this
        this.handleRoomSubmit.bind(this);
        // add event handler
        this.form.addEventListener("submit", this.handleRoomSubmit);
        // init view
        this.init();
    }

    private init() {
        this.welcome.hidden = false;
    }

    private enterRoom(roomName: string) {
        this.welcome.hidden = true;
        DataStore.instance.setRoom(roomName);
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


