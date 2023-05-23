const mongoose = require('mongoose')
const MenuSchema = new mongoose.Schema({
  parentId: [mongoose.Types.ObjectId],
  componentPath: {
    type: String,
    default: ''
  },
  routePath: {
    type: String,
    default: ''
  },
  menuType: {
    type: String,
    default: '1'
  },
  menuIcon: {
    type: String,
    default: ''
  },
  permissionMaker: {
    type: String,
    default: ''
  },
  menuName: {
    type: String,
    default: ''
  },
  menuStatus: {
    type: String,
    default: '1'
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
const Menu = mongoose.model('menu', MenuSchema)
module.exports = Menu
