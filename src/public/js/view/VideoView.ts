import {DomUtil} from "../util/DomUtil";
import {View} from "./View";

export class VideoView extends View {
    private myFace: HTMLVideoElement;
    private muteBtn: HTMLElement;
    private cameraBtn: HTMLElement;
    private camSelect: HTMLSelectElement;

    private myStream?: MediaStream;

    private audioEnabled = false;
    private cameraEnabled = false;

    constructor() {
        super();

        this.container = DomUtil.getElementOrCreate(document.getElementById("myStream"));

        this.myFace = DomUtil.getElementOrCreate<HTMLVideoElement>(document.getElementById("myFace") as HTMLVideoElement, "video");
        this.muteBtn = DomUtil.getElementOrCreate(document.getElementById("mute"), "button");
        this.cameraBtn = DomUtil.getElementOrCreate(document.getElementById("camera"), "button");
        this.camSelect = DomUtil.getElementOrCreate(document.getElementById("camList") as HTMLSelectElement, "select");

        this.muteBtn.addEventListener("click", () => this.handleMuteClick(true));
        this.cameraBtn.addEventListener("click", () => this.handleCameraClick(true));
        this.camSelect.addEventListener("input", this.handleCameraChange.bind(this));
    }

    public async startVideo(): Promise<void> {
        await this.getMedia();
        this.handleCameraClick(false);
        this.handleMuteClick(false);
        this.showCameraList();
        this.show();
    }

    private async showCameraList(): Promise<void> {
        const cams = await this.getCameras();
        const frag = document.createDocumentFragment();
        const currentCam = this.myStream?.getVideoTracks()[0];
        cams.forEach(c => {
            const option = document.createElement("option");
            option.value = c.deviceId;
            option.innerText = c.label;
            console.log(c.label, currentCam?.label);
            if (c.label === currentCam?.label) {
                option.selected = true;
            }
            frag.appendChild(option);
        });
        this.camSelect.appendChild(frag);
    }

    private async getMedia(deviceId?: string): Promise<void> {
        try {
            this.myStream = await navigator.mediaDevices.getUserMedia({
                audio: this.audioEnabled,
                video: deviceId ? {deviceId: {exact: deviceId}} : {facingMode: "self"}
            });
            this.myFace.srcObject = this.myStream;
        } catch (e) {
            console.error(e);
        }
    }

    private async getCameras(): Promise<MediaDeviceInfo[]> {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            return devices.filter(d => d.kind === "videoinput");
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    private handleMuteClick(toggle = true) {
        if (toggle) this.audioEnabled = !this.audioEnabled;
        if (this.audioEnabled) {
            this.muteBtn.innerText = "음소거";
        } else {
            this.muteBtn.innerText = "음소거 해제";
        }
        this.myStream?.getAudioTracks().forEach(a => a.enabled = this.audioEnabled);
    }

    private handleCameraClick(toggle = true) {
        if (toggle) this.cameraEnabled = !this.cameraEnabled;
        if (this.cameraEnabled) {
            this.cameraBtn.innerText = "비디오 끄기";
        } else {
            this.cameraBtn.innerText = "비디오 켜기";
        }
        this.myStream?.getVideoTracks().forEach(a => a.enabled = this.cameraEnabled);
    }

    private handleCameraChange() {
        console.log(this.camSelect.value);
        this.getMedia(this.camSelect.value);
    }
}