const Router = require('koa-router')
const user = new Router()
const db = require('../utils/db')
const { logError, bakcBody, isToken } = require('../utils/tool')

/**
 * 查询所有用户
 */
user.get('/all', async (ctx) => {
  const url = ctx.url;
  const token = ctx.header.token || ""

  try {
    const res = await isToken(token)

    if (!res.istrue && res.role != 1) {
      ctx.body = bakcBody(201, '暂无权限', [])
      return
    }

    const sql_select = `SELECT * FROM user`
    const allUser = await db.query(sql_select)
    ctx.body = bakcBody(200, "查询成功", allUser)

  } catch (error) {
    logError(url, undefined, error)
    ctx.body = bakcBody(201, '查询失败-1', [])
  }
})


/**
 * 更新用户状态
 */
user.post('/changeStatus', async (ctx) => {
  const url = ctx.url;
  const token = ctx.header.token || ""

  try {
    const { name = "", accountStatus = "" } = ctx.request.body
    if (!name || !accountStatus) {
      ctx.body = bakcBody(201, '更新失败-2', [])
      return
    }

    const res = await isToken(token)
    if (!res.istrue || res.role != 1) {
      ctx.body = bakcBody(201, '暂无权限', [])
      return
    }

    // 使用参数化查询
    const sql_update = `UPDATE user SET accountStatus = ? WHERE name = ?`
    await db.query(sql_update, [accountStatus, name])
    ctx.body = bakcBody(200, "更新成功", [])

  } catch (error) {
    logError(url, undefined, error)
    ctx.body = bakcBody(201, '更新失败-1', [])
  }
})


module.exports = user