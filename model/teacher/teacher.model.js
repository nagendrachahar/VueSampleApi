const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Teacher
let Teacher = new Schema({
  teacherCode: {
    type: String,
    required: true
  },
  teacherName: {
    type: String,
    required: true
  },
  teacherEmail: {
    type: String,
    required: true
  },
  teacherPhone: {
    type: String,
    required: true
  },
  nationalId: {
    type: String,
    required: true
  },
  branchId: {
    type: Schema.Types.ObjectId,
    ref: "BranchSetup",
    required: true
  },
  designationId: {
    type: Schema.Types.ObjectId,
    ref: "Designation",
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true,
    default:Date.now
  },
  Gender: {
    type: String,
    required: true
  },
  religionId: {
    type: Schema.Types.ObjectId,
    ref: "Religion",
    required: true
  },
  joiningDate: {
    type: Date,
    required: true,
    default:Date.now
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
  },
  entryOn: {
    type: Date,
    required: true,
    default:Date.now
  }
},{
    collection: 'Teacher'
});

module.exports = mongoose.model('Teacher', Teacher);