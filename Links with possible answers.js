// https://dev.to/paras594/how-to-use-populate-in-mongoose-node-js-mo0

// https://mongoosejs.com/docs/populate.html

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

const storySchema = Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Person' },
  title: String,
  fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
});

const Story = mongoose.model('Story', storySchema);
const Person = mongoose.model('Person', personSchema);


// https://www.codegrepper.com/code-examples/javascript/how+to+link+two+models+in+mongoose+using+type+ref

const mongoose = require('mongoose')
  , Schema = mongoose.Schema

const eventSchema = Schema({
  title: String,
  location: String,
  startDate: Date,
  endDate: Date
});

const personSchema = Schema({
  firstname: String,
  lastname: String,
  email: String,
  gender: { type: String, enum: ["Male", "Female"] }
    dob: Date,
  city: String,
  interests: [interestsSchema],
  eventsAttended: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
});

const Event = mongoose.model('Event', eventSchema);
const Person = mongoose.model('Person', personSchema);