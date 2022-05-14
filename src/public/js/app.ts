import {ISocketController} from "../../utils/types";
import {HomeView} from "./view/HomeView";
import {ChatroomView} from "./view/ChatroomView";
import {SocketIoController} from "./controller/socket/SocketIOController";

const createView = (socketController: ISocketController) => {
    const chatroomView = new ChatroomView(socketController);
    new HomeView(socketController, chatroomView.onEnterRoom);
};

const socketController = SocketIoController.instance;
createView(socketController);