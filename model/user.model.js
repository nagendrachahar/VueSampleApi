const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let UserLogin = new Schema({
  Email: {
    type: String
  },
  Password: {
    type: String
  }
},{
    collection: 'User'
});

module.exports = mongoose.model('UserLogin', UserLogin);