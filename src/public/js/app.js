const SOCKET_ENDPOINT = `ws://${window.location.host}`

/**
 * socket -> 연결된 서버
 * WebSocket 인스턴스를 생성하면 서버와의 WS 커넥션을 생성함 - socket 인스턴스를 통해 서버와 통신 가능
 */
const socket = new WebSocket(SOCKET_ENDPOINT)
socket.addEventListener('open', () => {
    console.log("✅ 서버 연결 완료!")
})

socket.addEventListener('message', (message) => {
    console.log("📨️ 메시지 도착:", message.data)
})

socket.addEventListener('close', () => {
    console.log('❎ 서버 연결 종료됨')
})

setTimeout(() => {
    socket.send('hello from the browser!')
}, 10000)