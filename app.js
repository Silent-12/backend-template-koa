require('dotenv').config();
const Koa = require('koa2')
const router = require('./router/index')
const cors = require("@koa/cors")
const koaStatic = require("koa-static")
const { koaBody } = require("koa-body")
const path = require("path")
const app = new Koa()
const port = process.env.PORT || 3000


/*
    router.route():启动路由
    router.allowedMethods():允许任何请求
    ctx.params           路由
    ctx.request.query    GET
    ctx.request.body     POST
*/

// 统一错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      code: ctx.status,
      msg: err.message || 'Internal Server Error',
      data: null
    };
    console.error(`[${new Date().toISOString()}] Error:`, err);
  }
});

// 静态资源服务
let opts = {
  maxage: 2592000000, // 静态资源30天缓存
}
app.use(koaStatic(path.join(__dirname, "/public"), opts));

// 跨域配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// 请求体解析
app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.resolve(__dirname, "./public/upload"), // 使用绝对路径
      keepExtensions: true,
    }
  })
)

// 请求日志
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`[${new Date().toISOString()}] ${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`);
})

// 启动服务
app.use(router.routes(), router.allowedMethods())
app.listen(port, () => {
  console.log('server http://127.0.0.1:' + port);
})