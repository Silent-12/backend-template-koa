import 'dotenv/config'
import type { Context, Next } from 'koa'
import Koa from 'koa'
import cors from '@koa/cors'
import koaStatic from 'koa-static'
import { koaBody } from 'koa-body'
import path from 'path'
import router from './router/index'
import dayjs from 'dayjs'
import { dbQuery } from './utils/db'

const app = new Koa()
const port = parseInt(process.env.PORT || '3000')

/*
    router.route():启动路由
    router.allowedMethods():允许任何请求
    ctx.params           路由
    ctx.request.query    GET
    ctx.request.body     POST
*/

// 统一错误处理中间件
app.use(async (ctx: Context, next: Next) => {
  try {
    await next()
  } catch (err: any) {
    ctx.status = err.status || 500
    ctx.body = {
      code: ctx.status,
      msg: err.message || 'Internal Server Error',
      data: null,
    }
    console.error(`[${new Date().toISOString()}] Error:`, err)
  }
})

// 静态资源服务
const opts = {
  maxage: 2592000000, // 静态资源30天缓存
}
app.use(koaStatic(path.join(__dirname, '../public'), opts) as any)

// 跨域配置
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  }) as any,
)

// 请求体解析
app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.resolve(__dirname, '../public/upload'), // 使用绝对路径
      keepExtensions: true,
    },
  }),
)

// 请求日志
app.use(async (ctx: Context, next: Next) => {
  const start = Date.now()
  const header = ctx.header

  await next()
  const ms = Date.now() - start
  const day = dayjs().format('YYYY-MM-DD HH:mm:ss')
  console.log(`[${day}] ${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`)

  // 异步写日志
  const userIp = header['host'] || '127.0.0.1'
  const userUa = header['user-agent'] || ''
  dbQuery('INSERT INTO request_log (url, method, day, time_consuming, status,create_time,ip,user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
    ctx.url,
    ctx.method,
    day,
    ms,
    ctx.status,
    dayjs().unix(),
    userIp,
    userUa,
  ])
})

// 启动服务
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(port, () => {
  console.log('server http://127.0.0.1:' + port)
})

export default app
