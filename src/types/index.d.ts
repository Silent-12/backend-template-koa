/**
 * @description 定义后端接口统一响应体结构。
 */
export interface ResponseBody {
  // 状态码，200 为成功，其他为失败
  code: number;
  // 操作结果描述
  msg: string;
  // 返回数据
  data: any;
}

/**
 * @description 定义 Token 验证结果结构。
 */
export interface TokenCheckResult {
  // Token 是否有效
  istrue: boolean;
  // 可选的用户 ID
  id?: number;
  // 可选的用户密码
  password?: string;
  // 可选的用户角色
  role?: number;
}
