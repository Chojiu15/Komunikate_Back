const articleRouter = require("express").Router();
const Article = require("../models/Articles");
const verifyToken = require("../middlewares/verifyToken");

articleRouter.get("/", async (req, res) => {
    const allarticles = await Article.find({});
    if (!allarticles) {
        return res.status(400).send("Error getting articles");
    }
    res.json({ allarticles });
});

articleRouter.get("/:id", verifyToken, async (req, res) => {
    const getarticle = await Article.findById(req.params.id)
        .populate("userComments");
    if (!getarticle) {
        return res.status(400).send("Error getting article");
    }
    res.json({ getarticle });
});

articleRouter.post("/", /* verifyToken, */ async (req, res) => {
    const article = new Article({
        title: req.body.title,
        subtitle: req.body.subtitle,
        username: req.body.username,
        teaserText: req.body.teaserText,
        body: req.body.body,
        body2: req.body.body2,
        body3: req.body.body3,
        article_image: req.body.article_image,
        id_user: req.body.id_user,
        });

    let error = article.validateSync();
    if (error) {
        return res.status(400).send(error);
    }

    await article.save();
    res.status(200).send("article created successfully");
});

module.exports = articleRouter;