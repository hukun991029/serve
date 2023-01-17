const mongoose = require('mongoose')
const RoleSchema = new mongoose.Schema({
  roleName: String,
  remark: String,
  createTime: {
    type: Date,
    default: Date.now()
  },
  updateTime: {
    type: Date,
    default: Date.now()
  }
})
const Role = mongoose.model('role', RoleSchema)
module.exports = Role
