import {MESSAGE_TYPE, MessageType, PayloadType} from "../../../shared/enum";
import {
    CommonSocketMessage,
    MsgChatEntered,
    MsgChatLeft,
    MsgChatNewMessage,
    MsgChatNicknameChanged,
    ReqSendMessage
} from "../../../shared/model/dto";
import {DomUtil} from "../util/DomUtil";
import {DataStore} from "../dc/DataStore";
import {ISocketController} from "../../../utils/types";

export class ChatroomView {
    private room: HTMLElement;
    private roomTitle: HTMLElement;

    private messageList: HTMLElement;
    private messageForm: HTMLElement;
    private chatInput: HTMLInputElement;

    constructor(private socketController: ISocketController) {
        this.room = DomUtil.getElementOrCreate(document.getElementById("room"), "div");
        this.roomTitle = DomUtil.getElementOrCreate(this.room.querySelector("h3"), "h3");
        this.messageList = DomUtil.getElementOrCreate<HTMLElement>(document.querySelector("#list"), "div");
        this.messageForm = DomUtil.getElementOrCreate<HTMLElement>(document.querySelector("#chat"), "form");
        this.chatInput = DomUtil.getElementOrCreate<HTMLInputElement>(this.messageForm.querySelector("input"), "input");
        // add event handler
        this.socketController.addListener({onReceiveMessage: this.onReceiveMessage.bind(this)});
        this.messageForm.addEventListener("submit", this.handleSubmitChatMessage.bind(this));
        // init view
        this.init();
    }

    private init(){
        this.room.classList.remove("hidden");
        DomUtil.hideElement(this.room);
    }

    public onEnterRoom() {
        this.roomTitle.innerText = DataStore.instance.room || "";
        DomUtil.showElement(this.room);
    }

    public addNewMessage(type: MessageType, message: string){
        const element = document.createElement("div");
        element.className = `message ${type}`;
        element.innerText = message;
        this.messageList.appendChild(element);
    }

    private onReceiveMessage (payload: CommonSocketMessage) {
        switch (payload.type) {
        case PayloadType.CHAT_NEW_MESSAGE: {
            const {nickname, message}: MsgChatNewMessage = payload as MsgChatNewMessage;
            this.addNewMessage(MESSAGE_TYPE.OTHERS, `${nickname}: ${message}`);
            break;
        }
        case PayloadType.CHAT_ENTERED: {
            const {nickname}: MsgChatEntered = payload as MsgChatEntered;
            this.addNewMessage(MESSAGE_TYPE.ALERT, `📣 ${nickname} 님, 환영합니다! 🎉`);
            break;
        }
        case PayloadType.CHAT_LEFT: {
            const {nickname}: MsgChatLeft = payload as MsgChatLeft;
            this.addNewMessage(MESSAGE_TYPE.ALERT, `📣 ${nickname} 님, 안녕히 가세요. 😢`);
            break;
        }
        case PayloadType.NICKNAME_CHANGED: {
            const {preNickname, nowNickname}: MsgChatNicknameChanged = payload as MsgChatNicknameChanged;
            this.addNewMessage(MESSAGE_TYPE.ALERT, `📣 지금부터 ${preNickname} 님을 ${nowNickname} 님이라고 불러주세요.`);
            break;
        }
        }
    }

    private handleSubmitChatMessage(e: Event) {
        e.preventDefault();
        if (DataStore.instance.room) {
            const chat = this.chatInput.value;
            const msg: ReqSendMessage = {
                type: PayloadType.REQ_CHAT_SEND_MESSAGE,
                message: chat,
                room: DataStore.instance.room
            };
            this.socketController.sendSocketMessage(msg, () => {
                this.addNewMessage(MESSAGE_TYPE.MINE, `나: ${chat}`);
                this.chatInput.value = "";
            });
        }
    }
}
