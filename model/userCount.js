const mongoose = require('mongoose')
const countSchema = new mongoose.Schema({
  userId: Number,
  count: {
    type: Number,
    default: 10000001
  }
})
const UserCount = mongoose.model('user_count', countSchema)
module.exports = UserCount
