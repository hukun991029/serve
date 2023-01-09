const router = require('koa-router')()
const User = require('../model/user')
const { setResponse } = require('../utils/util')
router.prefix('/user')

router.get('/list', async ctx => {
  const { username, userId, startTime, endTime } = ctx.request.query
  const user = await User.find({
    $and: [
      { username: { $regex: username } },
      { $or: [userId ? { $regex: String(userId) } : {}] },
      {
        $or: [
          startTime || endTime
            ? {
                createTime: {
                  $gte: new Date(startTime),
                  $lte: new Date(endTime)
                }
              }
            : {}
        ]
      }
    ]
  })
  ctx.body = setResponse(user)
})

router.post('/add', async ctx => {})
module.exports = router
