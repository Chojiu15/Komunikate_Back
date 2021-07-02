const conversationsRouter = require("express").Router();
const Conversation = require("../models/Conversation");
const verifyToken = require("../middlewares/verifyToken");

//user should only be able to get conversations with his own id, i.e. if req.params.id is not equal to the id stored in the token, an error will be thrown
conversationsRouter.get("/ind", verifyToken, async (req, res) => {
    const id = req.verified.user._id //getting the id of the user who tries to connect
    const getConversations = await Conversation.find({ participants: {'$in': id}}) 
    if (!getConversations) {
        return res.status(400).send("Error getting message");
    }
    res.json(getConversations);
}); 

conversationsRouter.post('/', async (req, res) => {
    const conversation = new Conversation({
        messages: [
            {sender: req.body.sender,
            text: req.body.text}],
        recipients: req.body.recipients
    })

    let error = conversation.validateSync();
    if (error) {
        return res.status(400).send(error);
    }

    await conversation.save();
    res.status(200).send("Conversation created successfully");
}) //working

// i'll probably won't need that, because incoming messages are saved on the BE automatically
// conversationsRouter.post("/", verifyToken, async (req, res) => {
//     const message = new Message({
//         text: req.body.text,
//         id_user: req.verified.user._id,
//     });

//     let error = message.validateSync();
//     if (error) {
//         return res.status(400).send(error);
//     }

//     await message.save();
//     res.status(200).send("Message created successfully");
// });

module.exports = conversationsRouter;