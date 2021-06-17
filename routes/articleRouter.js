const articleRouter = require("express").Router();
const Articles = require("../models/Articles");
const verifyToken = require("../middlewares/verifyToken");

articleRouter.get("/", verifyToken, async (req, res) => {
    const allarticles = await Articles.find({});
    if (!allarticles) {
        return res.status(400).send("Error getting articles");
    }
    res.json({ allarticles });
});

articleRouter.get("/:id", verifyToken, async (req, res) => {
    const getarticle = await Articles.findById(req.params.id)
        .populate("userComments");
    if (!getarticle) {
        return res.status(400).send("Error getting article");
    }
    res.json({ getarticle });
});

articleRouter.post("/", verifyToken, async (req, res) => {
    const article = new Article({
        text: req.body.text,
        id_user: req.verified.user._id,
    });

    let error = Article.validateSync();
    if (error) {
        return res.status(400).send(error);
    }

    await Article.save();
    res.status(200).send("article created successfully");
});

module.exports = articleRouter;