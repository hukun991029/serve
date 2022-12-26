const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
router.get('/login', async (ctx, next) => {
  const { userName, passWord } = ctx.request.query
})
module.exports = router
