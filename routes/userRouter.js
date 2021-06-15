const userRouter = require("express").Router();
const User = require("../models/User");
const Message = require("../models/Messages");
const verifyToken = require("./verifyToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

userRouter.get("/", async (req, res) => {
  const allUsers = await User.find({});
  if (!allUsers) {
    return res.status(400).send("Error getting users");
  }
  res.json({ allUsers });
});

userRouter.get("/:id", verifyToken, async (req, res) => {
  try {

    const getUser = await User.findById(req.params.id)
      .populate("userArticles")
      .populate("userComments");
    if (!getUser) {
      return res.status(400).send("Error getting user");
    }
    res.json({ getUser });

  } catch (error) {
    console.log(error)
    res.status(500).send("Error fetching user data")
  }


});

// create userRouter.post to create authtoken that will be sent back in response

userRouter.post("/register", async (req, res) => {
  try {

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    const newUser = await User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: hashPassword,
      email: req.body.email,
      user_role: req.body.user_role,
      admin: req.body.admin,
      languages: req.body.language,
      living_in_germany: req.body.living_in_germany,
      nationality: req.body.nationality,
    })
    const token = jwt.sign({ newUser: newUser._id }, process.env.SECRET)
    res.header('auth-token', token)
    res.json("User Registration was successful")


  } catch (error) {
    console.log(error)
    res.status(500).send("Error creating a new user account")
  }


});


module.exports = userRouter;