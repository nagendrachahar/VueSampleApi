const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let School = new Schema({
  schoolLogo: {
    type: String
  },
  schoolCode: {
    type: String
  },
  schoolName: {
    type: String
  },
  email: {
    type: String
  },
  contactNo: {
    type: String
  },
  Address: {
    type: String
  }
},{
    collection: 'SchoolSetup'
});

module.exports = mongoose.model('School', School);