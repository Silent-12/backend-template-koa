import Router from 'koa-router'
import type { Context } from 'koa'
import { dbQuery } from '../utils/db'
import { logError, bakcBody, checkFileType } from '../utils/tool'
import type { UploadFile } from '../types/upload.d'
const upload = new Router()

/*
    文件上传
*/
upload.post('/', async (ctx: Context) => {
  try {
    const token = ctx.header.token as string
    if (!token) {
      ctx.body = bakcBody(201, 'token not', [])
      return
    }

    // 使用参数化查询
    const sql = `SELECT COUNT(*) as count FROM user WHERE token = ?`
    const temp: any[] = await dbQuery(sql, [token])

    if (!temp.length || temp[0].count !== 1) {
      ctx.body = bakcBody(201, 'token异常', [])
      return
    }

    const file = (ctx.request as any).files?.file as UploadFile | undefined
    if (!file) {
      ctx.body = bakcBody(201, 'No file uploaded', [])
      return
    }

    const { newFilename: filename, mimetype: fileType } = file

    if (checkFileType(fileType)) {
      // 可以通过环境变量配置域名
      const baseUrl = process.env.UPLOAD_BASE_URL || 'http://127.0.0.1:3000'
      ctx.body = bakcBody(200, '上传成功', `${baseUrl}/upload/${filename}`)
    } else {
      logError(ctx.url, token, '文件疑似手动上传')
      ctx.body = bakcBody(201, '上传失败,不在白名单', [])
    }
  } catch (error) {
    console.error('🍅   error:', error)
    ctx.body = bakcBody(201, '上传异常', [])
  }
})

export default upload
