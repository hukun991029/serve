const defaultMessage = {
  200: '操作成功',
  400: '请求参数错误', // 参数错误
  422: '账号或密码错误', // 用户账号或密码错误
  401: 'token校验失败', // 用户未登录
  500: '其他错误' // 其他错误
}
const setResponse = (data, code = 200, message) => {
  return {
    data,
    code,
    msg: message || defaultMessage[code]
  }
}
const find = (model, query, option, callback) => {
  const res = model.find(query)
  for (const key in option) {
    res[key](option[key])
  }
  res.exec(callback)
}
module.exports = {
  setResponse,
  find
}
