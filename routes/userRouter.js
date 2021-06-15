const userRouter = require("express").Router();
const User = require("../models/User");
const Message = require("../models/Messages");
const verifyToken = require("./verifyToken");

userRouter.get("/", async (req, res) => {
  const allUsers = await User.find({});
  if (!allUsers) {
    return res.status(400).send("Error getting users");
  }
  res.json({ allUsers });
});

userRouter.get("/:id", async (req, res) => {
  const getUser = await User.findById(req.params.id);
  if (!getUser) {
    return res.status(400).send("Error getting user");
  }
  res.json({ getUser });
});

userRouter.get("/:id/messages", async (req, res) => {
  const messagesByUser = await Message.find({ id_user: req.params.id });
  if (!messagesByUser) {
    return res.status(400).send("Error getting user messages");
  }

  res.json({ messagesByUser });
});

module.exports = userRouter;