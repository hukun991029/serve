const mongoose = require('mongoose')
const countSchema = new mongoose.Schema({
  _id: String,
  count: Number
})
const UserCount = mongoose.model('user_count', countSchema)
// UserCount.create({ _id: 'userId', count: 10000001 })
module.exports = UserCount
