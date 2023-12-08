require("dotenv").config(); // importing the enviroment
const jwt = require("jsonwebtoken"); // import JWT
const { SECRET } = process.env; // desctructure the SECRET from .env file for auth

module.exports = {
  isAuthenticated: (req, res, next) => {
    // middleware takes 3 params
    const headerToken = req.get("Authorization");
    // console.log(headerToken);

    if (!headerToken) {
      // error handling
      console.log("ERROR IN auth middleware");
      res.sendStatus(401);
    }

    let token;

    try {
      // to verify token authenticity
      token = jwt.verify(headerToken, SECRET);
    } catch (err) {
      err.statusCode = 500;
      throw err;
    }

    if (!token) {
      // check if token if verified
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      throw error;
    }

    next();
  },
};
