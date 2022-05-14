import {getFromStorage, saveToStorage} from "./storage";
import {StorageKey} from "../../shared/enum";

export class DataStore {
    private static _INSTANCE: DataStore = new DataStore();
    private _room: string | null;
    private _nickname: string;

    private constructor() {
        this._nickname = this.getDefaultNickname();
        this._room = null;
    }

    static get instance() {
        return DataStore._INSTANCE ?? (new DataStore());
    }

    get nickname(): string {
        return this._nickname;
    }

    getDefaultNickname(): string {
        return getFromStorage(StorageKey.NICKNAME) || "익명";
    }

    setNickname(nickname: string) {
        this._nickname = nickname;
        saveToStorage(StorageKey.NICKNAME, nickname);
    }

    get room(): string | null {
        return this._room;
    }

    setRoom(roomName: string) {
        this._room = roomName;
        console.log(this._room);
    }
}