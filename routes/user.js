const router = require('koa-router')();
const User = require('../model/user');
const Count = require('../model/userCount');
const { setResponse, getTreeList } = require('../utils/util');
const Dept = require('../model/dept');
router.prefix('/user');

router.get('/list', async ctx => {
  const { username, userId, startTime, endTime, pageSize, pageNum } = ctx.request.query;
  const sql = {
    isDelete: 0
  };
  if (username) {
    sql['username'] = { $regex: username };
  }
  if (userId) {
    sql['userId'] = { userId: Number(userId) };
  }
  if (startTime || endTime) {
    sql['createTime'] = { $gte: new Date(startTime), $lte: new Date(endTime) };
  }
  // [
  //   {
  //     $match: sql
  //   },
  //   {
  //     $skip: (pageNum - 1) * pageSize
  //   },
  //   {
  //     $limit: Number(pageSize)
  //   },
  //   {}
  // ];
  const res = await User.aggregate()
    .match(sql)
    .skip((pageNum - 1) * pageSize)
    .limit(Number(pageSize))
    .lookup({
      from: 'depts',
      localField: 'deptId',
      foreignField: '_id',
      as: 'deptInfo'
    })
    .addFields({
      deptName: { $arrayElemAt: ['$deptInfo.deptName', 0] }
    });
  // .facet({
  // deptName: Dept.findOne({ deptId: this.deptId }),
  //   total: [{ $count: 'total' }]
  // })
  ctx.body = setResponse({ rows: res, total: res.length });
});

router.post('/add', async ctx => {
  const params = ctx.request.body;
  params.deptId = params.deptList[params.deptList.length - 1];
  const docs = await User.findOne({
    $or: [{ username: params.username }, { email: params.email }]
  });
  if (docs) {
    ctx.body = setResponse([], 999, `系统监测该用户已存在,用户名称${params.username}或用户邮箱${params.email}重复`);
  } else {
    const counrDocs = await Count.findOneAndUpdate(
      { _id: 'userId' },
      { $inc: { count: 1 } },
      {
        new: true
      }
    );
    await User.create({
      userId: counrDocs.count,
      ...params
    });
    ctx.body = setResponse([], 200);
  }
});

router.post('/update', async ctx => {
  const params = ctx.request.body;
  params.deptId = params.deptList[params.deptList.length - 1];
  await User.findOneAndUpdate({ username: params.username }, { ...params });
  ctx.body = setResponse([], 200);
});

router.get('/del', async ctx => {
  const { userId } = ctx.request.query;
  await User.findOneAndUpdate({ userId }, { isDelete: 1 });
  ctx.body = setResponse([], 200);
});

module.exports = router;
