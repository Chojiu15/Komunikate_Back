const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");
const cors = require("cors");

// Connection port
const port = process.env.PORT || 3002;

// App setup tools
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

// These models need to be required here in order for populate method to work correctly
require("./models/Messages")
require("./models/Comments")
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
app.use("/article", articleRouter);

// Connect to Database
mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(port, console.log(`Server connected at port ${port}`));