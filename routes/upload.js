const router = require('koa-router')();
const fs = require('fs');
const path = require('path');
const { setResponse } = require('../utils/util');
const mime = require('mime');
const User = require('../model/user');
const { koaBody } = require('koa-body');
router.get('/upload/:id', ctx => {
  console.log(ctx.params.id);
  const { path: filePath } = ctx.query;
  const type = mime.getType(filePath);
  const file = fs.readFileSync(path.join(__dirname, `../upload/${filePath}`));
  ctx.set('content-type', type);
  ctx.body = file;
});

router.post(
  '/upload/image',
  koaBody({
    multipart: true,
    encoding: 'gzip',
    formidable: {
      uploadDir: path.join(__dirname, '../upload'),
      maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
      keepExtensions: true, // 保留文件扩展名
      onFileBegin: (name, file) => {
        name = file.originalFilename;
      }
    }
  }),
  async ctx => {
    const file = ctx.request.files.avatar;
    const filePath = ctx.origin + '' + file.path.replace('public', '');
    await User.findOneAndUpdate({ _id: ctx.state.id }, { avatar: filePath });
    ctx.body = setResponse({ path: filePath }, 200);
  }
);
module.exports = router;
