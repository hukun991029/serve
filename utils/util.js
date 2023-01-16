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

const getTreeList = async (list, id = [], target = []) => {
  list.forEach(item => {
    if (item.parentId?.length) {
      const parentId = item.parentId[item.parentId.length - 1]
      if (String(parentId) === String(id)) {
        target.push(item._doc)
      }
    } else {
      if (String(item.parentId) === String(id)) {
        target.push(item._doc)
      }
    }
  })
  target.forEach(item => {
    item.children = item.children || []
    getTreeList(list, item._id, item.children)
    if (!item.children.length) {
      delete item.children
    }
  })
  return target
}
module.exports = {
  setResponse,
  getTreeList
}
