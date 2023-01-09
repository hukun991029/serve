const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const User = require('../model/user')
const bcrypt = require('bcryptjs')
const { setResponse } = require('../utils/util.js')
router.post('/login', async ctx => {
  const { username, password } = ctx.request.body
  const user = await User.findOne({ username })
  if (!user) {
    ctx.body = setResponse([], 422)
  } else {
    const isValid = bcrypt.compareSync(password, user.password)
    if (isValid) {
      const token = jwt.sign({ username: user.username }, 'secret', {
        expiresIn: '7d'
      })
      ctx.body = setResponse(
        {
          token,
          userInfo: user
        },
        200
      )
    } else {
      ctx.body = setResponse([], 422)
    }
  }
})
module.exports = router
