import { MessageType, StorageKey } from "./enum.js"
import { saveToStorage, getFromStorage } from "./storage.js"

const SOCKET_ENDPOINT = `ws://${window.location.host}`
const MESSAGE_TYPE = {
    ALERT: 'alert',
    MINE: 'mine',
    OTHERS: 'others'
}

const messageList = document.querySelector('#list')
const messageForm = document.querySelector('#chat')
const nicknameForm = document.querySelector('#nick')

const state = {nickname: '익명'}

const init = () => {
    const nickname = getFromStorage(StorageKey.NICKNAME) || ''
    if (nickname) {
        const input = nicknameForm.querySelector('input')
        input.value = nickname
        state.nickname = nickname
    }
}

init()

// 이벤트 핸들러
const handleSubmit = (e) => {
    e.preventDefault()
    const input = messageForm.querySelector('input')
    socket.send(JSON.stringify({ type: MessageType.REQ_CHAT_SEND_MESSAGE, payload: input.value }))
    addNewMessage(MESSAGE_TYPE.MINE, `나: ${input.value}`)
    input.value = ''
}

const handleNickSubmit = e => {
    e.preventDefault()
    const input = nicknameForm.querySelector('input')
    if (input.value !== state.nickname) {
        socket.send(JSON.stringify({ type: MessageType.REQ_NICKNAME_CHANGE, payload: input.value }))
        state.nickname = input.value
        saveToStorage(StorageKey.NICKNAME, input.value)
    }
}

const addNewMessage = (type, message) => {
    const element = document.createElement('div')
    element.className = `message ${type}`
    element.innerText = message
    messageList.appendChild(element)
}

messageForm.addEventListener('submit', handleSubmit)
nicknameForm.addEventListener('submit', handleNickSubmit)

// 소켓 핸들러
/**
 * socket -> 연결된 서버
 * WebSocket 인스턴스를 생성하면 서버와의 WS 커넥션을 생성함 - socket 인스턴스를 통해 서버와 통신 가능
 */
const socket = new WebSocket(SOCKET_ENDPOINT)
socket.addEventListener('open', () => {
    console.log("✅ 서버 연결 완료!")
    socket.send(JSON.stringify({type: MessageType.REQ_CHAT_ENTER, payload: state.nickname}))
})

socket.addEventListener('message', (res) => {
    const payload = JSON.parse(res.data.toString())

    switch (payload.type) {
        case MessageType.CHAT_NEW_MESSAGE:
            addNewMessage(MESSAGE_TYPE.OTHERS, `${payload.nickname}: ${payload.message}`)
            break;
        case MessageType.CHAT_ENTERED:
            addNewMessage(MESSAGE_TYPE.ALERT, `📣 ${payload.nickname} 님, 환영합니다! 🎉`)
            break;
        case MessageType.CHAT_LEFT:
            addNewMessage(MESSAGE_TYPE.ALERT, `📣 ${payload.nickname} 님, 안녕히 가세요. 😢`)
            break;
        case MessageType.NICKNAME_CHANGED:
            addNewMessage(MESSAGE_TYPE.ALERT, `📣 지금부터 ${payload.preNickname} 님을 ${payload.nowNickname} 님이라고 불러주세요.`)
            break;
    }
})

socket.addEventListener('close', () => {
    console.log('❎ 서버 연결 종료됨')
})

