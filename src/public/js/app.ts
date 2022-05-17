import {VideoView} from "./view/VideoView";
import {VideoHomeView} from "./view/VideoHomeView";
import {NicknameView} from "./view/NicknameView";
import {SocketIoController} from "./controller/socket/SocketIOController";
import {ISocketController} from "../../utils/types";


const createView = (socketController: ISocketController) => {
    const video = new VideoView();
    const home = new VideoHomeView(socketController, video);
    new NicknameView(socketController);
    home.show();
    video.hide();
    // const chatroomView = new ChatroomView(socketController);
    // new HomeView(socketController, chatroomView.onEnterRoom.bind(chatroomView));
};

createView(SocketIoController.instance);