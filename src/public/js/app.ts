import {ISocketController} from "../../utils/types";
import {HomeView} from "./view/HomeView";
import {ChatroomView} from "./view/ChatroomView";
import {SocketIoController} from "./controller/socket/SocketIOController";
import {NicknameView} from "./view/NicknameView";

const createView = (socketController: ISocketController) => {
    const chatroomView = new ChatroomView(socketController);
    new NicknameView(socketController, chatroomView.addNewMessage.bind(chatroomView));
    new HomeView(socketController, chatroomView.onEnterRoom.bind(chatroomView));
};

const socketController = SocketIoController.instance;
createView(socketController);