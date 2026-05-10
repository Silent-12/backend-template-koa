import dayjs from 'dayjs'
import md5Module from 'js-md5'
import { dbQuery } from './db'
import type { ResponseBody, TokenCheckResult } from '../types/index.d'

// js-md5 可能导出为不同的方式，这里处理兼容性
const md5 = typeof md5Module === 'function' ? md5Module : (md5Module as any).default || (md5Module as any).md5

/**
 * @Description: 检查文件类型是否在白名单
 * @param {*} fileType
 */
export function checkFileType(fileType: string): boolean {
  const FileTypeArr = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png']
  return FileTypeArr.includes(fileType)
}

/**
 * @Description:  log统一打印
 * @param {*} api_url
 * @param {*} user_id
 * @param {*} error
 */
export function logError(api_url: string = 'undefined', user_id: string = 'undefined', error: string = ''): void {
  const Time = dayjs().format('YYYY-MM-DD HH:mm:ss')
  console.log(`[${Time}] ` + ' 接口: => ' + api_url + ' id: => ' + user_id + ' info: =>> ' + error)
}

/**
 * @description:  统一返回结构
 * @param {number} code 返回的code码
 * @param {string} msg 返回的信息
 * @param {any} data 返回的数据
 * @return {*}
 */
export function bakcBody(code: number = 200, msg: string = '查询成功', data: any = ''): ResponseBody {
  return {
    code,
    msg,
    data,
  }
}

/**
 * @Description: 使用MD5随机生成Token
 * @param {*} id
 * @param {*} value
 */
export function createToken(id: string | number, value: string | number): string {
  const secretKey = 'xw#$K*'
  return md5(id + secretKey + value + '')
}

/**
 * @Description: 校验token是否有效 并返回一个对象,userid,pwd,istrue,role
 * @param {*} token
 */
export async function isToken(token: string): Promise<TokenCheckResult> {
  if (!token) {
    return {
      istrue: false,
    }
  }

  try {
    // 查询token是否存在
    const sql = `SELECT id, password, role FROM user WHERE token = ?`
    const res: any[] = await dbQuery(sql, [token])

    // token存在,继续返回其他信息
    if (res.length === 1) {
      return {
        istrue: true,
        id: res[0].id,
        password: res[0].password,
        role: res[0].role,
      }
    } else {
      return {
        istrue: false,
      }
    }
  } catch (err) {
    console.error('Token verification error:', err)
    return {
      istrue: false,
    }
  }
}
