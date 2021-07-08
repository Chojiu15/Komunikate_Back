const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const Conversation = new Schema({
  messages: [{
    sender: {
      type: String
    },
    text: {
        type: String,
    },
  }],
  participants: {
    type: [String]
  }
},
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", Conversation);


 // text: {
  //   type: String,
  //   trim: true,
  //   required: true,
  //   minLength: 1,
  // },
  // date: {
  //   type: Date,
  //   default: Date.now,
  // },
  // id_user: {
  //   type: Schema.Types.ObjectId,
  //   required: true,
  // },