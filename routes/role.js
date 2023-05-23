const router = require('koa-router')();
const Role = require('../model/role');
const { setResponse } = require('../utils/util');
router.prefix('/role');
router.post('/operate', async ctx => {
  const { action } = ctx.request.body;
  if (action === 'create') {
    const { roleName, remark } = ctx.request.body;
    if (!roleName) {
      ctx.body = setResponse([], 400);
      return;
    }
    await Role.create({
      roleName,
      remark
    });
    ctx.body = setResponse([]);
  } else if (action === 'edit') {
  } else {
    const { id } = ctx.request.body;
    await Role.findByIdAndUpdate({ _id: id }, { isDelete: 1 });
    ctx.body = setResponse([]);
  }
});

router.get('/list', async ctx => {
  const { roleName } = ctx.request.query;
  const res = await Role.find({ roleName: { $regex: roleName, $options: 'i' }, isDelete: 0 });
  ctx.body = setResponse(res);
});
module.exports = router;
