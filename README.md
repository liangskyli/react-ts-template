## 简介
- 在现代前端开发中，我们常常需要快速搭建一个 React 项目。而 `create-react-app` 脚手架也已经很久不维护了，为了解决这一需求，**React-Ts-Template** 应运而生！这是一个基于最新的 **React 19、TypeScript 和 Vite 6** 打造的项目模板，旨在帮助你极速启动项目，节省大量重复的配置时间。同时，模板集成了各种开发规范和流行插件，开箱即用，让你专注于业务逻辑的实现！

## 功能配备

- **路由懒加载**：封装实现了路由懒加载，提升页面切换性能，减少初始加载时间。（详见`router`）
- **全局状态管理**：提供了 Zustand 全局状态管理示例代码，简化跨组件状态共享，提升开发效率。（详见`store`）
- **Axios 请求封装**：对 Axios 进行封装，统一处理 HTTP 请求和响应，简化与后端接口的交互流程。（详见`services`）
- **工具函数、hooks**：提供了一些方便实用的工具函数和hooks。（详见`utils`、`hooks`）
- **import顺序自动美化排序**：集成了 prettier-plugin-sort-imports 插件，可以自动美化 import 顺序，提高代码的可读性和可维护性。
- **mock服务**：提供http，socket接口的mock服务功能，mock数据场景化手动编写。支持mock数据更改时热更新获取新数据。
- **其他**：提供一些方便根据环境运行、打包的命令；配置了分包策略等等。
- **单元测试**：基于vitest提供单元测试的案例。

## 技术栈一览

### 🛠 技术栈选型

- **React 19 & React-DOM**：使用最新版 React 实现前端高性能和更流畅的用户体验。
- **React-Router**：最新v7版本，支持路由懒加载，优化页面切换性能。
- **Less 预编译**：使用xxx.module.less，支持CSS Modules）。
- **SCSS 预编译**：全面采用新版 SCSS，使用 `@use` 替代 `@import`，模块化更强。
- **zustand**：轻量级的状态管理库。通过对比 Redux、Dva、React-Toolkit、MobX，以及 `useContext` 结合 `useReducer` 的管理方式，最终选择了更简单的 Zustand。
- **Immer**：简化不可变数据结构操作，尤其在多层次嵌套对象中处理更方便。
- **optics-ts**：适用于需要对大型嵌套对象进行深度操作，且希望代码类型安全、易读的场景。
- **classnames**：动态类名管理工具，特别适合条件渲染样式。
- **[@liangskyli/axios-request](https://github.com/liangskyli/request/blob/main/packages/axios-request/README.md)**：封装 HTTP 请求库，更方便与后端接口对接。
- **[@liangskyli/mock](https://github.com/liangskyli/mock#readme)**：支持接口数据本地mock，支持数据场景化和热更新。
- **单元测试**：基于vitest实现代码的单元测试。

### 🔧 其他推荐工具

- **[接口开发提效工具](https://github.com/liangskyli/mock/blob/master/packages/http-mock-gen/README.md)**：基于openapi v3 生成 ts数据类型和http mock 数据代码。

## 项目规范与配置

为确保团队合作时的代码一致性和规范性，**React-Ts-Template** 引入了一整套项目规范：

- **全面使用 ESM 规范**：采用模块化导入，符合现代 JavaScript 的发展趋势。
- **包管理器强制使用 pnpm**：提高依赖安装速度，减少磁盘空间占用，解决幽灵依赖问题。
- **样式 BEM 命名规范**：结构清晰，减少样式冲突，提升代码可维护性（如果采用CSS Modules，需要使用xxx.module.less）。
- **文件与文件夹命名**：统一使用 `kebab-case`，这种最可靠，尤其是在版本控制共享代码时，不同操作系统对大小写的敏感性不同。

### 💡 高效的代码规范管理

除了代码结构的规范化，项目还集成了多种代码质量检查工具，确保开发体验与代码质量：

- **ESLint**：代码风格和错误检查，已升级到最新版，弃用 `.eslintignore`，改用 `ignores` 配置项。
- **Prettier**：统一代码格式，避免团队协作中因格式问题产生的冲突。
- **Stylelint**：针对样式的 Lint 工具，确保 Css,Less,SCSS 代码的一致性。
- **Commitlint** + **Husky** + **Lint-Staged**：配合 Git Hooks 实现代码提交规范化，避免低质量代码入库。
- **EditorConfig**：编辑器的统一配置，减少因编辑器差异产生的问题。

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
├── README.md
├── stylelint.config.js # Stylelint 配置文件，用于样式文件的风格和错误检查
├── tsconfig.json # TypeScript 配置文件
├── vite.config.ts # Vite 配置文件，用于定义 Vite 项目的构建和服务选项
├── vitest.config.ts # 单元测试配置文件
└── vitest.setup.ts # 单元测试环境初始化配置
```

## 总结

**React-Ts-Template** 项目模板的目标是通过预设的最佳实践配置，减少开发者在项目初始化时的琐碎配置步骤，让你可以更快上手项目开发。同时，配备了成熟的开发工具链和强大的插件支持，以确保团队开发的一致性和代码的高质量。如果你正在寻找一款高效的 React 项目模板，不妨试试 **React-Ts-Template**！

**👉 赶快 Star 项目，开启你的 React 项目之旅！**

> [React-Ts-Template](https://github.com/liangskyli/react-ts-template)


## 注意
> 1.本项目使用了19版本的相关特性，如需要降级到18版本，需要更改19版本新特性的替换方案，并使用如下命令降级到18版本。  
> - RouterTitle组件和页面动态设置里<title>标签使用react-helmet替换
```bash
pnpm install react@18.3.1 react-dom@18.3.1
```

## 支持环境："node": "^18.20.0 || ^20.0.0 || >=22.0.0"

## 本地mock服务启动
```bash
$ pnpm i
$ pnpm dev:mock
# 新开一个命令窗口启动mock服务
$ pnpm dev:mock-server
```

## 非本地mock服务启动
```bash
$ pnpm i
$ pnpm dev
```

## 项目编译
```bash
pnpm build:pro
```