const mongoose = require("mongoose");
require("mongoose-type-email");
const Schema = mongoose.Schema;
/* const Messages = require("./Messages")
const Comments = require("./Comments")
const Articles = require("./Articles") */

// The following three lines helps get rid of the Deprecation Warning: collection.ensureIndex - which is related to mongoose
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

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
        unique: true  //username should be unique
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
        unique: true //email should be unique
    },
    // https://stackoverflow.com/questions/34023169/how-to-define-a-boolean-field-in-mongodb-bson-document
    user_role: {
        type: String,
        enum: ["Seeker", "Mentor"],
        default: "Seeker",
        required: true,
    },

    /*     user_role_seeker: {
            type: Boolean,
            default: true,
            required: true,
        },
    
        user_role_mentor: {
            type: Boolean,
            default: false,
            required: true,
        }, */
    //i deleted the admin thing. can't remember what to do about it, whether string or boolean...

    languages: {
        type: [String],
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

    to_germany_year: {  //changed this to make it clear what we store
        type: Number,
        minLength: 4,
        maxLength: 4,
    },
//
// Removed the student - worker fields and exchanged with 'working_role'
//
/*     student: {
        type: Boolean,
        default: true,
        required: false
    },

    worker: {
        type: Boolean,
        default: false,
        required: false
    }, */
//

    working_role: {
        type: String,
        enum: ["Working", "Studying"],
        default: "Working",
        required: false,
    },

    profession: {
        type: [String],
        trim: true,
    },

    interests: {
        type: [String],
        trim: true,
    },

    nationality: {
        type: [String],
        required: true,
        trim: true,
    },

    userBio: {
        type: String,
    },

    userConversations: [{           //maybe we don't even need this entry.
        type: Schema.Types.ObjectId,
        ref: "Conversations"
    }],

    userComments: [{
        type: Schema.Types.ObjectId,
        ref: "Comments"
    }],

    userArticles: [{
        type: Schema.Types.ObjectId,
        ref: "Articles"
    }],

},
    { timestamps: true }
);

//timestamps for users

//Filtering out the password. It will not show up in res.json objects.
User.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
}


module.exports = mongoose.model("User", User);