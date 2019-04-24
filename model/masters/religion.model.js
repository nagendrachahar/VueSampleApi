const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Religion
let Religion = new Schema({
  religionName: {
    type: String,
    required: true
  }
},{
    collection: 'Religion'
});

module.exports = mongoose.model('Religion', Religion);