import {DomUtil} from "../util/DomUtil";

export class View {
    protected container: HTMLElement;

    constructor() {
        this.container = document.createElement("div");
    }

    public hide() {
        DomUtil.hideElement(this.container);
    }

    public show() {
        DomUtil.showElement(this.container);
    }
}