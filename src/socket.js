import { getUniqueID } from "./util"
import { MessageType } from "./public/js/enum"
import WebSocket from "ws"

export default function startWsServer(httpServer) {
    const wss = new WebSocket.Server({ server: httpServer })

    /** WS **/
    const sockets = new Map()
    const sendMessageToAll = (exceptId, payload) => {
        Array.from(sockets.keys())
            .filter(key => key !== exceptId)
            .forEach(key => {
                sockets.get(key).send(JSON.stringify(payload))
            })
    }

    const handleChatEnter = (id, nickname) => {
        const socket = sockets.get(id)
        socket.nickname = nickname
        sendMessageToAll(null, {type: MessageType.CHAT_ENTERED, nickname})
    }
    const handleChatMessage = (id, data) => {
        const sender = sockets.get(id).nickname
        sendMessageToAll(id, { type: MessageType.CHAT_NEW_MESSAGE, nickname: sender, message: data })
    }
    const handleChangeNickname = (id, nickname) => {
        const original = sockets.get(id).nickname
        sockets.get(id).nickname = nickname
        sendMessageToAll(null, { type: MessageType.NICKNAME_CHANGED, preNickname: original, nowNickname: nickname})
    }
    const onSocketConnected = (socket) => {
        const socketId = getUniqueID()
        sockets.set(socketId, socket)
        return socketId
    }
    const onSocketMessage = (id, message) => {
        const data = JSON.parse(message.toString())
        const payload = data.payload
        console.log(`메시지 도착 - ${data.type.toString()}`)
        switch (data.type.toString()) {
            case MessageType.REQ_CHAT_SEND_MESSAGE:
                handleChatMessage(id, payload)
                break
            case MessageType.REQ_NICKNAME_CHANGE:
                handleChangeNickname(id, payload)
                break
            case MessageType.REQ_CHAT_ENTER:
                handleChatEnter(id, payload)
                break
        }
    }

    const onSocketClosed = (id) => {
        sendMessageToAll(null, {type: MessageType.CHAT_LEFT, nickname: sockets.get(id).nickname})
        sockets.delete(id)
        console.log(`❌ 클라이언트 연결 끊김, 현재 ${sockets.size}개 연결중`)
    }

    wss.on('connection', socket => {
        const socketId = onSocketConnected(socket)
        console.log(`✅ ${socketId} 클라이언트 연결 완료!, 현재 ${sockets.size}개 연결중`)
        socket.on('message', m => onSocketMessage(socketId, m))
        socket.on('close', () => onSocketClosed(socketId))
    })

    return wss
}