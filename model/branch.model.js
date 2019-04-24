const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Branch
let Branch = new Schema({
  branchCode: {
    type: String
  },
  branchName: {
    type: String
  },
  branchEmail: {
    type: String
  },
  branchContactNo: {
    type: String
  },
  branchAddress: {
    type: String
  },
  inchargePerson: {
    type: String
  },
  inchargePersonContact: {
    type: String
  }
},{
    collection: 'BranchSetup'
});

module.exports = mongoose.model('Branch', Branch);