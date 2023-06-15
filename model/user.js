const mongoose = require('./connect');
const bcrypt = require('bcryptjs');
const path = require('path');
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
});
userSchema.add({
  deptId: { type: mongoose.Types.ObjectId, default: '', ref: 'dept' },
  deptList: { type: Array, default: [mongoose.Types.ObjectId] },
  avatar: { type: String, default: path.join(__dirname, '../upload/favicon.ico') }
});
const User = mongoose.model('user', userSchema);

// User.create({
//   username: 'admin',
//   password: '123456',
//   deptId: '640c8d260e5ba1c29d1717c8',
//   userId: '1000001'
// });
module.exports = User;
