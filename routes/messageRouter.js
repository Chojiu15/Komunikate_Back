const messageRouter = require("express").Router();
const Message = require("../models/Messages");
const verifyToken = require("./verifyToken");

messageRouter.get("/", verifyToken, async (req, res) => {
    const allMessages = await Message.find({});
    if (!allMessages) {
        return res.status(400).send("Error getting messages");
    }
    res.json({ allMessages });
});

messageRouter.get("/:id", verifyToken, async (req, res) => {
    const getMessage = await Message.findById(req.params.id);
    if (!getMessage) {
        return res.status(400).send("Error getting message");
    }
    res.json({ getMessage });
});

messageRouter.post("/", verifyToken, async (req, res) => {
    const message = new Message({
        text: req.body.text,
        id_user: req.verified.user._id,
    });

    let error = message.validateSync();
    if (error) {
        return res.status(400).send(error);
    }

    await message.save();
    res.status(200).send("Message created successfully");
});

module.exports = messageRouter;