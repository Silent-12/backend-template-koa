# Backend 服务端

基于 Koa2 + MySQL 的后端服务，提供用户管理和文件上传功能。

## 技术栈

- **框架**: Koa2
- **数据库**: MySQL
- **主要中间件**: @koa/cors, koa-body, koa-static, koa-router

## 项目结构

```
backend/
├── app.js              # 应用入口
├── router/             # 路由模块
│   ├── index.js        # 路由配置
│   ├── user.js         # 用户相关接口
│   └── upload.js       # 文件上传接口
├── utils/              # 工具模块
│   ├── db.js           # 数据库连接池封装
│   └── tool.js         # 通用工具函数
├── public/             # 静态资源目录
│   └── upload/         # 上传文件存储目录
├── .env                # 环境变量配置
├── .env.example        # 环境变量示例
└── package.json       # 项目配置
```

## 环境配置

项目根目录下的 `.env` 文件（需从 `.env.example` 复制创建）：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123456
DB_NAME=demo

# 服务器配置
PORT=3000
API_PREFIX=/api

# 上传服务配置
UPLOAD_BASE_URL=http://127.0.0.1:3000

# 跨域配置
CORS_ORIGIN=*
```

## API 接口

### 用户接口 `/api/user`

| 方法 | 路径            | 描述         | 权限   |
| ---- | --------------- | ------------ | ------ |
| GET  | `/all`          | 查询所有用户 | 管理员 |
| POST | `/changeStatus` | 更新用户状态 | 管理员 |

**请求示例：**

```bash
# 查询所有用户
curl -X GET http://127.0.0.1:3000/api/user/all \
  -H "token: your_token"

# 更新用户状态
curl -X POST http://127.0.0.1:3000/api/user/changeStatus \
  -H "Content-Type: application/json" \
  -H "token: your_token" \
  -d '{"name": "username", "accountStatus": "1"}'
```

### 文件上传接口 `/api/upload`

| 方法 | 路径 | 描述     | 权限       |
| ---- | ---- | -------- | ---------- |
| POST | `/`  | 上传文件 | 已验证用户 |

**请求示例：**

```bash
curl -X POST http://127.0.0.1:3000/api/upload \
  -H "token: your_token" \
  -F "file=@/path/to/file.jpg"
```

**响应格式：**

```json
{
  "code": 200,
  "msg": "上传成功",
  "data": "http://127.0.0.1:3000/upload/filename.jpg"
}
```

## 响应格式

所有接口统一响应格式：

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": []
}
```

| 字段 | 类型   | 说明                           |
| ---- | ------ | ------------------------------ |
| code | number | 状态码，200 为成功，其他为失败 |
| msg  | string | 操作结果描述                   |
| data | any    | 返回数据                       |

## 启动服务

```bash
# 安装依赖（已在根目录执行 npm install）
npm install

# 开发环境启动
node app.js

# 或使用 run.bat（Windows）
run.bat
```

服务启动后访问：`http://127.0.0.1:3000`

## 数据库表结构

```sql
-- 用户表
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `accountStatus` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
```

## 注意事项

1. 文件上传需要携带有效的 `token` 验证
2. 上传文件类型需在白名单范围内（由 `checkFileType` 函数控制）
3. 数据库连接使用连接池管理，支持事务操作
4. 所有 SQL 查询使用参数化查询，防止 SQL 注入
5. 生产环境请修改 `CORS_ORIGIN` 为具体域名
