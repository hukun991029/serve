const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const koajwt = require('koa-jwt');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const loginRouter = require('./routes/login');
const userRouter = require('./routes/user');
const deptRouter = require('./routes/dept');
const roleRouter = require('./routes/role');
const uploadRouter = require('./routes/upload');
const menuRouter = require('./routes/menu');
const cors = require('koa2-cors');
const { setResponse } = require('./utils/util');
const log4j = require('./utils/log4j');
require('./model/connect.js');
// error handler
onerror(app);
// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
);
app.use(cors());
app.use(json());
app.use(logger());

app.use(require('koa-static')(__dirname + '/public'));

app.use(
  views(__dirname + '/views', {
    extension: 'pug'
  })
);

// logger
app.use(async (ctx, next) => {
  log4j.setContent('info', `get: ${JSON.stringify(ctx.request.query)}`);
  log4j.setContent('info', `params: ${JSON.stringify(ctx.request.body)}`);
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
// app.use(
//   koajwt({
//     secret: 'secret',
//     getToken: async (ctx, next) => {
//       const authHeader = ctx.headers.authorization
//       console.log(authHeader && authHeader.split(' ')[0] === 'Bearer')
//       if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
//         await next()
//       } else {
//         ctx.body = setResponse([], 401)
//       }
//     }
//   }).unless({ path: whiteList })
// )
const whiteList = ['/login', '/upload'];
app.use(async (ctx, next) => {
  if (!ctx.header.authorization) {
    if (whiteList.includes(ctx.url)) {
      await next();
    } else {
      ctx.body = setResponse([], 401);
    }
  } else {
    await next();
  }
});
app.use((ctx, next) => {
  return next().catch(err => {
    if (401 == err.status) {
      ctx.status = 401;
    } else {
      ctx.body = setResponse([], 500);
      throw err;
    }
  });
});
// routes
app.use(loginRouter.routes(), loginRouter.allowedMethods());
app.use(userRouter.routes(), userRouter.allowedMethods());
app.use(deptRouter.routes(), deptRouter.allowedMethods());
app.use(roleRouter.routes(), roleRouter.allowedMethods());
app.use(uploadRouter.routes(), uploadRouter.allowedMethods());
app.use(menuRouter.routes(), menuRouter.allowedMethods());
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
