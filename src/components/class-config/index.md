# 组件样式配置

> 组件库提供了灵活的 Tailwind CSS 样式配置能力，可以通过以下方法自定义组件样式。

## API 说明

### getComponentClassConfig

获取指定组件的样式配置。

```ts
const getComponentClassConfig = (componentName: ComponentName) => ClassConfig
```


参数：
- `componentName`: 组件名称，支持的值包括所有在 `defaultConfig` 中定义的组件名

### updateClassConfig

更新全局组件样式配置。

```ts
const updateClassConfig = (config: typeof defaultConfig) => void
```


参数：
- `config`: 新的样式配置对象，需要包含所有组件的样式定义

### twConfig

预定义的 Tailwind CSS 配置，包含了主题色、层级等基础样式配置。

## 使用示例

### 获取组件样式
```ts
import { getComponentClassConfig } from '@/utils/styles';

// 获取 Button 组件的样式配置
const buttonClasses = getComponentClassConfig('button');
```


### 自定义组件样式
```ts
import { updateClassConfig } from '@/utils/styles';

// 更新全局样式配置，结构见defaultConfig声明
updateClassConfig({
  // 所有组件配置...
});
```


### 配置示例

```ts
// 默认配置示例，见defaultConfig声明
const defaultConfig = {
  // .所有组件配置...
};
```

## Tailwind 主题配置

组件库使用了以下自定义主题配置：

### 颜色
- `mask`: rgba(0, 0, 0, 0.7) (遮罩层)

### 层级
- `z-popup`: 1000
- `z-mask`: 1000
- `z-toast`: 5000