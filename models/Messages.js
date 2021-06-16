const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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