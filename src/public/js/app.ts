import {VideoView} from "./view/VideoView";

// param socketController?: ISocketController
const createView = () => {
    new VideoView();
    // const chatroomView = new ChatroomView(socketController);
    // new NicknameView(socketController, chatroomView.addNewMessage.bind(chatroomView));
    // new HomeView(socketController, chatroomView.onEnterRoom.bind(chatroomView));
};

createView();