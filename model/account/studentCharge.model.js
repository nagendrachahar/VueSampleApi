const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Student Charge
let studentCharge = new Schema({
  classId: {
    type: Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  feeTypeId: {
    type: Schema.Types.ObjectId,
    ref: "FeeType",
    required: true
  },
  Amount: {
    type: Number,
    required: true
  },
  Date: {
    type: Date,
    default: Date.now()
  },
  Remark: {
    type: String
  },
  EntryOn: {
    type: Date,
    default: Date.now()
  }
},{
    collection: 'StudentCharge'
});

module.exports = mongoose.model('StudentCharge', studentCharge);