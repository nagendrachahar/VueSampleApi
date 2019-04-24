const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Class
let Class_Schema = new Schema({
  
  className: {
    type: String,
    required: true
  },
  classNumeric: {
    type: String,
    required: true
  },
  classTeacherId: {
    type: Schema.Types.ObjectId,
    ref: "Teacher"
  }
},{
    collection: 'Class'
});

module.exports = mongoose.model('Class', Class_Schema);