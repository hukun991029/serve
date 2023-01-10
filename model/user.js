const dayjs = require('dayjs')
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
    default: dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
    get: v => dayjs(v).format('YYYY-MM-DD HH:mm:ss'),
    set: v => dayjs(v).format('YYYY-MM-DD HH:mm:ss')
  }
})
userSchema.set('toJSON', { getters: true })
const User = mongoose.model('user', userSchema)
module.exports = User
