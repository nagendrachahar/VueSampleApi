const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Admin Menu
let adminMenu = new Schema({
  parentId: {
    type: String
  },
  icon: {
    type: String
  },
  title: {
    type: String
  },
  url: {
    type: String
  }
},{
    collection: 'AdminMenu'
});

module.exports = mongoose.model('AdminMenu', adminMenu);