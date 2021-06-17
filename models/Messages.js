const mongoose = require("mongoose");
const Schema = mongoose.Schema;


//storing the messages: find out which data is needed
//conversation/sessionID, content
//conversationID from session document

const Messages = new Schema({
  text: {
    type: String,
    trim: true,
    required: true,
    minLength: 1,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  id_user: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Messages", Messages);