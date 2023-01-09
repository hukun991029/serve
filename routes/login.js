const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const User = require('../model/user')
const bcrypt = require('bcryptjs')
const setResponse = require('../utils/response.js')
router.post('/login', async ctx => {
  const { userName, passWord } = ctx.request.query
  const user = await User.findOne({ userName }, { passWord: 0 })
  if (!user) {
    ctx.body = setResponse([], 422)
  } else {
    if (bcrypt.compare(user.passWord, passWord)) {
      const token = jwt.sign({ userName: user.userName }, 'shhhhh', {
        expiresIn: '7d'
      })
      ctx.body = setResponse(
        {
          token,
          userInfo: user
        },
        200
      )
    }
  }

  // const flag = bcrypt.compare(password, hash)

  // console.log(userName)
})
module.exports = router
