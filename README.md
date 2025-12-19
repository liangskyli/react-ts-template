# React-Ts-Template

<p align="center">
  <img src="public/vite.svg" alt="React-Ts-Template Logo" width="200"/>
</p>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-%2361DAFB?logo=react" alt="React Version"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-%23007ACC?logo=typescript" alt="TypeScript Version"></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-7-%23646CFF?logo=vite" alt="Vite Version"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node-%3E%3D20.19.0-brightgreen?logo=node.js" alt="Node Version"></a>
  <a href="https://github.com/liangskyli/react-ts-template/blob/main/LICENSE"><img src="https://img.shields.io/github/license/liangskyli/react-ts-template" alt="License"></a>
</p>

## 📖 简介

一个现代化的 React 项目模板，基于 **React 19 + TypeScript + Vite** 构建。告别繁琐的项目初始化配置，让你专注于业务开发。

### 为什么选择 React-Ts-Template？

- 🚀 基于最新稳定版 React 19，享受更好的性能和新特性
- 📦 开箱即用的工程化配置
- 🔧 完善的开发工具链和代码规范
- 🎯 TypeScript 保驾护航，代码更可靠
- 🎨 支持 Less 和 CSS Modules
- 📱 响应式设计支持
- ⚡️ Vite 驱动，开发体验一流

## 🎯 主要特性

### 核心功能
- ✨ 路由懒加载 - 优化首屏加载时间
- 🔄 状态管理 (Zustand) - 简单高效的状态管理方案
- 📡 HTTP 请求封装 - 基于 Axios 的统一请求处理
- 🎭 Mock 服务 - 支持接口数据模拟，提供场景化的数据管理


### 开发体验
- 📝 ESLint + Prettier + Stylelint - 代码质量保证
- 🔍 TypeScript 类型检查
- 🎨 自动格式化 import 语句顺序
- 🧪 Vitest 单元测试支持


## 🚀 快速开始

### 环境要求
- Node.js: ^20.19.0 || >=22.12.0
- 包管理器: pnpm

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
# 标准开发模式
pnpm dev

# 带 Mock 数据的开发模式
pnpm dev:mock
pnpm dev:mock-server  # 新开终端运行 mock 服务

# 基于openapi生成 Mock 数据和接口数据
pnpm mock-gen

```

### 生产构建
```bash
pnpm build:pro
```

## 🔧 环境配置

项目支持多环境配置：
- `.env` - 基础配置
- `.env.dev` - 开发环境
- `.env.pro` - 生产环境
- `.env.test` - 测试环境
- `.env.dev-mock` - Mock 开发环境

## 📚 技术栈

### 🛠 技术栈选型

- **React 19 & React-DOM**：使用最新版 React 实现前端高性能和更流畅的用户体验。
- **React-Router**：最新v7版本，支持路由懒加载，优化页面切换性能。
- **[tailwindcss](https://v3.tailwindcss.com/)**：使用tailwindcss@3版本，兼容性好。
- **[Headless UI](https://headlessui.com/)**：无样式的UI组件库，完全可定制且完美配合Tailwind CSS。
- **Less 预编译**：使用xxx.module.less，支持CSS Modules）。---请优先使用Tailwind，Less作为备选方案
- **[zustand](https://github.com/pmndrs/zustand)**：轻量级的状态管理库。通过对比 Redux、Dva、React-Toolkit、MobX，以及 `useContext` 结合 `useReducer` 的管理方式，最终选择了更简单的 Zustand。
- **Immer**：简化不可变数据结构操作，尤其在多层次嵌套对象中处理更方便。
- **[optics-ts](https://github.com/akheron/optics-ts)**：适用于需要对大型嵌套对象进行深度操作，且希望代码类型安全、易读的场景。
- **classnames**：动态类名管理工具，特别适合条件渲染样式。
- **[react-hook-form](https://github.com/react-hook-form/react-hook-form)**：form表单管理和验证。
- **[@liangskyli/axios-request](https://github.com/liangskyli/request/blob/main/packages/axios-request/README.md)**：封装 HTTP 请求库，更方便与后端接口对接。
- **[@liangskyli/mock](https://github.com/liangskyli/mock#readme)**：支持接口数据本地mock，支持数据场景化和热更新。
- **[@liangskyli/http-mock-gen](https://github.com/liangskyli/mock/blob/master/packages/http-mock-gen/README.md)**：基于openapi v3 生成 ts数据类型和http mock 数据代码。
- **单元测试**：基于vitest实现代码的单元测试。

### 核心依赖
- React 19
- React Router v7
- TypeScript
- Vite
- Tailwind CSS v3
- Headless UI
- Zustand (状态管理)
- Axios (HTTP 请求)
- react-hook-form

### 工具链
- ESLint
- Prettier
- Stylelint
- Husky
- Commitlint
- Vitest

### 🔧 其他推荐工具
- **[接口开发提效工具](https://github.com/liangskyli/mock/blob/master/packages/http-mock-gen/README.md)**：基于openapi v3 生成 ts数据类型和http mock 数据代码。

## 📝 开发规范

### 代码风格
- 文件/文件夹命名：`kebab-case`
- 样式命名：BEM 规范
- 组件命名：PascalCase
- TypeScript 优先

### Git 提交规范
使用 Conventional Commits 规范，例如：
- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`

## 项目结构

```tree
├── .husky # Husky 配置文件夹，用于管理 Git 钩子
│   └── commit-msg # 检查提交钩子配置
│   └── pre-commit # 格式化钩子配置
├── __test__ # 单元测试文件目录
├── mock # 接口mock数据
├── public # 静态资源目录，用于存放不经过 Vite 处理的静态资源
├── src # 源代码目录
│ ├── assets # 静态资源文件，如图片、字体等
│ ├── components # 公共组件目录
│ ├── hooks # 自定义 React Hooks
│ │ └── use-router # 路由操作 Hook
│ │ └── ...
│ ├── icons # svg 图标
│ ├── layouts # 页面布局组件
│ ├── pages # 页面组件
│ ├── router # 路由配置
│ │ └── modules # 页面路由配置项
│ │ └── utils # 路由相关工具函数
│ │ └── index.tsx # 路由入口
│ ├── services # API 服务封装
│ ├── store # 状态管理
│ │ └── modules # 状态管理模块
│ │ └── index.ts # 状态入口
│ ├── styles # 样式
│ ├── types # TypeScript 类型定义
│ └── utils # 工具函数
├── .browserslistrc # browserslist 配置文件，用于 浏览器兼容性
├── .commitlintrc.js # Commitlint 配置文件，用于 Git 提交信息的风格检查
├── .editorconfig # 编辑器配置文件，用于统一不同编辑器的代码风格
├── .env # 基础环境配置文件
├── .env.dev # 开发环境配置文件
├── .env.dev-mock # mock开发环境配置文件
├── .env.pro # 生产环境配置文件
├── .env.test # 测试环境配置文件
├── .gitignore # git忽略文件
├── .npmrc # npm配置文件
├── .prettierignore # 代码风格配置忽略文件
├── .prettierrc.js # Prettier 配置文件，用于代码格式化
├── .stylelintignore # 样式风格配置忽略文件
├── eslint.config.js # ESLint 配置文件，用于代码风格和错误检查
├── index.html # 入口页面
├── lint-staged.config.js # Lint-Staged 配置文件，用于在 Git 提交前自动运行 Linters
├── package.json # 项目依赖配置文件
├── mock.config.ts # mock服务配置文件
├── package.ts # 包配置文件
├── pnpm-lock.yaml # 安装包锁定文件
├── pnpm-workspace.yaml # 工作空间文件
├── postcss.config.js # postcss 配置文件
├── README.md
├── stylelint.config.js # Stylelint 配置文件，用于样式文件的风格和错误检查
├── tailwind.config.js # tailwind 配置文件
├── tsconfig.json # TypeScript 配置文件
├── vite.config.ts # Vite 配置文件，用于定义 Vite 项目的构建和服务选项
├── vitest.config.ts # 单元测试配置文件
└── vitest.setup.ts # 单元测试环境初始化配置
```

## 🔄 降级指南

如需降级到 React 18，请执行：
```bash
pnpm install react@18.3.1 react-dom@18.3.1
```
注意：需要替换 React 19 特有功能
- RouterTitle组件和页面动态设置里title标签使用react-helmet替换


## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request。请确保：
1. Fork 项目并创建特性分支
2. 遵循项目代码规范
3. 提供清晰的提交信息
4. 更新相关文档

## 📄 许可证

[MIT License](LICENSE)

## 🌟 支持项目

如果这个项目对你有帮助，请给它一个 Star ⭐️