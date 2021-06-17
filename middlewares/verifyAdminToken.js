const jwt = require("jsonwebtoken");

// pass back a VerifyAdminToken where we can check if role of the token is an admin
// If true, then display list of all users
// Use jwt-decode. If false, then deny access

const verifyAdminToken = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(400).send("Access denied");
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET);
    req.verified = verified;

    if (req.verified.user.admin === true) {
      next();
    } else {
      return res.status(400).send("Access denied");
    }
  } catch (err) {
    res.send("Access Denied");
  }
};

module.exports = verifyAdminToken;