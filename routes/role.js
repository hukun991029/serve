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
    const { roleName, remark, id } = ctx.request.body;
    if (!id) {
      ctx.body = setResponse([], 400);
      return;
    }
    await Role.findOneAndUpdate({ _id: id }, { roleName, remark });
    ctx.body = setResponse([]);
  } else {
    const { id } = ctx.request.body;
    await Role.findByIdAndUpdate({ _id: id }, { isDelete: 1 });
    ctx.body = setResponse([]);
  }
});

router.get('/list', async ctx => {
  const { roleName } = ctx.request.query;
  let params = { isDelete: 0 };
  if (roleName) {
    params = { ...params, roleName: { $regex: roleName, $options: 'i' } };
  }
  const res = await Role.find(params);
  ctx.body = setResponse({
    row: res,
    total: res.length
  });
});
module.exports = router;
