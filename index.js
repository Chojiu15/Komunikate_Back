const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
require("dotenv/config");

const cors = require("cors");
const { createAdminCRUD } = require("ra-expressjs-mongodb-scaffold"); // import the library


// Create the HTTP server 
const http = require('http');
const server = http.createServer(app);

// Create the WebSocket server 
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
      origin: "*",
  }
});

// Connection port
const port = process.env.PORT || 3002;

// App setup tools
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header('Access-Control-Expose-Headers', 'Content-Range')
  next()
})
app.use(express.json());
app.use(helmet());


// These models need to be required here in order for populate method to work correctly
const Conversation = require("./models/Conversation")
require("./models/Comments")

// this Articles model require causes .get to fail
/* require("./models/Articles") */

// Router declarations
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const conversationsRouter = require("./routes/conversationsRouter");
const articleRouter = require("./routes/articleRouter");

// Router setup
app.use("/", authRouter);
app.use("/users", userRouter);
app.use("/conversations", conversationsRouter);
app.use("/posts", articleRouter);

// Connect to Database
const connect = mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// mongoose.connect(process.env.MONGO_DB,{
//   useFindAndModify: false,
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(async _ => {
//       const app = express();
//       // app.use("/",createAdminCRUD()); // plug it in just like any other middleware

//       app.listen(port,() => {
//           console.log(`Server started at port: ${port}`)
//       })

//   })
//   .catch(console.error);


// Code for socket.io
let connectedUsers = []


io.on('connection', (socket) => {
const id = socket.handshake.query.id
socket.join(id)
console.log('joined ' + id)

// //handling connectedUsers to prevent unexpected disconnections
// let interval //i don't know >> this should be set once with one setInterval and all users will be pinged
// const clearUsersAndEmit = (socket) => {
//   connectedUsers = []
//   socket.emit('online-check')
// }
// if (interval) {
//   clearInterval(interval);
// }
// interval = setInterval(() => clearUsersAndEmit(socket), 6000);


//handling online users

  if (connectedUsers.includes(id)) {
    return
  } else {
    connectedUsers.push(id)
    console.log(connectedUsers)
    io.emit('user-joined', connectedUsers)
    console.log('emit')
  }
              

socket.on('disconnect', () => {
  const id = socket.handshake.query.id
  console.log(id)
  connectedUsers = connectedUsers.filter(el => el !== id)
  console.log('leaving')
  console.log(connectedUsers)
  //clearInterval(interval)
  socket.broadcast.emit('user-left', connectedUsers)
})


socket.on('send-message', ({ recipients, text }) => {
  console.log(recipients)
  const participants = [...recipients, id]
  const newMessage = { sender: id, text: text } 
  recipients.forEach(recipient => {
    const newRecipients = recipients.filter(r => r !== recipient)
    newRecipients.push(id)
    socket.to(recipient).emit('receive-message', {
      recipients: newRecipients, sender: id, text
      })
  }) //closing forEach

  connect.then(async db  =>  {
    console.log("connected to mongo server");
    const conversations = await Conversation.find({ $and: [ { participants: { $all: participants }}, { participants: { $size: participants.length } } ] })

    if (conversations.length) {
    conversations.map(conversation => {
      conversation.messages.push(newMessage)
      conversation.save()
    })
    } else {
     Conversation.create({
      participants: participants, 
      messages: [newMessage]}) 
    }
    })
})


})


server.listen(port, console.log(`Server connected at port ${port}`));
