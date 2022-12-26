const mongoose = require('mongoose')
const AddressSchema = new mongoose.Schema({
  province: 'string',
  city: 'string',
  area: 'string'
})
const userSchema = new mongoose.Schema({
  userName: 'string',
  passWord: {
    type: 'string',
    max: 16,
    min: 8
  },
  phone: 'string',
  address: AddressSchema,
  createTime: {
    type: Date,
    default: Date.now()
  },
  updateTime: {
    type: Date,
    default: Date.now()
  }
})
const User = mongoose.model('user', userSchema)

// User.create({
//   userName: 'admin',
//   passWord: '12345678',
//   address: {
//     province: '湖北省',
//     city: '黄冈市',
//     area: '黄梅县'
//   }
// })
module.exports = User
