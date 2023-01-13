const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
  username: String,
  password: {
    type: String,
    max: 16,
    min: 8,
    set: v => bcrypt.hashSync(v, bcrypt.genSaltSync(10))
  },
  userId: Number,
  phone: String | Number,
  email: String,
  address: {
    type: {
      province: String,
      city: String,
      area: String
    }
  },
  createTime: {
    type: Date,
    default: Date.now()
  },
  updateTime: {
    type: Date,
    default: Date.now()
  },
  isDelete: { type: Number, default: 0 }
})
const User = mongoose.model('user', userSchema)

module.exports = User
