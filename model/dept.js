const mongoose = require('mongoose')
const DeptSchema = new mongoose.Schema({
  deptName: String, // 部门名称
  principal: String, // 负责人
  parentId: {
    type: [mongoose.Types.ObjectId]
  },
  createTime: {
    type: Date,
    default: Date.now()
  },
  updateTime: {
    type: Date,
    default: Date.now()
  }
})
const Dept = mongoose.model('dept', DeptSchema)
module.exports = Dept
