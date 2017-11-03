const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  public_wallet_id: String,
  mining_port: String,
  os: String,
  processor: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('downloads', schema);
