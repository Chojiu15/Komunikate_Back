const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
require("dotenv/config");

const cors = require("cors");
const { createAdminCRUD } = require("ra-expressjs-mongodb-scaffold"); // import the library


// We create the HTTP server 
const http = require('http');
const server = http.createServer(app);

// We create the WebSocket server 
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
      origin: "*",
  }
});

// Connection port
const port = process.env.PORT || 3002;

/* const io = require('socket.io')(5000, {
  cors: {
      origin: "*",
  }
})*/ 

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
app.use(helmet()); //helmet added for more secure header
// app.use((req, res, next) => {
//   req.header("Access-Control-Allow-Origin", "*");
//   req.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

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

<<<<<<< HEAD
app.listen(port, console.log(`Server connected at port ${port}`));

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
=======
// Code for socket.io
io.on('connection', (socket) => {
const id = socket.handshake.query.id
socket.join(id)

console.log(`${socket.id} connected`)

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
    //const conversations = await Conversation.find({participants: participants})
    const conversations = await Conversation.find({ $and: [ { participants: { $all: participants }}, { participants: { $size: participants.length } } ] })
    // db.collection.find( { field: { $size: 2 } } )
    // { <field>: { $all: [ <value1> , <value2> ... ] } }
    // db.inventory.find( { $and: [ { price: { $ne: 1.99 } }, { price: { $exists: true } } ] } )

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
  

     
}) //closing socket


// connect.then(async db  =>  {
//   console.log("connected to mongo server");
//   const conversations = await Conversation.find({ $and: [{participants: participants}, { recipients: newRecipients }]}) //and condition
//   if (conversations.length) {
//     conversations.map(conversation => {
//       conversation.messages.push(newMessage)
//       conversation.save()
//     })
//   } else {
//      Conversation.create({
//       participants: participants,
//       recipients: newRecipients, 
//       messages: [newMessage]}) 
//   }
// })





//     //Update conversation db
//     //save chat to the database
    
    
//     const newMessage = { sender: id, text: text }
//     const participants1 = [...recipients, id]
//     const participants2 = [id, ...recipients] //participants permutates
//     console.log(participants1)
//     const conversations = await Conversation.find({ $or: [{participants: participants1}, {participants: participants2}]})
//     //...participants, $in
//     //Conversation.find({ participants: {'$in': ...participants}) search for permutations of participants? 
    
//     console.log('Conversations to find')
//     console.log(conversations)
//     if (conversations.length) {
//       console.log('entered if')
//       conversations.map(conversation => {
//         conversation.messages.push(newMessage)
//         conversation.save()
//       }) //did i mess that up? with findOne it was just one conversation
//     } else {
//       console.log('entered else')
//        Conversation.create({
//         participants: participants,//this causes a problem!!
//         recipients: recipients, 
//         messages: [newMessage]}) 
//     }
//   })
//   }
// ) //closing socket.on  send-message

//Add console register functions here
socket.on("disconnect", () => {
  console.log(`User disconnected`)
})

})



//another port for socket here?
server.listen(port, console.log(`Server connected at port ${port}`));
>>>>>>> 09edddb0af01c5450964e22f07e8d345e9199143
