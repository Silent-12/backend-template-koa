import 'dotenv/config'
import mysql from 'mysql2/promise'

const dataBaseConfig = {
  // 数据库连接配置 - 支持环境变量覆盖
  host: process.env.DB_HOST, // 数据库主机地址
  port: parseInt(process.env.DB_PORT || '3306'), // 数据库端口号
  user: process.env.DB_USER, // 数据库用户名
  password: process.env.DB_PASSWORD, // 数据库密码
  database: process.env.DB_NAME, // 数据库名称

  // 字符集配置
  charset: 'utf8mb4',

  // 连接池配置 - 控制并发连接数
  connectionLimit: 10, // 连接池最大连接数
  waitForConnections: true, // 连接数满时是否等待
  queueLimit: 0, // 等待队列长度限制，0表示无限制

  // 连接超时配置
  connectTimeout: 10000, // 建立连接的超时时间（毫秒）

  // 空闲连接配置
  idleTimeout: 60000, // 空闲连接超时时间（毫秒）
  maxIdle: 10, // 最大空闲连接数

  // 连接保活配置
  enableKeepAlive: true, // 启用TCP连接保活
  keepAliveInitialDelay: 10000, // 保活探测延迟（毫秒）
}
const pool = mysql.createPool(dataBaseConfig)

/**
 * mysql 增删改查
 * @param {String} sql 需要执行的sql语句
 * @param {Array} params 参数数组，用于防止SQL注入
 * @param {Number} timeout 查询超时时间（毫秒），默认 30000
 */
export async function dbQuery(sql: string, params: any[] = [], timeout: number = 30000): Promise<any> {
  const connection = await pool.getConnection()
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let isTimedOut = false

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      isTimedOut = true
      connection.destroy() // 强制关闭连接，取消正在执行的查询
      reject(new Error('Query timeout'))
    }, timeout)
  })

  try {
    const queryPromise = connection.query(sql, params)
    const [result] = (await Promise.race([queryPromise, timeoutPromise])) as any
    if (timeoutId) clearTimeout(timeoutId)
    return result
  } catch (err) {
    if (timeoutId) clearTimeout(timeoutId)
    if (isTimedOut) {
      throw err // 已经处理过超时错误
    }
    throw err
  } finally {
    if (!isTimedOut) {
      connection.release() // 只有未超时才释放连接，超时已销毁连接
    }
  }
}

/**
 * 事务执行
 * @param {Array} queries 查询数组，每项包含 sql 和 params
 * @param {Number} timeout 单次查询超时时间（毫秒），默认 30000
 */
export async function dbTransaction(queries: Array<{ sql: string; params?: any[] }>, timeout: number = 30000): Promise<any[]> {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    const results: any[] = []
    for (const { sql, params = [] } of queries) {
      const [result] = await queryWithTimeout(connection, sql, params, timeout)
      results.push(result)
    }

    await connection.commit()
    return results
  } catch (err) {
    await connection.rollback()
    throw err
  } finally {
    connection.release()
  }
}

/**
 * 带超时的查询执行
 * @param {Object} connection 数据库连接
 * @param {String} sql SQL语句
 * @param {Array} params 参数数组
 * @param {Number} timeout 超时时间
 */
async function queryWithTimeout(connection: mysql.PoolConnection, sql: string, params: any[], timeout: number): Promise<[any]> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let isTimedOut = false

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      isTimedOut = true
      connection.destroy()
      reject(new Error('Query timeout'))
    }, timeout)
  })

  try {
    const queryPromise = connection.query(sql, params)
    const result = (await Promise.race([queryPromise, timeoutPromise])) as any
    if (timeoutId) clearTimeout(timeoutId)
    return result
  } catch (err) {
    if (timeoutId) clearTimeout(timeoutId)
    throw err
  } finally {
    // noop - 连接由调用方管理
  }
}

// 优雅关闭 - 进程退出时自动关闭连接池
process.on('SIGINT', () => pool.end().then(() => process.exit(0)))
process.on('SIGTERM', () => pool.end().then(() => process.exit(0)))
