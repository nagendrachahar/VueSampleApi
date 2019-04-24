const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for State
let State = new Schema({
  stateName: {
    type: String,
    required: true
  },
  city:[{
    type: Schema.Types.ObjectId,
    ref: "City",
    required: true
  }]
},{
    collection: 'State'
});

module.exports = mongoose.model('State', State);