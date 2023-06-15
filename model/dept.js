const mongoose = require('./connect')
const DeptSchema = new mongoose.Schema({
  deptName: String, // 部门名称
  username: String, // 负责人名称
  userId: Number, // 负责人用户id
  email: String,
  parentId: {
    type: [mongoose.Types.ObjectId]
  },
  phone: Number,
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
const Dept = mongoose.model('dept', DeptSchema)
// Dept.create({
//   deptName:'技术部',
//   username:'张三',
//   userId:'10000001'
// })
module.exports = Dept
