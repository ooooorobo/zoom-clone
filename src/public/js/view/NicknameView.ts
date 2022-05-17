import {DomUtil} from "../util/DomUtil";
import {DataStore} from "../dc/DataStore";
import {ReqChangeNickname} from "../../../shared/model/dto";
import {MESSAGE_TYPE, MessageType, PayloadType} from "../../../shared/enum";
import {ISocketController} from "../../../utils/types";
import {View} from "./View";

export class NicknameView extends View{
    private nicknameInput: HTMLInputElement;

    constructor(
        private socketController: ISocketController,
        private addNewMessage?: (messageType: MessageType, message: string) => void
    ) {
        super();
        this.container = DomUtil.getElementOrCreate<HTMLElement>(document.getElementById("nick"), "form");
        this.nicknameInput = DomUtil.getElementOrCreate<HTMLInputElement>(this.container.querySelector("input"), "input");
        this.container.addEventListener("submit", this.handleNickSubmit.bind(this));

        this.init();
    }

    private init() {
        this.nicknameInput.value = DataStore.instance.nickname;
    }

    private handleNickSubmit (e: Event) {
        e.preventDefault();
        if (this.nicknameInput.value !== DataStore.instance.nickname && DataStore.instance.room) {
            const original = DataStore.instance.nickname;
            const changed = this.nicknameInput.value;
            const msg: ReqChangeNickname = {
                type: PayloadType.REQ_NICKNAME_CHANGE,
                nickname: changed,
                roomName: DataStore.instance.room
            };
            this.socketController.sendSocketMessage(msg, () => {
                this.addNewMessage?.(MESSAGE_TYPE.ALERT, `📣 지금부터 ${original} 님을 ${changed} 님이라고 불러주세요.`);
                DataStore.instance.nickname = changed;
            });
        }
    }

}