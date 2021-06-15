const authRouter = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

authRouter.get("/", async (req, res) => {
  res.send(`
  Instructions:
  User registration: /register
  User login: /login
  Get all users: /users
  Get all users by id: /users/id
  Get all messages: /messages
  Get all messages by id: /messages/id
  Get all messages by user: users/id/messages
  Get all comments by 
  Create a new message: /messages
  `);
});

authRouter.post("/register", async (req, res) => {
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("Email already exist");
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  let error = user.validateSync();
  if (error) {
    return res.status(400).send(error);
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  user.password = hashPassword;
  error = user.validateSync();
  if (error) {
    return res.status(400).send(error);
  }

  await user.save();
  res.status(200).send("User registration was successful");
});

authRouter.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Email not found");
  }

  const comparePassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!comparePassword) {
    return res.status(400).send("Wrong password");
  }

  const token = jwt.sign({ user }, process.env.SECRET);
  res.header("auth-token", token);
  res.json(token);
});

module.exports = authRouter;