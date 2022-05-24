import {StreamDC} from "../dc/StreamDC";
import {SocketIoController} from "./socket/SocketIOController";
import {PayloadType} from "../../../shared/enum";
import {ReqRtcSendAnswer, ReqRtcSendIce, ReqRtcSendOffer} from "../../../shared/model/dto";
import {DataStore} from "../dc/DataStore";
import {SocketControllerListener} from "../../../utils/types";

const OFFER_OPTIONS = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
};

interface RtcControllerListener {
    onAddOtherStream: (stream: MediaStream) => void;
}

export class RtcController {
    static INSTANCE: RtcController;
    private listeners: Set<RtcControllerListener> = new Set();

    private peerConnection?: RTCPeerConnection;

    static get instance() {
        return this.INSTANCE ?? (this.INSTANCE = new RtcController());
    }

    public addListener(listener: RtcControllerListener) {
        this.listeners.add(listener);
    }

    public makeConnection() {
        const connection = this.peerConnection = new RTCPeerConnection();
        (window as any).peer = this.peerConnection;
        connection.onicecandidate = this.handleIce.bind(this);
        connection.addEventListener("track", this.handleAddTrack.bind(this));
        const myStream = StreamDC.instance.getMyStream();
        if (myStream) {
            const tracks = myStream?.getTracks() || [];
            tracks.forEach(track => this.peerConnection?.addTrack(track, myStream));
        }
    }

    public async createOffer() {
        // 다른 브라우저가 참여할 수 있는 초대장을 생성
        const offer = await this.peerConnection?.createOffer(OFFER_OPTIONS);
        // offer로 연결을 구성
        this.peerConnection?.setLocalDescription(offer);
        // offer 전송
        SocketIoController.instance.sendSocketMessage({
            type: PayloadType.RTC_SEND_OFFER,
            offer,
            roomName: DataStore.instance.room
        } as ReqRtcSendOffer);
    }

    public async createAnswer() {
        const answer = await this.peerConnection?.createAnswer();
        this.peerConnection?.setLocalDescription(answer);
        SocketIoController.instance.sendSocketMessage({
            type: PayloadType.RTC_SEND_ANSWER,
            answer,
            roomName: DataStore.instance.room
        } as ReqRtcSendAnswer);
    }

    public setRemoteDescription(offer: RTCSessionDescriptionInit) {
        this.peerConnection?.setRemoteDescription(offer);
    }

    public addIceCandidate(ice: RTCIceCandidate) {
        if (ice) {
            this.peerConnection?.addIceCandidate(ice);
        }
    }

    private handleIce(ev: RTCPeerConnectionIceEvent) {
        SocketIoController.instance.sendSocketMessage({
            type: PayloadType.RTC_SEND_ICE,
            ice: ev.candidate,
            roomName: DataStore.instance.room
        } as ReqRtcSendIce);
    }

    public handleAddTrack(e: RTCTrackEvent) {
        // this.listeners.forEach(listener => listener.onAddOtherStream(e.streams[]));
        console.log(e.streams[0], e.track);
        (document.getElementById("otherFace") as HTMLVideoElement).srcObject = e.streams[0];
    }
}