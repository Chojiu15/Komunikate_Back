const userRouter = require("express").Router();
const User = require("../models/User");
const Message = require("../models/Messages");
const verifyToken = require("../middlewares/verifyToken");
//const verifyAdminToken = require("../middlewares/verifyAdminToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Route for logged-in users getting the information of other users, includes handling query-strings.
userRouter.get("/", /* verifyToken, */ async (req, res) => {
  //spread operator giving a clone of the query object; assigning to a variable does not suffice, because js passes by reference
  const queryObj = { ...req.query };
  //cutting pagination queries
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Line directly below is the version of the get route that filters out the selected fields.
  /* const users = await User.find(queryObj).select('-first_name -last_name -email -admin -userMessages -userComments -userArticles'); */
  // 
  const users = await User.find(queryObj).select('-userComments -userArticles');
  if (!users) {
    return res.status(400).send("Error getting users or no results in database for this query");
  }
  res.set("Content-Range", users.length)
  res.json({ users });

});

userRouter.get("/:id", /* verifyToken, */ async (req, res) => {
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

// Edit a single user
userRouter.put("/:id", /* verifyToken, */ async (req, res) => {

});

// Delete a single user
userRouter.delete("/:id", /* verifyToken, */ async (req, res) => {
  User
  .deleteOne({ _id : req.params.id})
  .then(() => res.json('One row was deleted'))
  .catch((err) => res.json(err))
});

/* studentRouter.put('/api/students/:id', (req, res) => {
  Student
  .updateOne({_id : req.params.id}, {$set : req.body })
  .then((student) => res.json(student))
  .catch((err) => res.json(err));
})

studentRouter.delete('/api/students/:id', (req, res) => {
    Student
    .deleteOne({ _id : req.params.id})
    .then(() => res.json('One row was deleted'))
    .catch((err) => res.json(err))
})




*/


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
      email: req.body.email, // unique
      user_role: req.body.user_role, // "Mentor" or "Seeker"
      admin: req.body.admin, // Boolean
      languages: req.body.languages, // String
      living_in_germany: req.body.living_in_germany, // Boolean
      nationality: req.body.nationality
    })
    const token = jwt.sign({ newUser: newUser._id }, process.env.SECRET)
    res.header('auth-token', token)
    res.json("User Registration was successful!")
    res.redirect('../login')

  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }


});


module.exports = userRouter;