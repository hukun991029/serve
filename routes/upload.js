const router = require('koa-router')()
const User = require('../model/user')
const path = require('path')
const fs = require('fs')
const { setResponse } = require('../utils/util')
const { koaBody } = require('koa-body')
router.prefix('/upload')
router.post(
  '/avatar/:userId',
  koaBody({
    multipart: true, //解析多个文件
    formidable: {
      maxFileSize: 10 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
      keepExtensions: true
    }
  }),
  async ctx => {
    const { userId } = ctx.params
    const file = ctx.request.files.file
    const newFileName = userId + '_' + file.originalFilename
    const filePath = path.join(__dirname, '../public/uploads/') + newFileName
    await fs.copyFileSync(file.filepath, filePath)
    await User.findOneAndUpdate({ userId }, { avatarUrl: `http://localhost:3000/uploads/${newFileName}` })
    ctx.body = setResponse(
      {
        src: `http://localhost:3000/uploads/${newFileName}`
      },
      200
    )
  }
)
module.exports = router
