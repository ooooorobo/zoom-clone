import express from "express"

const PORT = 3000
const app = express()

app.set("view engine", "pug")
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"))

app.get("/", (req, res) => res.render("home"))

app.listen(PORT)
console.log(`http://localhost:${PORT} 에서 서버 실행 중`)
