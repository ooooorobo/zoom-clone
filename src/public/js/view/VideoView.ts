import {DomUtil} from "../util/DomUtil";
import {View} from "./View";
import {StreamDC} from "../dc/StreamDC";

export class VideoView extends View {
    private myFace: HTMLVideoElement;
    private muteBtn: HTMLElement;
    private cameraBtn: HTMLElement;
    private camSelect: HTMLSelectElement;

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
        this.handleCameraClick(false);
        this.handleMuteClick(false);
        await this.showCameraList();
        this.show();
    }

    private async showCameraList(): Promise<void> {
        const cams = await StreamDC.instance.getCameras();
        const currentCam = await StreamDC.instance.getCurrentCam();
        const frag = document.createDocumentFragment();
        cams.forEach(c => {
            const option = document.createElement("option");
            option.value = c.deviceId;
            option.innerText = c.label;
            if (c.label === currentCam?.label) {
                option.selected = true;
            }
            frag.appendChild(option);
        });
        this.camSelect.appendChild(frag);
    }

    private async getMedia(deviceId: string): Promise<void> {
        await StreamDC.instance.setCameraDevice(deviceId);
        this.myFace.srcObject = StreamDC.instance.getMyStream();
    }

    private handleMuteClick(toggle = true) {
        if (toggle) this.audioEnabled = !this.audioEnabled;
        if (this.audioEnabled) {
            this.muteBtn.innerText = "음소거";
        } else {
            this.muteBtn.innerText = "음소거 해제";
        }
        StreamDC.instance.setAudioEnabled(this.audioEnabled);
    }

    private handleCameraClick(toggle = true) {
        if (toggle) this.cameraEnabled = !this.cameraEnabled;
        if (this.cameraEnabled) {
            this.cameraBtn.innerText = "비디오 끄기";
        } else {
            this.cameraBtn.innerText = "비디오 켜기";
        }
        StreamDC.instance.setVideoEnabled(this.cameraEnabled);
    }

    private handleCameraChange() {
        this.getMedia(this.camSelect.value);
    }
}