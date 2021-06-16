const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Articles = new Schema({
  title: {
    type: String,
    trim: true,
    minLength: 8,
  },
  subtitle: {
    type: String,
    trim: true,
    minLength: 8,
  },
  body: {
    type: String,
    trim: true,
    required: true,
  },
  // Buffer to Base64 info:
  // https://stackoverflow.com/questions/37077712/store-image-file-in-binary-data-in-mongoose-schema-and-display-image-in-html-for/37091088

  article_image: {
    data: Buffer,
    contentType: String
  },
  date: {
    type: Date,
    default: Date.now,
  },
  id_user: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userComments: [{
    type: Schema.Types.ObjectId,
    ref: "Comments"
  }],
});

module.exports = mongoose.model("Articles", Articles);