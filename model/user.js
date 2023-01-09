const dayjs = require('dayjs')
const mongoose = require('mongoose')
const AddressSchema = new mongoose.Schema({
  province: String,
  city: String,
  area: String
})
const userSchema = new mongoose.Schema({
  userName: String,
  passWord: {
    type: String,
    max: 16,
    min: 8
  },
  user_id: Number,
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
const User = mongoose.model('user', userSchema)

// User.create({
//   userName: '123',
//   passWord: '12345678',
//   address: {
//     province: '湖北省',
//     city: '黄冈市',
//     area: '黄梅县'
//   }
// })
module.exports = User
