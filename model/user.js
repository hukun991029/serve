const dayjs = require('dayjs')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const AddressSchema = new mongoose.Schema({
  province: String,
  city: String,
  area: String
})
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
  address: AddressSchema,
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

// User.create({
//   username: 'admin',
//   password: '12345678',
//   address: {
//     province: '湖北省',
//     city: '黄冈市',
//     area: '黄梅县'
//   }
// })
module.exports = User
