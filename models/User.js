const mongoose = require("mongoose");
require("mongoose-type-email");
const Schema = mongoose.Schema;

const User = new Schema({
    first_name: {
        type: String,
        trim: true,
        required: true,
        minLength: 2,
        maxLength: 32,
    },
    last_name: {
        type: String,
        trim: true,
        required: true,
        minLength: 2,
        maxLength: 32,
    },
    username: {
        type: String,
        trim: true,
        required: true,
        minLength: 2,
        maxLength: 32,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,
    },
    // Buffer to Base64 info:
    // https://stackoverflow.com/questions/37077712/store-image-file-in-binary-data-in-mongoose-schema-and-display-image-in-html-for/37091088
    profile_image: {
        data: Buffer,
        contentType: String
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        lowercase: true,
        trim: true,
        required: true,
    },
    // https://stackoverflow.com/questions/34023169/how-to-define-a-boolean-field-in-mongodb-bson-document
    user_role_seeker: {
        type: Boolean,
        default: true,
        required: true,
    },

    user_role_mentor: {
        type: Boolean,
        default: false,
        required: true,
    },

    user_role_admin: {
        type: Boolean,
        default: false,
        required: true,
    },

    languages: {
        type: [{ language: String }],
        required: true,
        trim: true,
    },

    living_in_germany: {
        type: Boolean,
        default: false,
        required: true
    },

    city_in_germany: {
        type: String,
        trim: true,
        minLength: 2,
        maxLength: 32,
    },

    years_in_germany: {
        type: Number,
        minLength: 4,
        maxLength: 4,
    },

    student: {
        type: Boolean,
        default: true,
        required: false
    },

    worker: {
        type: Boolean,
        default: false,
        required: false
    },

    profession: {
        type: [{ profession: String }],
        trim: true,
    },

    interests: {
        type: [{ interest: String }],
        trim: true,
    },

    nationality: {
        type: [{ nationality: String }],
        required: true,
        trim: true,
    },

    userBio: {
        type: String,
    },

});

module.exports = mongoose.model("User", User);
