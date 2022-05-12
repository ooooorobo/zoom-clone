import express from "express";
import http from "http";
import startWsServer from "./socketio";
import path from "path";

const __dirname = path.resolve("dist");
const PORT = 3000;
const app = express();

// 같은 port에서 웹 소켓 서버와 HTTP 서버를 함께 작동시키기 위해 위해 server 객체 접근이 필요
const server = http.createServer(app);
// 웹 소켓 서버 실행
startWsServer(server);

/** HTTP **/ 
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.use("/shared", express.static(__dirname + "/shared"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));


const handleListen = () => console.log(`http://localhost:${PORT} 에서 서버 실행 중`);
// 같은 PORT(:3000)에서 HTTP, WS 두 가지 프로토콜을 처리할 수 있도록 함
server.listen(PORT, handleListen);
