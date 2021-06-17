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

//Update user profile
//User has to be logged in to change profile data
//User can only change her own profile/user data
authRouter.put('update/:id', verifyToken, async (req, res,) => {
  //Check if the user sending the request belongs to the profile
  if (req.verified.use._id !== req.params.id) {
    return res.status(400).send('User profile request is invalid')
  }

  //Check if the user wants to change email
  //If yes, check if the email already exists in db
  if (req.verified.user.email !== req.params.email) {
    const newEmail = await User.findOne({ email: req.body.email });
    if (newEmail) {
      return res.status(400).send('Email already exists')
    }
  }

  //Get the profile to be updated
  const updateUser = await User.findById(req.params.id)
  if (!updateUser) {
    return res.status(400).send('Error getting user')
  }

  //For changing the password, it has to be hashed
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(req.body.password, salt)

  //Set all other data with what we get from the body
  updateUser.first_name = req.body.first_name
  updateUser.last_name = req.body.last_name
  updateUser.username = req.body.username
  updateUser.password = hashPassword
  updateUser.email = req.body.email
  updateUser.user_role = req.body.user_role
  updateUser.admin = req.body.admin
  updateUser.languages = req.body.language
  updateUser.living_in_germany = req.body.living_in_germany
  updateUser.nationality = req.body.nationality

  let error = updateUser.validateSync()
  if (error) {
    return res.status(400).send(error)
  }

  await updateUser.save()
  res.status(200).send('User profile update was successful')
})

module.exports = authRouter;