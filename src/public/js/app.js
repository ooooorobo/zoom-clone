const SOCKET_ENDPOINT = `ws://${window.location.host}`

/**
 * socket -> 연결된 서버
 * WebSocket 인스턴스를 생성하면 서버와의 WS 커넥션을 생성함 - socket 인스턴스를 통해 서버와 통신 가능
 */
const socket = new WebSocket(SOCKET_ENDPOINT)