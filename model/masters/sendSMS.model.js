const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for SMS
let SMS = new Schema({
  Message: {
    type: String,
    required: true
  }
},{
    collection: 'SMSCollection'
});

module.exports = mongoose.model('SMS', SMS);