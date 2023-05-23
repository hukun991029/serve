const mongoose = require('mongoose')
const RoleSchema = new mongoose.Schema({
  roleName: String,
  remark: String,
  permission: {
    type: mongoose.Types.ObjectId,
    ref: 'Permission'
  },
  createTime: {
    type: Date,
    default: Date.now()
  },
  updateTime: {
    type: Date,
    default: Date.now()
  },
  isDelete: {
    type: Boolean,
    default: false
  }
})
const Role = mongoose.model('role', RoleSchema)
module.exports = Role
