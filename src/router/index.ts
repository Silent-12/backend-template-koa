import Router from 'koa-router';
import upload from './upload';
import wechatH5Reporting from './wechatH5Reporting';

const router = new Router();

// 接口前缀,部署在服务器上时进行拦截转发
const prefix = process.env.API_PREFIX || '/api';

// 注册接口
router.use(`${prefix}/upload`, upload.routes(), upload.allowedMethods());
router.use(`${prefix}/wechatH5Reporting`, wechatH5Reporting.routes(), wechatH5Reporting.allowedMethods());

export default router;
