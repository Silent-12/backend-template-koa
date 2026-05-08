const dayjs = require('dayjs');
const md5 = require('js-md5')
const db = require('../utils/db')

/**
 * @Description: 检查文件类型是否在白名单
 * @param {*} filrType
 */
function checkFileType (filrType) {
  const FileTypeArr = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png']
  return FileTypeArr.includes(filrType)
}

/**
 * @Description:  log统一打印
 * @param {*} api_url
 * @param {*} user_id
 * @param {*} error
 */
function logError (api_url = "undefined", user_id = "undefined", error = "") {
  const Time = dayjs().format('YYYY-MM-DD HH:mm:ss')
  console.log(`[${Time}] ` + " 接口: => " + api_url + " id: => " + user_id + " info: =>> " + error);
}

/**
 * @Description: 约束接口返回结构
 * @param {*} code
 * @param {*} msg
 * @param {*} data
 */
function bakcBody (code = 200, msg = "查询成功", data = "") {
  let info = {
    code,
    msg,
    data
  }
  return info
}

/**
 * @Description: 使用MD5随机生成Token
 * @param {*} id 
 * @param {*} value
 */
function createToken (id, value) {
  const secretKey = "xw#$K*"
  return md5(id + secretKey + value + "")
}

/**
 * @Description: 校验token是否有效 并返回一个对象,userid,pwd,istrue,role
 * @param {*} token
 */
async function isToken (token) {
  if (!token) {
    return {
      istrue: false,
    }
  }

  // 查询token是否存在
  const sql = `SELECT id, password, role FROM user WHERE token = ?`
  const res = await db.query(sql, [token])

  // token存在,继续返回其他信息
  if (res.length === 1) {
    return {
      istrue: true,
      id: res[0].id,
      password: res[0].password,
      role: res[0].role
    }
  } else {
    return {
      istrue: false,
    }
  }
}
module.exports = {
  logError, bakcBody, createToken, isToken, checkFileType
}