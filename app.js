const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const login = require('./routes/login')
const cors = require('koa2-cors')
require('./model/connect.js')
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

// app.use(async (ctx, next) => {
//   next()
//   // const start = new Date()
//   // await next()
//   // const ms = new Date() - start
//   // console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })
app.use(function (ctx, next) {
  return next().catch(err => {
    if (401 == err.status) {
      ctx.status = 401
      ctx.body = 'UnAuthorization'
    } else {
      throw err
    }
  })
})
// routes
app.use(login.routes(), login.allowedMethods())
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
