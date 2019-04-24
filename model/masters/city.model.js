const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for City
let City = new Schema({
  stateId: {
    type: Schema.Types.ObjectId,
    ref: "State",
    required: true
  },
  cityName: {
    type: String,
    required: true
  }
},{
    collection: 'City'
});

module.exports = mongoose.model('City', City);