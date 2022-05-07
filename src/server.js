import express from "express"

const PORT = 3000
const app = express()

console.log(`http://localhost:${PORT} 에서 서버 실행 중`)

app.listen(PORT)
