export class StreamDC {
    static INSTANCE: StreamDC;

    static get instance() {
        return this.INSTANCE ?? (this.INSTANCE = new StreamDC());
    }

    private myStream: MediaStream | null = null;
    private constraints: MediaStreamConstraints = {};

    public audioEnabled = false;
    public cameraEnabled = false;

    private constructor() {
        this.constraints = {
            audio: false,
            video: {facingMode: "self"}
        } as MediaStreamConstraints;
        this.updateUserMedia();
    }

    private async updateUserMedia() {
        this.myStream = await navigator.mediaDevices.getUserMedia(this.constraints);
        this.setVideoEnabled(this.cameraEnabled);
        this.setAudioEnabled(this.audioEnabled);
    }

    public getMyStream(): MediaStream | null {
        return this.myStream;
    }

    public setAudioEnabled(enabled: boolean) {
        this.audioEnabled = enabled;
        this.myStream?.getAudioTracks().forEach(a => a.enabled = enabled);
    }

    public setVideoEnabled(enabled: boolean) {
        this.cameraEnabled = enabled;
        this.myStream?.getVideoTracks().forEach(a => {
            a.enabled = enabled;
        });
    }

    public async setCameraDevice(deviceId?: string) {
        this.constraints.video = deviceId ? { deviceId } : {facingMode: "self"};
        return this.updateUserMedia();
    }

    public async getCameras(): Promise<MediaDeviceInfo[]> {
        const devices = await  navigator.mediaDevices.enumerateDevices();
        return devices.filter(d => d.kind === "videoinput");
    }

    public async getCurrentCam(): Promise<MediaStreamTrack | null> {
        return this.myStream?.getVideoTracks()?.[0] || null;
    }
}