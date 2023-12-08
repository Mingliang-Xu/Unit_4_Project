const jwt = require("jsonwebtoken");

require("dotenv").config();

const { User } = require("../models/user");
const bcrypt = require("bcryptjs");

const { SECRET } = process.env;

const createToken = (username, id) => {
  return jwt.sign({ username, id }, SECRET, { expiresIn: "2 days" });
};

module.exports = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const foundUser = await User.findOne({ where: { username: username } });
      if (foundUser) {
        const isAuthenticated = bcrypt.compareSync(
          password,
          foundUser.hashedPass
        );
        if (isAuthenticated) {
          let token = createToken(
            foundUser.dataValues.username,
            foundUser.dataValues.id
          );
          const exp = Date.now() + 1000 * 60 * 60 * 48;

          const result = {
            username: foundUser.dataValues.username,
            userId: foundUser.dataValues.id,
            token: token,
            exp: exp,
          };
          res.status(200).send(result);
        } else {
          res.status(400).send(`Password is incorrect!`);
        }
      } else {
        res.status(400).send(`User does not exist!`);
      }
    } catch (error) {
      console.log(error);
    }
    // console.log(token);
    // console.log(`this is a longin func`);
    // res.sendStatus(200);
    // res.status(200).send(token);
  },
  register: async (req, res) => {
    // console.log(`this is a register func`);
    // res.sendStatus(200);
    try {
      const { username, password } = req.body;
      const foundUser = await User.findOne({ where: { username: username } });
      if (foundUser) {
        res.status(400).send(`We can't create the user already exists`);
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const newUser = await User.create({
          username: username,
          hashedPass: hash,
        });
        let token = createToken(
          newUser.dataValues.username,
          newUser.dataValues.id
        );
        const exp = Date.now() + 1000 * 60 * 60 * 48;
        const result = {
          username: newUser.dataValues.username,
          userId: newUser.dataValues.id,
          token: token,
          exp: exp,
        };
        res.status(200).send(result);
      }
    } catch (error) {
      console.log(error);
    }
  },
};
