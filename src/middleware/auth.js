const jwt = require("jsonwebtoken");
const User = require("../models/user");

// With Middleware => new request => do something => run route handler
// This middleware function helps to check client token and if it is valid return user informations
const auth = async (req, res, next) => {
  try {
    //get token from user.
    const token = req.header("Authorization").replace("Bearer ", "");
    //verift the user token
    const decoded = jwt.verify(token, "token");
    // Check the token is same as in the server ?
    //Find the user with the correct id  who has that authentication token
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    //add user onto the request
    req.user = user;
    // next: allow to run route handler
    next();
  } catch (error) {
    res.status(401).send({ err: "Token is not valid" });
  }
};
module.exports = auth;
