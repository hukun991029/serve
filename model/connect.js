const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
mongoose
  .connect('mongodb://127.0.0.1:27017/service')
  .then(res => {
    console.log('链接成功')
  })
  .catch(err => {
    console.log('链接失败', err)
  })
require('./user')
