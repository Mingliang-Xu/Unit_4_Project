const { Post } = require("../models/post");

const { User } = require("../models/user");

module.exports = {
  addPost: async (req, res) => {
    try {
      const { title, content, status, userId } = req.body;

      await Post.create({
        title: title,
        content: content,
        privateStatus: status,
        userId: userId,
      })
        .then((post) => {
          console.log(`add posts`);
          res.sendStatus(200);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  },
  getAllPosts: async (req, res) => {
    try {
      await Post.findAll({
        where: { privateStatus: false },
        include: [
          {
            model: User,
            required: true,
            attribute: ["username"],
          },
        ],
      })
        .then((posts) => {
          res.status(200).send(posts);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
      console.log(`Error in getting all posts`);
      res.sendStatus(400);
    }
    // console.log(`get all posts`);
    // res.sendStatus(200);
  },
  getCurrentUserPosts: async (req, res) => {
    try {
      const { userId } = req.params;
      await Post.findAll({
        where: { userId: userId },
        include: [
          {
            model: User,
            required: true,
            attribute: ["username"],
          },
        ],
      })
        .then((posts) => {
          res.status(200).send(posts);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(`Error in getting all current users' posts`);
      res.sendStatus(400);
    }

    // console.log(`get current user posts`);
    // res.sendStatus(200);
  },
  editPost: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await Post.update(
        {
          privateStatus: status,
        },
        { where: { id: +id } }
      )
        .then((post) => {
          console.log(`Post status updated`);
          res.sendStatus(200);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(`Error in editing posts`);
      res.sendStatus(400);
    }
  },
  deletePost: async (req, res) => {
    try {
      const { id } = req.params;
      await Post.findByPk(id)
        .then(Post.destroy({ where: { id: +id } }))
        .then((result) => {
          res.status(200).send(`post deleted`);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(`Error in deleting posts`);
      res.sendStatus(400);
    }
  },
};
