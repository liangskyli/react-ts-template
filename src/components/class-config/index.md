# 组件样式配置

> 组件库提供了灵活的 Tailwind CSS 样式配置能力，可以通过以下方法自定义组件样式。
>

## API 说明
### `getComponentClassConfig`
获取指定组件的样式配置。
**类型定义：**
``` typescript
const getComponentClassConfig = (componentName: ComponentName) => ClassConfig
```
**参数：**
- `componentName`: 组件名称，支持的值包括所有在 `defaultConfig` 中定义的组件名

### `updateClassConfig`
更新全局组件样式配置。
**类型定义：**
``` typescript
const updateClassConfig = (config: typeof defaultConfig) => void
```
**参数：**
- `config`: 新的样式配置对象，需要包含所有组件的样式定义

### `updateTwMergeFunction`
自定义 Tailwind 类名合并函数。
**类型定义：**
``` typescript
const updateTwMergeFunction = (twMergeFunction: (className: string) => string) => void
```
**参数：**
- `twMergeFunction`: 自定义的类名合并函数

### `defaultTwMerge`
默认的 Tailwind 类名合并函数。
**类型定义：**
``` typescript
const defaultTwMerge = (className: string) => string
```
**参数：**
- `className`: 需要合并的类名字符串

### `cn`
用于合并多个类名的工具函数，支持条件类名。
**类型定义：**
``` typescript
const cn = (...inputs: ClassValue[]) => string
```
**参数：**
- `inputs`: 任意数量的类名值，可以是字符串、对象或数组

### `cx`
class-variance-authority 提供的类名合并函数，用于处理条件样式。
**引入方式：**
``` typescript
import { cx } from 'class-variance-authority'
```
### `twConfig`
预定义的 Tailwind CSS 配置，包含了主题色、层级等基础样式配置。
## 使用示例
### 获取组件样式
``` typescript
import { getComponentClassConfig } from '@/components/class-config';

// 获取 Button 组件的样式配置
const buttonClasses = getComponentClassConfig('button');
```
### 自定义组件样式
``` typescript
import { updateClassConfig } from '@/components/class-config';

// 更新全局样式配置，结构见defaultConfig声明
updateClassConfig({
  // 所有组件配置...
});
```
### 使用 cn 合并类名
``` typescript
import { cn } from '@/components/class-config';

// 基础用法
const className = cn('base-class', 'additional-class');

// 条件类名
const className = cn('base-class', {
  'active-class': isActive,
  'disabled-class': isDisabled
});
```
### 自定义类名合并函数
``` typescript
import { updateTwMergeFunction } from '@/components/class-config';

// 使用自定义的合并函数
updateTwMergeFunction((className) => {
  // 自定义合并逻辑
  return className;
});
```
### 配置示例
``` typescript
// 默认配置示例，见defaultConfig声明
const defaultConfig = {
  // 所有组件配置...
};
```
