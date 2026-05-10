# 项目规范（ESLint / Prettier / Commit / Git Hooks）

本文档基于当前仓库已落地配置整理，适用于日常开发与跨项目迁移。

## 1. 前置条件

- Node.js: 建议 `>=18`（当前项目使用 `18.19.1`）。
- 包管理器: `npm`。

### 1.1 安装以下插件

- `ESLint`（微软官方）
- `Prettier - Code formatter`
- `Vue (Official)`（Vue2/Vue3 通用，避免与 Vetur 同时启用）

> 注意：不要同时启用 `Vue (Official)` 和 `Vetur`，会导致诊断与格式化冲突。

## 2. 代码规范与格式化

### 2.1 ESLint

- 配置文件：`.eslintrc.js`
- 忽略文件：`.eslintignore`
- 执行命令：
  - `npm run lint`：检查代码（当前策略允许 warning，不允许 error）
  - `npm run lint:fix`：自动修复可修复问题

当前已包含：

- TypeScript 规则（`@typescript-eslint/*`）
- Vue 单文件支持（`vue-eslint-parser` + `eslint-plugin-vue`）
- UniApp 常见全局变量（`uni` / `wx` / `plus` / `getApp` / `getCurrentPages`）
- Vue 规则采用通用策略（`plugin:vue/base`），不依赖目录命名

### 2.2 Prettier

- 配置文件：`.prettierrc`
- 忽略文件：`.prettierignore`
- 执行命令：
  - `npm run format`：仅检查格式
  - `npm run format:write`：自动格式化并写回文件

## 3. Git 提交规范

### 3.1 Commit Message 规则

- 使用 Conventional Commits。
- 配置文件：`commitlint.config.js`
- 允许的 `type`：
  - `feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、`build`、`ci`、`chore`、`revert`
- 其他约束：
  - `type` 不能为空
  - `subject` 不能为空
  - 提交标题最大长度 `100`

示例：

- `feat(auth): add login api`
- `fix(report): handle null payload`
- `docs(readme): update usage`

### 3.2 提交前自动校验（Git Hooks）

已通过 Husky 落地：

- `.husky/pre-commit`
  - 先执行：`npm run lint`
  - 再执行：`npm run format:write`
  - 最后自动 `git add backend/src sdk/src`
- `.husky/commit-msg`
  - 执行：`commitlint --edit "$1"`
  - 不符合提交规范将阻止提交

## 5. 迁移到其他项目清单（仅迁移配置文件）

你当前约束是：**只迁移以下 5 个文件，不迁移** **`package.json`**。

- `.eslintrc.js`
- `.eslintignore`
- `.prettierrc`
- `.prettierignore`
- `commitlint.config.js`

### 4.1 必装依赖（精确版本）

> 即使不迁移 `package.json`，目标项目也必须安装这些依赖，否则配置会报错或不生效。

```bash
npm i -D eslint@8.57.1 @typescript-eslint/parser@7.18.0 @typescript-eslint/eslint-plugin@7.18.0 eslint-config-prettier@10.1.8 eslint-plugin-react-hooks@7.0.1 eslint-plugin-vue@9.33.0 vue-eslint-parser@9.4.3 prettier@3.6.2 @commitlint/cli@19.8.1 @commitlint/config-conventional@19.8.1 husky@9.1.7
```

### 4.2 不迁移 `package.json` 时的执行命令

不依赖 npm scripts，直接执行：

```bash
npx eslint "src/**/*.{ts,tsx,js,jsx,vue}" --no-error-on-unmatched-pattern
npx prettier --check "src/**/*.{ts,tsx,js,jsx,vue,json,md}"
npx prettier --write "src/**/*.{ts,tsx,js,jsx,vue,json,md}"
```

### 4.3 Git Hooks（手动创建）

由于不迁移 `package.json`，需要手动初始化并创建 hooks：

```bash
npx husky init
```

然后创建（或覆盖）：

- `.husky/pre-commit`
  - `npx eslint "src/**/*.{ts,tsx,js,jsx,vue}" --no-error-on-unmatched-pattern`
  - `npx prettier --write "src/**/*.{ts,tsx,js,jsx,vue,json,md}"`
  - `git add .`
- `.husky/commit-msg`
  - `npx commitlint --edit "$1"`

### 4.4 手动迁移核对清单

按以下顺序执行即可（无需 AI 参与）：

1. 复制 5 个配置文件到目标项目根目录。
2. 安装 5.1 中的全部依赖（精确版本）。
3. 执行 `npx husky init` 初始化 hooks。
4. 创建 `.husky/pre-commit`（先 eslint，再 prettier --write，最后 `git add .`）。
5. 创建 `.husky/commit-msg`（`npx commitlint --edit "$1"`）。
6. 执行以下命令确认生效：

```bash
npx eslint "src/**/*.{ts,tsx,js,jsx,vue}" --no-error-on-unmatched-pattern
npx prettier --check "src/**/*.{ts,tsx,js,jsx,vue,json,md}"
```

<br />

