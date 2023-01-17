const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const loginRouter = require('./routes/login')
const userRouter = require('./routes/user')
const deptRouter = require('./routes/dept')
const roleRouter = require('./routes/role')
const cors = require('koa2-cors')
require('./model/connect.js')
const { setResponse } = require('./utils/util')
// error handler
onerror(app)

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
)
app.use(cors())
app.use(json())
app.use(logger())

app.use(require('koa-static')(__dirname + '/public'))

app.use(
  views(__dirname + '/views', {
    extension: 'pug'
  })
)
// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(async (ctx, next) => {
  if (ctx.path === '/login') {
    await next()
  } else {
    if (!ctx.header.authorization) {
      ctx.body = setResponse([], 401)
    } else {
      await next()
    }
  }
})
app.use(function (ctx, next) {
  return next().catch(err => {
    if (401 == err.status) {
      ctx.status = 401
      ctx.body = setResponse([], 401)
    } else {
      throw err
    }
  })
})
// routes
app.use(loginRouter.routes(), loginRouter.allowedMethods())
app.use(userRouter.routes(), userRouter.allowedMethods())
app.use(deptRouter.routes(), deptRouter.allowedMethods())
app.use(roleRouter.routes(), roleRouter.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
