const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Student
let Student = new Schema({
  
  studentCode: {
    type: String,
    required: true
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: "Parent",
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  Phone: {
    type: String,
    required: true
  },
  Address: {
    type: String,
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
  branchId: {
    type: Schema.Types.ObjectId,
    ref: "BranchSetup",
    required: true
  },
  religionId: {
    type: Schema.Types.ObjectId,
    ref: "Religion",
    required: true
  },
  classId: {
    type: Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },
  rollNo: {
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
    collection: 'Student'
});

module.exports = mongoose.model('Student', Student);