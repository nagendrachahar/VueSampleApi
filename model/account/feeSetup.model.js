const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Fee Setup
let feeSetup = new Schema({
  classId: {
    type: Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },
  feeTypeId: {
    type: Schema.Types.ObjectId,
    ref: "FeeType",
    required: true
  },
  Fee: {
    type: Number,
    required: true
  },
  feeDate: {
    type: Date,
    default: Date.now()
  },
  Fine: {
    type: Number
  },
  Remark: {
    type: String
  }
},{
    collection: 'FeeSetup'
});

module.exports = mongoose.model('FeeSetup', feeSetup);