const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const app = express()
const cors = require('cors')
const server = createServer(app)


const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

//Set the Configuration first
const io = new Server(server, {cors: {origin: "http://localhost:3000"}, allowEIO3: true})
let arrMsg = []
let arrChn = []
app.io = io
app.arrMsg = arrMsg

// event send message
app.post('/sendMessage', (req, res) => {
    if (req.query.namespace === "default") {
        arrMsg.push(req.body)

    } else if (req.query.namespace === "channel") {
        arrChn.push(req.body)
        channelNsp.emit('chat message', arrChn)
        res.status(200).send(arrMsg)
    }
    io.emit('chat message', arrMsg)
    res.status(200).send(arrMsg)
})

// kalau on: nerima data
// kalau emit: ngirim data
io.on('connection', socket => {
    console.log("User");
    socket.on('JoinChat', data => {
        console.log("User join NSP1 :", data);
    })

    // terima data chat
    socket.on("chat message", (data) => {
        console.log(data);
        arrMsg.push(data)
        io.emit('send message', arrMsg)
    })
    socket.on('disconnect', () => {
        console.log('User Disconnect');
    })
})

const channelNsp = io.of('/channel')
channelNsp.on('connection', socket => {
    socket.on('JoinChat', data => {
        console.log("User join NSP2 :", data);
    })

    socket.on('disconnect', () => {
        console.log("User Disconnect from channel");
    })
})


server.listen(PORT, () => console.log(`SERVER RUNNING:`, PORT))