import {getFromStorage, saveToStorage} from "../util/StorageUtil";
import {StorageKey} from "../../../shared/enum";

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

    set nickname(nickname: string) {
        this._nickname = nickname;
        saveToStorage(StorageKey.NICKNAME, nickname);
    }

    getDefaultNickname(): string {
        return getFromStorage(StorageKey.NICKNAME) || "익명";
    }


    get room(): string | null {
        return this._room;
    }

    set room(roomName: string | null) {
        this._room = roomName;
    }
}