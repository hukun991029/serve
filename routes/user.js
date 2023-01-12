const router = require('koa-router')()
const User = require('../model/user')
const Count = require('../model/userCount')
const { setResponse } = require('../utils/util')
router.prefix('/user')

router.get('/list', async ctx => {
  const { username, userId, startTime, endTime, pageSize, pageNum } = ctx.request.query
  const sql = {
    isDelete: 0
  }
  if (startTime || endTime) {
    sql['createTime'] = { $gte: new Date(startTime), $lte: new Date(endTime) }
  }
  if (username) {
    sql['username'] = { $regex: username }
  }
  if (userId) {
    sql['userId'] = { userId: Number(userId) }
  }
  const result = await User.find(sql)
    .skip((pageNum - 1) * 10)
    .limit(Number(pageSize))
  ctx.body = setResponse({ rows: result, total: result.length })
})

router.post('/add', async ctx => {
  const params = ctx.request.body
  const docs = await User.findOne({
    $or: [{ username: params.username }, { email: params.email }]
  })
  if (docs) {
    ctx.body = setResponse([], 999, `系统监测该用户已存在,用户名称${params.username}或用户邮箱${params.email}重复`)
  } else {
    const counrDocs = await Count.findOneAndUpdate(
      { _id: 'userId' },
      { $inc: { count: 1 } },
      {
        new: true
      }
    )

    await User.create({
      userId: counrDocs.count,
      ...params
    })
    ctx.body = setResponse([], 200)
  }
})

router.post('/update', async ctx => {
  const params = ctx.request.body
  await User.findOneAndUpdate({ username: params.username }, { ...params })
  ctx.body = setResponse([], 200)
})

router.get('/del', async ctx => {
  const { userId } = ctx.request.query
  await User.findOneAndUpdate({ userId }, { isDelete: 1 })
  ctx.body = setResponse([], 200)
})
module.exports = router
