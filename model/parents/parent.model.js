const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Parent
let Parent = new Schema({
 
  gardiunName: {
    type: String,
    required: true
  },
  fatherName: {
    type: String,
    required: true
  },
  Profession: {
    type: String,
    required: true
  },
  motherName: {
    type: String,
    required: true
  },
  Email: {
    type: String
  },
  Phone: {
    type: String,
    required: true
  },
  nationalId:{
    type: String,
    required: true
  },
  religionId: {
    type: Schema.Types.ObjectId,
    ref: "Religion",
    required: true
  },
  stateId: {
    type: Schema.Types.ObjectId,
    ref: "State",
    required: true
  },
  cityId: {
    type: Schema.Types.ObjectId,
    ref: "City",
    required: true
  },
  Address: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true
  },
  photoPath: {
    type: String
  }
},{
    collection: 'Parent'
});

module.exports = mongoose.model('Parent', Parent);