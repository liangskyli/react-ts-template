# Steps 步骤条

> 引导用户按照流程完成任务的导航条，采用类似antd-mobile的设计风格。

## 特性

- 🎯 **默认小圆点图标** - 类似antd-mobile的设计风格，使用小圆点作为默认图标
- 🔗 **完整连接线** - 水平和垂直方向都有完整的连接线显示
- 🎨 **状态指示** - 支持等待、进行中、完成、错误四种状态
- 🖱️ **可点击切换** - 支持点击步骤进行切换
- 🎨 **高度可定制** - 支持自定义图标、样式类名等
- 📱 **响应式设计** - 支持水平和垂直两种布局方向

## 何时使用

- 当任务复杂或者存在先后关系时，将其分解成一系列步骤，从而简化任务
- 需要显示当前进度和剩余步骤时
- 引导用户完成多步骤流程时

## API

### Steps

| 属性                             | 说明                  | 类型                           | 默认值            |
|--------------------------------|---------------------|------------------------------|----------------|
| `items`                        | 步骤数据                | `StepItem[]`                 | `[]`           |
| `current`                      | 当前步骤，从 0 开始         | `number`                     | `0`            |
| `direction`                    | 步骤条方向               | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `clickable`                    | 是否可点击切换步骤           | `boolean`                    | `false`        |
| `onChange`                     | 点击步骤时的回调            | `(current: number) => void`  | -              |
| `className`                    | 自定义容器 CSS 类名        | `string`                     | -              |
| `itemClassName`                | 自定义步骤项 CSS 类名       | `string`                     | -              |
| `itemInnerClassName`           | 自定义步骤项内部容器 CSS 类名   | `string`                     | -              |
| `indicatorContainerClassName`  | 自定义图标和连接线容器 CSS 类名  | `string`                     | -              |
| `horizontalLeftLineClassName`  | 自定义水平方向左侧连接线 CSS 类名 | `string`                     | -              |
| `horizontalRightLineClassName` | 自定义水平方向右侧连接线 CSS 类名 | `string`                     | -              |
| `verticalLineClassName`        | 自定义垂直方向连接线 CSS 类名   | `string`                     | -              |
| `iconClassName`                | 自定义图标 CSS 类名        | `string`                     | -              |
| `contentClassName`             | 自定义内容区域 CSS 类名      | `string`                     | -              |
| `titleClassName`               | 自定义标题 CSS 类名        | `string`                     | -              |
| `descriptionClassName`         | 自定义描述 CSS 类名        | `string`                     | -              |

### StepItem

| 属性            | 说明                          | 类型                                           | 默认值     |
|---------------|-----------------------------|----------------------------------------------|---------|
| `title`       | 步骤标题                        | `ReactNode`                                  | -       |
| `description` | 步骤描述                        | `ReactNode`                                  | -       |
| `status`      | 步骤状态，如果不设置，会根据 current 自动推断 | `'wait' \| 'process' \| 'finish' \| 'error'` | -       |
| `icon`        | 自定义图标                       | `ReactNode`                                  | -       |
| `disabled`    | 是否禁用点击                      | `boolean`                                    | `false` |

## 示例

### 基础用法

最简单的步骤条，使用默认的小圆点图标，类似antd-mobile设计风格。

```tsx
import Steps from '@/components/core/components/steps'

const items = [
  {
    title: '填写信息',
    description: '请填写基本信息',
  },
  {
    title: '确认信息',
    description: '请确认填写的信息',
  },
  {
    title: '完成',
    description: '信息提交成功',
  },
];

export default () => (
  <Steps items={items} current={1} />
)
```

### 垂直步骤条

```tsx
const items = [
  {
    title: '开始',
    description: '这是第一步的描述信息',
  },
  {
    title: '进行中',
    description: '这是第二步的描述信息',
  },
  {
    title: '结束',
    description: '这是最后一步的描述信息',
  },
];

export default () => (
  <Steps 
    items={items} 
    current={1} 
    direction="vertical" 
  />
)
```

### 可点击的步骤条

```tsx
import { useState } from 'react';

export default () => {
  const [current, setCurrent] = useState(0);
  
  const items = [
    {
      title: '步骤一',
      description: '这是步骤一的描述',
    },
    {
      title: '步骤二',
      description: '这是步骤二的描述',
    },
    {
      title: '步骤三',
      description: '这是步骤三的描述',
    },
  ];

  return (
    <Steps 
      items={items} 
      current={current}
      clickable
      onChange={setCurrent}
    />
  );
};
```

### 自定义状态

```tsx
const items = [
  {
    title: '成功步骤',
    description: '这一步已完成',
    status: 'finish',
  },
  {
    title: '当前步骤',
    description: '正在进行中',
    status: 'process',
  },
  {
    title: '错误步骤',
    description: '这一步出现了错误',
    status: 'error',
  },
  {
    title: '等待步骤',
    description: '等待执行',
    status: 'wait',
  },
];

export default () => (
  <Steps items={items} />
)
```

### 自定义图标

可以通过设置 `icon` 来自定义步骤图标，覆盖默认的小圆点。

```tsx
const items = [
  {
    title: '登录',
    description: '用户登录',
    icon: '🔐',
  },
  {
    title: '验证',
    description: '身份验证',
    icon: '✅',
  },
  {
    title: '完成',
    description: '操作完成',
    icon: '🎉',
  },
];

export default () => (
  <Steps items={items} current={1} />
)
```

### 禁用某些步骤

```tsx
const items = [
  {
    title: '步骤一',
    description: '可以点击',
  },
  {
    title: '步骤二',
    description: '当前步骤',
  },
  {
    title: '步骤三',
    description: '禁用状态',
    disabled: true,
  },
];

export default () => (
  <Steps 
    items={items} 
    current={1}
    clickable
    onChange={(current) => console.log('切换到步骤:', current)}
  />
)
```

## 样式定制

Steps 使用 Tailwind CSS 进行样式设置，支持以下状态样式：

- `wait`: 等待状态 - 灰色小圆点
- `process`: 进行中状态 - 蓝色小圆点
- `finish`: 完成状态 - 蓝色小圆点
- `error`: 错误状态 - 红色小圆点

### 基础样式定制

可以通过 `className` 属性进行容器样式覆盖：

```tsx
<Steps
  items={items}
  current={1}
  className="bg-gray-50 p-4 rounded-lg"
/>
```

### 高级样式定制

组件提供了丰富的样式定制选项：

```tsx
<Steps
  items={items}
  current={1}
  itemClassName="custom-step-item"
  iconClassName="custom-icon"
  contentClassName="custom-content"
  titleClassName="custom-title"
  descriptionClassName="custom-description"
  horizontalLeftLineClassName="custom-left-line"
  horizontalRightLineClassName="custom-right-line"
/>
```

## 设计特色

### antd-mobile风格
- 默认使用小圆点图标，简洁美观
- 连接线设计完整，视觉连贯性好
- 状态颜色搭配合理，用户体验佳

### 布局特点
- **水平布局**: 图标和连接线在同一行，内容在下方
- **垂直布局**: 图标在左侧，连接线垂直延伸，内容在右侧
- **响应式**: 自动适配不同屏幕尺寸

## 最佳实践

1. **步骤数量**: 建议步骤数量控制在 3-7 个之间，过多会增加用户认知负担
2. **标题简洁**: 步骤标题应该简洁明了，能够清楚表达当前步骤的目的
3. **描述信息**: 适当添加描述信息帮助用户理解每个步骤的具体内容
4. **状态反馈**: 及时更新步骤状态，给用户明确的进度反馈
5. **错误处理**: 当某个步骤出现错误时，应该明确标识并提供解决方案
6. **图标一致性**: 自定义图标时，保持尺寸和风格的一致性

## 注意事项

1. 在垂直模式下，建议为容器设置合适的高度
2. 自定义图标时，建议保持图标尺寸一致性
3. 点击切换功能需要配合 `onChange` 回调使用
4. 禁用状态的步骤不会触发点击事件
5. 连接线颜色会根据步骤状态自动变化
