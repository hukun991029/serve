const router = require('koa-router')()
const User = require('../model/user')
const Dept = require('../model/dept')
const { setResponse } = require('../utils/util.js')
router.prefix('/dept')
router.get('/list', async ctx => {
  const { deptName } = ctx.body.query
  const res = await Dept.find()
  ctx.body = setResponse(res)
})
router.get('/getAllUser', async ctx => {
  const res = await User.find({}, { username: 1, userId: 1, _id: 0 })
  ctx.body = setResponse(res)
})
router.post('/add', async ctx => {
  const { userId, parentId, deptName } = ctx.request.body
  const { email, username } = await User.findOne({ userId })
  Dept.create({
    userId,
    username,
    email,
    parentId,
    deptName
  })
  ctx.body = setResponse([])
})
module.exports = router
