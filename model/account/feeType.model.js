const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Fee Type
let feeType = new Schema({
  feeTypeName: {
    type: String,
    required: true
  },
  Remark: {
    type: String
  }
},{
    collection: 'FeeType'
});

module.exports = mongoose.model('FeeType', feeType);