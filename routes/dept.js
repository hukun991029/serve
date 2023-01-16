const router = require('koa-router')()
const User = require('../model/user')
const Dept = require('../model/dept')
const { setResponse, getTreeList } = require('../utils/util.js')
router.prefix('/dept')
router.get('/list', async ctx => {
  const { deptName, pageSize, pageNum } = ctx.request.query
  const res = await Dept.find({ deptName: { $regex: deptName } })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
  const docs = await getTreeList(res)
  ctx.body = setResponse({
    rows: docs,
    total: docs.length
  })
})
router.get('/getAllUser', async ctx => {
  const res = await User.find({}, { username: 1, userId: 1, _id: 0 })
  ctx.body = setResponse(res)
})
router.post('/add', async ctx => {
  const { userId, parentId, deptName } = ctx.request.body
  const { email, username, phone } = await User.findOne({ userId })
  Dept.create({
    userId,
    username,
    email,
    phone,
    parentId,
    deptName
  })
  ctx.body = setResponse([])
})

router.get('/tree', async ctx => {
  const res = await Dept.find()
  const treeList = await getTreeList(res)
  ctx.body = setResponse(treeList)
})
router.post('/update', async ctx => {
  const { _id, parentId, deptName, userId } = ctx.request.body
  const { email, username, phone } = await User.findOne({ userId })
  const updateTime = new Date()
  await Dept.findOneAndUpdate({ _id }, { parentId, deptName, userId, email, phone, username, updateTime })
  await User.findOneAndUpdate({ userId }, { deptList: parentId, deptId: parentId[parentId.length - 1] || '' })
  ctx.body = setResponse([])
})

router.get('/del', async ctx => {
  const { _id } = ctx.request.query
  await Dept.findByIdAndRemove(_id)
  await Dept.deleteMany({ parentId: { $all: [_id] } })
  // await User.findOneAndUpdate({ userId }, { deptList: parentId, deptId: parentId[parentId.length - 1] || '' })
  ctx.body = setResponse([])
})
module.exports = router
