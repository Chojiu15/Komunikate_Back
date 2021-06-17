const userRouter = require("express").Router();
const User = require("../models/User");
const Message = require("../models/Messages");
const verifyToken = require("../middlewares/verifyToken");
const verifyAdminToken = require("../middlewares/verifyAdminToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//this has to be modified: we want the user to receive a list of the other users and being able to display their profiles
//only the admin will be able to get a list of the all the users and ALL of the details (goes into authRouter) 
//==> two get routes
userRouter.get("/", verifyAdminToken, async (req, res) => {
  // pass back a VerifyAdminToken where we can check if role of the token is an admin
  // If true, then display list of all users
  // Use jwt-decode. If false, then deny access
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