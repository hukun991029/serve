const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('koa2-cors');
const jwt = require('jsonwebtoken');
const loginRouter = require('./routes/login');
const userRouter = require('./routes/user');
const deptRouter = require('./routes/dept');
const roleRouter = require('./routes/role');
const uploadRouter = require('./routes/upload');

require('./model/connect.js');
const { setResponse } = require('./utils/util');
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
app.use(require('koa-static')(__dirname + '/upload'));
app.use(
  views(__dirname + '/views', {
    extension: 'pug'
  })
);
// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(async (ctx, next) => {
  console.log(ctx.path);
  if (ctx.path === '/login' || ctx.path === 'upload/*') {
    await next();
  } else {
    console.log(ctx.header);
    if (!ctx.header.authorization) {
      ctx.body = setResponse([], 401);
    } else {
      const token = ctx.header.authorization.split(' ')[1];
      try {
        const { id } = jwt.verify(token, 'secret');
        ctx.state.id = id;
        console.log(ctx.state.id);
        await next();
      } catch (error) {
        ctx.body = setResponse([], 401, 'token过期');
      }
    }
  }
});

app.use(function (ctx, next) {
  return next().catch(err => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = setResponse([], 401);
    } else {
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

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
