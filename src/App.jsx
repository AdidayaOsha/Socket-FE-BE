import React, {useState, useEffect} from "react";
import {Container, Row, Col, Button} from 'react-bootstrap'
import {Toast, ToastHeader, ToastBody, Input, InputGroup} from 'reactstrap'
import {io} from 'socket.io-client'
import 'bootstrap/dist/css/bootstrap.min.css';
const url = "http://localhost:8000"

function App() {

  const [messages, setMessages] = useState("")
  const [user, setUser] = useState("")
  const [message, setMessage] = useState("")
  const socket = io(url)
  
  const joinChat = () => {
    socket.emit('JoinChat', {name: user})
    // socket.on('chat message', msgs => setMessages(msgs))
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
  

  return (
    <Container style={{width: "50%", height: "45em", background: "white"}}>

      {/* // ! HEADERS */}
      <Container style={{background: "lightblue", height: "8%"}}>
        <Row>
          <Col style={{display: "flex", marginTop: "10px"}}>
            <h4>Boiler Template</h4>
          </Col>
          <Col style={{display: "flex", flexDirection: "row", justifyContent: "end", marginTop: "10px"}}>
            <Input name="name" onChange={e => setUser(e.target.value)} placeholder="Enter Name..." style={{display: "flex", fontStyle:"italic", fontSize: "0.8em"}} />
            <Button onClick={() => joinChat()} style={{margin: "0 10px", padding: "0 20px", fontStyle: "italic"}}>Join</Button>
            <Button style={{fontStyle:"italic"}}>Leave</Button>
          </Col>
        </Row>
      </Container>

      {/* //! ROOM SERVER, AND CHAT */}
      <Container style={{background: "pink", height: "85%"}}>
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
                <li>User1</li>
                <li>User2</li>
                <li>User3</li>
                <li>User4</li>
              </ul>
            </div>
          </Col>

          <Col style={{background: "white", border: "1px solid lightblue"}} className= "col-9">
          {/* //! OUR CHAT */}
            <Col style={{margin: "10px 5px", display: "flex"}}>
              <Toast>
                <ToastHeader icon="primary" style={{fontStyle: "italic"}}>
                  Osha Prima Adidaya
                </ToastHeader>
                <ToastBody>
                  Yo, ini gw nyoba fitur chat nih, kayaknya
                </ToastBody>
              </Toast>
            </Col>

          {/* //! FRIENDS CHAT */}
            <Col style={{margin: "10px 5px", display: "flex", justifyContent: "end"}}>
              <Toast>
                <ToastHeader icon="success" style={{fontStyle: "italic"}}>
                  Alduri Asfirna
                </ToastHeader>
                <ToastBody>
                  Yo, ini gw nyoba fitur chat nih, kayaknya. Tapi ini asik sih ga kayak biasanya.
                </ToastBody>
              </Toast>
            </Col>
            
          </Col>
        </Row>
      </Container>

      {/* //! CHAT INPUT */}
      <Container style={{background: "white", height: "7%", width: "100%"}}>
        <Row style={{height: "100%", margin: "0 -24px"}}>
          <InputGroup>
            <Input value={message} onChange={e => setMessage(e.target.value)} placeholder="Insert a message..."/>
            <Button onClick={() => socket.emit("chat message", message)}>
              Send
            </Button>
          </InputGroup>
        </Row>
      </Container>

    </Container>
  );
}

export default App;
