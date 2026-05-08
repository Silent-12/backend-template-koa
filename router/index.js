const Router = require('koa-router')
const router = new Router();

const user = require('./user') // 用户接口
const upload = require('./upload') // 上传接口

// 接口前缀,部署在服务器上时进行拦截转发
const prefix = process.env.API_PREFIX || '/api'

// 注册接口
router.use(`${prefix}/user`, user.routes(), user.allowedMethods())
router.use(`${prefix}/upload`, upload.routes(), upload.allowedMethods())

module.exports = router