const userRouter = require("express").Router();
const User = require("../models/User");
const Message = require("../models/Messages");
const verifyToken = require("../middlewares/verifyToken");
//const verifyAdminToken = require("../middlewares/verifyAdminToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Route for logged-in users getting the information of other users, includes handling query-strings.
userRouter.get("/", verifyToken, async (req, res) => {
  //spread operator giving a clone of the query object; assigning to a variable does not suffice, because js passes by reference
  const queryObj = { ...req.query };
  //cutting pagination queries
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  const users = await User.find(queryObj).select('-first_name -last_name -email -admin -userMessages'); 
  if (!users) {
    return res.status(400).send("Error getting users or no results in database for this query");
  }
  res.json({ users });

});


//here, specific information (like admin-role and password) will also have to be excluded
//check out how this is linked to articles and comments
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
//don't we have that in the authrouter?

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
      nationality: req.body.nationality
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