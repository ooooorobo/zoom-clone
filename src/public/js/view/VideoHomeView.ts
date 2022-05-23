import {DomUtil} from "../util/DomUtil";
import {View} from "./View";
import {PayloadType} from "../../../shared/enum";
import {ISocketController} from "../../../utils/types";
import {
    CommonSocketMessage,
    MsgRtcSendAnswer,
    MsgRtcSendOffer,
    OnMessageDone,
    ReqJoinRoom
} from "../../../shared/model/dto";
import {DataStore} from "../dc/DataStore";
import {VideoView} from "./VideoView";
import {RtcController} from "../controller/RtcController";

export class VideoHomeView extends View {
    private form: HTMLElement;

    constructor(private socketController: ISocketController, private videoView: VideoView) {
        super();
        this.container = DomUtil.getElementOrCreate(document.getElementById("welcome"));
        this.form = DomUtil.getElementOrCreate(this.container.querySelector("form"));

        this.form.addEventListener("submit", this.handleRoomSubmit.bind(this));
        socketController.addListener({onReceiveMessage: this.onReceiveMessage.bind(this)});
    }

    public onReceiveMessage(msg: CommonSocketMessage) {
        switch (msg.type) {
        case PayloadType.MSG_JOIN_ROOM: {
            // p2p 연결 설정
            RtcController.instance.createOffer();
            break;
        }
        case PayloadType.RTC_SEND_OFFER: {
            const {offer} = msg as MsgRtcSendOffer;
            RtcController.instance.setRemoteDescription(offer);
            RtcController.instance.createAnswer();
            break;
        }
        case PayloadType.RTC_SEND_ANSWER: {
            const {answer} = msg as MsgRtcSendAnswer;
            RtcController.instance.setRemoteDescription(answer);
            break;
        }
        }
    }

    private handleRoomSubmit(e: Event) {
        e.preventDefault();
        const input = DomUtil.getElementOrCreate(this.form.querySelector("input"));
        DataStore.instance.room = input.value;
        RtcController.instance.makeConnection();
        this.socketController.sendSocketMessage<OnMessageDone>(
            {type: PayloadType.REQ_JOIN_ROOM, roomName: input.value, nickname: DataStore.instance.nickname} as ReqJoinRoom,
            ({result}) => result && this.videoView.startVideo()
        );
    }
}