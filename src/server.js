import express from "express"
import WebSocket from "ws"
import http from "http"

const PORT = 3000
const app = express()

// 같은 port에서 웹 소켓 서버와 HTTP 서버를 함께 작동시키기 위해 위해 server 객체 접근이 필요
const server = http.createServer(app)
// webSocket server를 http 서버 위에 생성
const wss = new WebSocket.Server({ server })

/** HTTP **/
app.set("view engine", "pug")
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"))

app.get("/", (req, res) => res.render("home"))
app.get("/*", (req, res) => res.redirect("/"))

/** WS **/
wss.on('connection', socket => {
    console.log('✅ 클라이언트 연결 완료!')
    socket.on('message', (message) => console.log('📨 클라이언트 메시지:', message))
    socket.on('close', () => console.log('❌ 클라이언트 연결 끊김'))
    socket.send('hello')
})

const handleListen = () => console.log(`http://localhost:${PORT} 에서 서버 실행 중`)
// 같은 PORT(:3000)에서 HTTP, WS 두 가지 프로토콜을 처리할 수 있도록 함
server.listen(PORT, handleListen)
