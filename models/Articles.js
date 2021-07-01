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
  teaserText: {
    type: String,
    trim: true,
    minLength: 8,
  },
  body: {
    type: String,
    trim: true,
    required: true,
  },
  body2: {
    type: String,
    trim: true,
    required: false,
  },
  body3: {
    type: String,
    trim: true,
    required: false,
  },
  // Buffer to Base64 info:
  // https://stackoverflow.com/questions/37077712/store-image-file-in-binary-data-in-mongoose-schema-and-display-image-in-html-for/37091088

  article_image: {
    data: Buffer,
    contentType: String
  },

  categories: {
    type: [String],
    required: false,
    trim: true,
},

  date: {
    type: Date,
    default: Date.now,
  },
  id_user: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  userComments: [{
    type: Schema.Types.ObjectId,
    ref: "Comments"
  }],
});

Articles.createIndex({title: "text", subtitle: "text", teaserText: "text", body: "text", body2: "text", body3: "text", categories: "text"})

module.exports = mongoose.model("Articles", Articles);