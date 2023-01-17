const mongoose = require('mongoose')
const routeSchema = new mongoose.Schema({
  name: String,
  path: String,
  component: String,
  redirect: String,
  icon: String,
  keepAlive: Boolean,
  parentId: [mongoose.Types.ObjectId],
  createTime: {
    type: Date,
    default: Date.now()
  },
  updateTime: {
    type: Date,
    default: Date.now()
  }
})
const Route = mongoose.model('route', routeSchema)
