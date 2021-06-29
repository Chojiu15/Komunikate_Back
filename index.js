const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
require("dotenv/config");

const cors = require("cors");
const { createAdminCRUD } = require("ra-expressjs-mongodb-scaffold"); // import the library


// Connection port
const port = process.env.PORT || 3002;

// App setup tools
app.use(helmet()); //helmet added for more secure header
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header('Access-Control-Expose-Headers', 'Content-Range')
  next()
})
app.use(express.json());

// These models need to be required here in order for populate method to work correctly
require("./models/Messages")
require("./models/Comments")

// this Articles model require causes .get to fail
/* require("./models/Articles") */

// Router declarations
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const messageRouter = require("./routes/messageRouter");
const articleRouter = require("./routes/articleRouter");

// Router setup
app.use("/", authRouter);
app.use("/users", userRouter);
app.use("/messages", messageRouter);
app.use("/posts", articleRouter);

// Connect to Database
mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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