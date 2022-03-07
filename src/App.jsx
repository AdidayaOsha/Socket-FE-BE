import React, {useState, useEffect} from "react";
import {Container, Row, Col, Button} from 'react-bootstrap'
import {Toast, ToastHeader, ToastBody, Input, InputGroup} from 'reactstrap'
import Axios from 'axios'
import {io} from 'socket.io-client'
import 'bootstrap/dist/css/bootstrap.min.css';
let url = "http://localhost:8000"

function App() {

  const [messages, setMessages] = useState([])
  const [user, setUser] = useState([])
  const [message, setMessage] = useState("")
  const [nsp, setNsp] = useState("")
  const [notifRoom, setNotifRoom] = useState("")
  const [roomMessage, setRoomMessage] = useState([])
  const socket = io(url)
  
  const joinChat = (nsp) => { // channel
    const socket = io(url + nsp) // url + channel
    setNsp(nsp) // channel
    socket.emit('JoinChat', {name: user})
    socket.on('chat message', msgs => {
      console.log("receive socket:", msgs);
      setMessages(msgs)
    })
    // socket.on('chat message', msgs => setMessages(msgs))
  }

  const onBtSendMessage = (room = '/') => {
    let that = {
      room,
      name: user,
      message
    }
    let namespace = nsp === '/' ? "default" : "channel"
    console.log(namespace);
    Axios.post(url + `/sendMessage?namespace=${namespace}`, that
    ).then(res => {
      console.log(res.data);
      setMessage("")
    }).catch((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    // socket.emit('JoinChat', {name: user})
    socket.on('send message', msgs => {
      setMessages(msgs)
    })

    return () => {
      socket.close()
    }
  }, [])

  const joinRoom = (nsp, room) => {
    const socket = io(url + nsp)
    socket.emit('JoinRoom', {room, name: user})
    socket.on('notifRoom1', notif => {
      console.log('notif', notif);
      setNotifRoom(notif)
    })
    // getting the message that is being emitted by the room
    socket.on("messagesRoom", msgs => {
      setRoomMessage(msgs)
    })
  }
  
  const renderUser = () => {
    return user.map((item, index) => {
      return(
        <li>
          {item.name}
        </li>
      )
    })
  }
  
  const renderMessages = () => {
    return messages.map((item, index) => {
      return(
        <Col style={{margin: "10px 5px", display: "flex"}} key={index}>
          <Toast>
            <ToastHeader icon="primary" style={{fontStyle: "italic"}}>
              {item.name}
            </ToastHeader>
            <ToastBody>
              {item.message}
            </ToastBody>
          </Toast>
        </Col>
      )
    })
  }

  const renderMessagesRooms = () => {
    return roomMessage.map((item, index) => {
      return(
        <Col style={{margin: "10px 5px", display: "flex"}} key={index}>
          <Toast>
            <ToastHeader icon="primary" style={{fontStyle: "italic"}}>
              {item.name}
            </ToastHeader>
            <ToastBody>
              {item.message}
            </ToastBody>
          </Toast>
        </Col>
      )
    })
  }

  return (
    <>
    <Container style={{width: "50%", height: "50em", background: "white", marginTop: "1em"}}>
      {/* // ! HEADERS */}
      <Container style={{background: "lightblue", height: "8%"}}>
        <Row>
          <Col style={{display: "flex", marginTop: "10px"}} className= "col-3">
            <h4>SocketTest</h4>
          </Col>
          <Col style={{display: "flex", flexDirection: "row", justifyContent: "end", marginTop: "10px"}}>
            <Input name="name" onChange={e => setUser(e.target.value)} placeholder="Enter Name..." style={{display: "flex", fontStyle:"italic", fontSize: "0.8em"}} />
            <Button onClick={() => joinChat('/')} style={{margin: "0 10px", padding: "0 20px", fontStyle: "italic"}}>Join NSP1</Button>
            <Button onClick={() => joinChat('/channel')} style={{margin: "0 10px", padding: "0 20px", fontStyle: "italic"}}>Join NSP2</Button>
            <Button onClick={() => joinRoom(nsp, 'Room_1')} style={{fontStyle:"italic", margin: "0 10px", padding: "0 20px"}}>Join Room1</Button>
          </Col>
        </Row>
      </Container>

      {/* //! ROOM SERVER, AND CHAT */}
      <Container style={{background: "white", height: "85%", border: "1px solid lightblue"}}>
        <Row style={{height: "100%"}}>
          <Col style={{background: "", display: "flex", flexDirection: "column"}} className= "col-3">
            <h5 style={{fontStyle: "italic"}}>Room Name</h5>
            <div style={{background: "", fontStyle:"italic", height: "5%", textAlign: "center", fontSize: "1.2em"}}>
              GLOBAL ROOM
            </div>
            <h5 style={{fontStyle: "italic"}}>Users</h5>
            <div style={{background: ""}}>
              List of Users:
              <ul>
                {renderUser}
              </ul>
            </div>
          </Col>

          <Col style={{background: "white", border: "1px solid lightblue", overflowBlock: "scroll"}} className= "col-9">
          {/* //! OUR CHAT */}
          {messages.length === 0 ? <h6 style={{
            fontStyle: "italic", 
            textAlign: "center", 
            display: "flex", 
            flexDirection:"column", 
            alignItems: "center", 
            marginTop: "4em", 
            color: "lightgray"
          }}> Start chatting with someone! </h6> 
          : 
          renderMessages()}
        
          {/* //! FRIENDS CHAT */}
            {/* <Col style={{margin: "10px 5px", display: "flex", justifyContent: "end"}}>
              <Toast>
                <ToastHeader icon="success" style={{fontStyle: "italic"}}>
                  Alduri Asfirna
                </ToastHeader>
                <ToastBody>
                  Yo, ini gw nyoba fitur chat nih, kayaknya. Tapi ini asik sih ga kayak biasanya.
                </ToastBody>
              </Toast>
            </Col> */}
            
          </Col>
        </Row>
      </Container>

      {/* //! CHAT INPUT */}
      <Container style={{background: "white", height: "7%", width: "100%"}}>
        <Row style={{height: "100%", margin: "0 -24px"}}>
          <InputGroup>
            <Input value={message} onChange={e => setMessage(e.target.value)} placeholder="Insert a message..."/>
            <Button onClick={() => onBtSendMessage()}>
              Send
            </Button>
          </InputGroup>
        </Row>
      </Container>

    </Container>


    {/* //? ROOM 1 CHAT */}

    <Container style={{width: "50%", height: "50em", background: "white", marginTop: "1em"}}>

    {/* // ! HEADERS */}
    <Container style={{background: "lightblue", height: "8%"}}>
      <Row>
        <Col style={{display: "flex", marginTop: "10px"}} className= "col-3">
          <h4>SocketTest</h4>
        </Col>
        <Col style={{display: "flex", flexDirection: "row", justifyContent: "end", marginTop: "10px"}}>
          <Input name="name" onChange={e => setUser(e.target.value)} placeholder="Enter Name..." style={{display: "flex", fontStyle:"italic", fontSize: "0.8em"}} />
          <Button onClick={() => joinChat('/')} style={{margin: "0 10px", padding: "0 20px", fontStyle: "italic"}}>Join NSP1</Button>
          <Button onClick={() => joinChat('/channel')} style={{margin: "0 10px", padding: "0 20px", fontStyle: "italic"}}>Join NSP2</Button>
          <Button onClick={() => joinRoom(nsp, 'Room_1')} style={{fontStyle:"italic", margin: "0 10px", padding: "0 20px"}}>Join Room1</Button>
        </Col>
      </Row>
    </Container>

    {/* //! ROOM SERVER, AND CHAT */}
    <Container style={{background: "white", height: "85%", border: "1px solid lightblue"}}>
      <Row style={{height: "100%"}}>
        <Col style={{background: "", display: "flex", flexDirection: "column"}} className= "col-3">
          <h5 style={{fontStyle: "italic"}}>Room Name</h5>
          <div style={{background: "", fontStyle:"italic", height: "5%", textAlign: "center", fontSize: "1.2em"}}>
            ROOM 1
          </div>
          <h5 style={{fontStyle: "italic"}}>Users</h5>
          <div style={{background: ""}}>
            List of Users:
            <ul>
              {renderUser}
            </ul>
          </div>
        </Col>

        <Col style={{background: "white", border: "1px solid lightblue", overflowBlock: "scroll"}} className= "col-9">
        {/* //! OUR CHAT */}
        <h6>{notifRoom}</h6>
        {roomMessage.length === 0 ? <h6 style={{
          fontStyle: "italic", 
          textAlign: "center", 
          display: "flex", 
          flexDirection:"column", 
          alignItems: "center", 
          marginTop: "4em", 
          color: "lightgray"
        }}> Start chatting with someone! </h6> 
        : 
        renderMessagesRooms()}
      
        {/* //! FRIENDS CHAT */}
          {/* <Col style={{margin: "10px 5px", display: "flex", justifyContent: "end"}}>
            <Toast>
              <ToastHeader icon="success" style={{fontStyle: "italic"}}>
                Alduri Asfirna
              </ToastHeader>
              <ToastBody>
                Yo, ini gw nyoba fitur chat nih, kayaknya. Tapi ini asik sih ga kayak biasanya.
              </ToastBody>
            </Toast>
          </Col> */}
          
        </Col>
      </Row>
    </Container>

    {/* //! CHAT INPUT ROOM */}
    <Container style={{background: "white", height: "7%", width: "100%"}}>
      <Row style={{height: "100%", margin: "0 -24px"}}>
        <InputGroup>
          <Input value={message} onChange={e => setMessage(e.target.value)} placeholder="Insert a message..."/>
          <Button onClick={() => onBtSendMessage('Room_1')}>
            Send
          </Button>
        </InputGroup>
      </Row>
    </Container>

    </Container>
</>

)}

export default App;
