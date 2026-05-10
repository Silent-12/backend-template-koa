module.exports = {
  // 运行环境：浏览器 + Node + ES2021
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  // UniApp 常见全局对象，避免 no-undef 误报
  globals: {
    uni: 'readonly',
    wx: 'readonly',
    plus: 'readonly',
    getApp: 'readonly',
    getCurrentPages: 'readonly',
  },
  // 使用 TypeScript 解析器
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  // ESLint 内部忽略（与 .eslintignore 互补）
  ignorePatterns: ['.eslintrc.js', 'commitlint.config.js'],
  // 启用的插件
  plugins: ['react-hooks', '@typescript-eslint', 'vue'],
  // 规则预设：基础 + TS + React Hooks + 与 Prettier 协同
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  rules: {
    // 允许保留告警级别的 console（error/warn）
    'no-console': [
      'warn',
      {
        allow: ['error', 'warn'],
      },
    ],
    'no-constant-binary-expression': 'error',
    'object-shorthand': [
      'error',
      'always',
      {
        avoidQuotes: true,
      },
    ],
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
      },
    ],

    // React hooks 依赖必须完整
    'react-hooks/exhaustive-deps': 'error',

    // TypeScript 风格与安全相关规则
    '@typescript-eslint/consistent-generic-constructors': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/consistent-type-exports': [
      'error',
      {
        fixMixedExportsWithInlineTypeSpecifier: true,
      },
    ],
    // 方案 A：高频历史问题先降为 warn，避免阻塞 CI
    '@typescript-eslint/consistent-type-imports': ['warn'],
    '@typescript-eslint/member-ordering': ['warn'],
    '@typescript-eslint/no-redundant-type-constituents': ['warn'],
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/prefer-optional-chain': ['error'],
    // use-before-define 交给 TS 版本规则处理
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
        typedefs: false,
      },
    ],

    // 以下先保持告警，后续可逐步收敛为 error
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/ban-types': 'warn',
  },
  overrides: [
    {
      // 所有 Vue 单文件组件使用专用解析器
      files: ['**/*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      // 通用策略：不区分 Vue2/Vue3，避免目录命名耦合
      extends: ['plugin:vue/base'],
      rules: {
        // 兼容历史项目中的单词组件名
        'vue/multi-word-component-names': 'off',
        // 通用可读性规则（Vue2/Vue3 都适用）
        'vue/no-multiple-template-root': 'off',
        'vue/html-self-closing': 'off',
      },
    },
  ],
}
