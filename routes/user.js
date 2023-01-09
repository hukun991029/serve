const router = require('koa-router')()
const User = require('../model/user')
const { setResponse } = require('../utils/util')
router.prefix('/user')
router.post('/add', async ctx => {
  // const { username, userId, startTime, endTime } = ctx.request.query
  // const user = User.find({ username, userId })
  // setResponse(user)
})
router.get('/list', async ctx => {
  const { username, userId, startTime, endTime } = ctx.request.query
  const user = await User.find({
    $and: [
      { username: { $regex: username } },
      { $or: [userId ? { userId: { $regex: userId } } : {}] }
      // { createTime: { $gte: startTime, $lte: endTime } }
    ]
  })
  ctx.body = setResponse(user)
})
module.exports = router
