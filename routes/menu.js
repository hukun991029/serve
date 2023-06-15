const router = require('koa-router')()
const Menu = require('../model/menu')
const { setResponse, getTreeList } = require('../utils/util')
router.prefix('/menu')
router.get('/list', async ctx => {
  const docs = await Menu.find()
  const result = await getTreeList(docs)
  ctx.body = setResponse({
    rows: result
  })
})
router.post('/addAndEdit', async ctx => {
  const { action, componentPath, parentId, routePath, menuType, menuIcon, permissionMaker, menuName, menuStatus } = ctx.request.body
  if (action === 'add') {
    await Menu.create({ componentPath, parentId, routePath, menuType, menuIcon, permissionMaker, menuName, menuStatus })
    ctx.body = setResponse([], 200)
  } else {
  }
})
router.get('/tree', async ctx => {
  const menuInfo = await Menu.find()
  const result = await getTreeList(menuInfo)
  ctx.body = setResponse(result)
})

router.delete('/del', async ctx => {})
module.exports = router
