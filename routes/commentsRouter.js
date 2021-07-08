const commentRouter = require("express").Router();
const Comments = require("../models/Comments");
const verifyToken = require("./verifyToken");

commentRouter.get("/", verifyToken, async (req, res) => {
    const allcomments = await Comments.find({});
    if (!allcomments) {
        return res.status(400).send("Error getting comments");
    }
    res.json({ allcomments });
});

commentRouter.get("/:id", verifyToken, async (req, res) => {
    const getcomment = await Comments.findById(req.params.id);
    if (!getcomment) {
        return res.status(400).send("Error getting comment");
    }
    res.json({ getcomment });
});

commentRouter.post("/", verifyToken, async (req, res) => {
    const comment = new comment({
        text: req.body.text,
        id_user: req.verified.user._id,
    });

    let error = comment.validateSync();
    if (error) {
        return res.status(400).send(error);
    }

    await comment.save();
    res.status(200).send("Comment created successfully");
});

module.exports = commentRouter;