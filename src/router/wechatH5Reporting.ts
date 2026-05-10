import Router from 'koa-router'
import { Context } from 'koa'
import { bakcBody } from '../utils/tool'
const wechatH5Reporting = new Router()

/**
 * GET
 */
wechatH5Reporting.get('/report.gif', async (ctx: Context) => {
  ctx.body = bakcBody(200, '请求成功', [])
})

/**
 * POST
 */
wechatH5Reporting.post('/report', async (ctx: Context) => {
  ctx.body = bakcBody(200, '请求成功', [])
})

export default wechatH5Reporting
