import {StreamDC} from "../dc/StreamDC";
import {SocketIoController} from "./socket/SocketIOController";
import {PayloadType} from "../../../shared/enum";
import {ReqRtcSendAnswer, ReqRtcSendOffer} from "../../../shared/model/dto";
import {DataStore} from "../dc/DataStore";

export class RtcController {
    static INSTANCE: RtcController;

    private peerConnection?: RTCPeerConnection;

    static get instance() {
        return this.INSTANCE ?? (this.INSTANCE = new RtcController());
    }

    public makeConnection() {
        this.peerConnection = new RTCPeerConnection();
        const myStream = StreamDC.instance.getMyStream();
        if (myStream) {
            const tracks = myStream?.getTracks() || [];
            tracks.forEach(track => this.peerConnection?.addTrack(track, myStream));
        }
    }

    public async createOffer() {
        // 다른 브라우저가 참여할 수 있는 초대장을 생성
        const offer = await this.peerConnection?.createOffer();
        // offer로 연결을 구성
        this.peerConnection?.setLocalDescription(offer);
        // offer 전송
        SocketIoController.instance.sendSocketMessage({type: PayloadType.RTC_SEND_OFFER, offer, roomName: DataStore.instance.room} as ReqRtcSendOffer);
    }

    public async createAnswer() {
        const answer = await this.peerConnection?.createAnswer();
        SocketIoController.instance.sendSocketMessage({type: PayloadType.RTC_SEND_ANSWER, answer, roomName: DataStore.instance.room} as ReqRtcSendAnswer);
    }

    public setRemoteDescription(offer: RTCSessionDescriptionInit) {
        this.peerConnection?.setRemoteDescription(offer);
    }
}