const router = require('koa-router')()
const User = require('../model/user')
const Count = require('../model/userCount')
const { setResponse } = require('../utils/util')
router.prefix('/user')

router.get('/list', async ctx => {
  const { username, userId, startTime, endTime, pageSize, pageNum } =
    ctx.request.query
  const query = {
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
  }
  const res = await User.aggregate([
    {
      $match: query
    },
    {
      $facet: {
        total: [{ $count: 'count' }],
        data: [
          {
            $skip: (pageNum - 1) * 10
          },
          { $limit: Number(pageSize) }
        ]
      }
    },
    {
      $project: {
        data: '$data',
        total: { $arrayElemAt: ['$total.count', 0] }
      }
    }
  ])
  console.log(res)
  ctx.body = Object.assign(setResponse(res[0].data), {
    total: res[0].total
  })
})

router.post('/add', async ctx => {
  const params = ctx.request.body
  const docs = await User.findOne({
    $or: [{ username: params.username }, { email: params.email }]
  })
  if (docs) {
    ctx.body = setResponse(
      [],
      999,
      `系统监测该用户已存在,信息如下${params.username}-${params.email}`
    )
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
  // User.create(params)
})

router.post('/update', async ctx => {
  const params = ctx.request.body
  console.log(params)
  await User.findOneAndUpdate({ userName: params.userName }, { ...params })
  ctx.body = setResponse([], 200)
})
module.exports = router
