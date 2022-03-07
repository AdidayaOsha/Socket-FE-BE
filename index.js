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
let arrRoom = []
let usersRoom1 = []
app.io = io
app.arrMsg = arrMsg

// event send message
app.post('/sendMessage', (req, res) => {
    if (req.query.namespace === "default") {
        if(req.body.room) {
            // to deliver message to a room
            arrRoom.push(req.body)
            io.in(req.body.room).emit("messagesRoom", arrRoom)
        } else {
            // to deliver a message to global channel
            arrRoom.push(req.body)
            io.emit('chat message', arrMsg)
        }
        res.status(200).send('Send messages success')

    } else if (req.query.namespace === "channel") {
        arrChn.push(req.body)
        channelNsp.emit('chat message', arrChn)
        res.status(200).send(arrChn)
    }
})

// kalau on: nerima data
// kalau emit: ngirim data

// NAMESPACE DEFAULT
io.on('connection', socket => {
    socket.on('JoinChat', data => {
        console.log("User join NSP1 :", data);
    })

    // terima data chat
    socket.on("JoinRoom", data => {
        socket.join(data.room)        
        usersRoom1.push({...data, id: socket.id})
        io.in(data.room).emit('notifRoom1', `${data.name} has entered the chat`)
    })
    socket.on('disconnect', () => {
        console.log('User Disconnect')
    })
})

// NAMESPACE CHANNEL
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