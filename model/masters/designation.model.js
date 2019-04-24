const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Designation
let Designation = new Schema({
  designationName: {
    type: String,
    required: true
  }
},{
    collection: 'Designation'
});

module.exports = mongoose.model('Designation', Designation);