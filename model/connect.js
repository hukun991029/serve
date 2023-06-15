const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose
  .connect('mongodb://127.0.0.1:27017/service')
  .then(res => {
    console.log('connect success');
  })
  .catch(err => {
    console.log('connect error', err);
  });
require('./user');
require('./userCount');
require('./dept');
require('./role');
require('./menu');
