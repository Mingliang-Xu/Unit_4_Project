const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

require("dotenv").config();
const { PORT } = process.env;

const { sequelize } = require("./util/database");
const { User } = require("./models/user");
const { Post } = require("./models/post");

User.hasMany(Post);
Post.belongsTo(User);

const { login, register } = require("./controllers/auth");
const {
  addPost,
  getAllPosts,
  getCurrentUserPosts,
  editPost,
  deletePost,
} = require("./controllers/post");

const { isAuthenticated } = require("./middleware/isAuthenticated");

app.post("/api/register", register);
app.post("/api/login", login);

app.get("/api/posts", getAllPosts);

app.get("/api/userposts/:userId", getCurrentUserPosts);
app.post("/api/posts", isAuthenticated, addPost);
app.put("/api/posts/:id", isAuthenticated, editPost);
app.delete("/api/posts/:id", isAuthenticated, deletePost);

sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Running on Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
