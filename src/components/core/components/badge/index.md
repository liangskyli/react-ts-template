# Badge 徽标

> 用于显示状态、标签或数量的小型标识组件。

## 何时使用

- 需要显示状态信息时
- 作为标签标记内容类型
- 显示数量或计数
- 需要突出显示某些信息时
- 在右上角展示数字、文字、小红点。

## API

| 属性        | 说明         | 类型                                                          | 默认值       |
|-----------|------------|-------------------------------------------------------------|-----------|
| `variant` | 徽标变体       | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'default'` |
| `size`    | 徽标尺寸       | `'small' \| 'medium' \| 'large'`                           | `'medium'` |
| `dot`     | 是否为圆点模式    | `boolean`                                                   | `false`   |
| `children` | 徽标内容      | `ReactNode`                                                 | -         |
| `className` | 自定义 CSS 类名 | `string`                                                    | -         |

## 示例

### 基础用法

```tsx
import Badge from '@/components/core/components/badge'

export default () => (
  <div className="space-x-2">
    <Badge>默认</Badge>
    <Badge variant="primary">主要</Badge>
    <Badge variant="success">成功</Badge>
  </div>
)
```

### 不同变体

```tsx
export default () => (
  <div className="space-x-2">
    <Badge variant="default">默认</Badge>
    <Badge variant="primary">主要</Badge>
    <Badge variant="secondary">次要</Badge>
    <Badge variant="success">成功</Badge>
    <Badge variant="warning">警告</Badge>
    <Badge variant="danger">危险</Badge>
  </div>
)
```

### 不同尺寸

```tsx
export default () => (
  <div className="space-x-2 flex items-center">
    <Badge size="small">小号</Badge>
    <Badge size="medium">中号</Badge>
    <Badge size="large">大号</Badge>
  </div>
)
```

### 圆点模式

```tsx
export default () => (
  <div className="space-x-4 flex items-center">
    <div className="flex items-center space-x-1">
      <Badge dot variant="success" />
      <span>在线</span>
    </div>
    <div className="flex items-center space-x-1">
      <Badge dot variant="danger" />
      <span>离线</span>
    </div>
    <div className="flex items-center space-x-1">
      <Badge dot variant="warning" />
      <span>忙碌</span>
    </div>
  </div>
)
```

### 数字徽标

```tsx
export default () => (
  <div className="space-x-4">
    <div className="relative inline-block">
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        消息
      </button>
      <Badge 
        variant="danger" 
        size="small"
        className="absolute -top-2 -right-2"
      >
        99+
      </Badge>
    </div>
    <div className="relative inline-block">
      <button className="bg-gray-500 text-white px-4 py-2 rounded">
        通知
      </button>
      <Badge 
        dot 
        variant="danger"
        className="absolute -top-1 -right-1"
      />
    </div>
  </div>
)
```

### 自定义样式

```tsx
export default () => (
  <div className="space-x-2">
    <Badge className="bg-purple-100 text-purple-800">
      自定义颜色
    </Badge>
    <Badge className="border border-blue-300 bg-transparent text-blue-600">
      边框样式
    </Badge>
  </div>
)
```

## 样式定制

徽标使用 Tailwind CSS 进行样式设置，支持以下预设样式：

- `default`: 灰色背景，深灰色文字
- `primary`: 蓝色背景，深蓝色文字
- `secondary`: 浅灰色背景，灰色文字
- `success`: 绿色背景，深绿色文字
- `warning`: 黄色背景，深黄色文字
- `danger`: 红色背景，深红色文字

可以通过 `className` 属性进行样式覆盖：

```tsx
<Badge className="bg-gradient-to-r from-purple-400 to-pink-400 text-white">
  渐变徽标
</Badge>
```

## 最佳实践

1. **语义化使用**: 根据内容的重要性和类型选择合适的变体
2. **尺寸一致性**: 在同一界面中保持徽标尺寸的一致性
3. **圆点模式**: 用于状态指示时优先使用圆点模式
4. **数量显示**: 当数量超过99时，建议显示为"99+"
5. **对比度**: 确保徽标与背景有足够的对比度

## 注意事项

1. 圆点模式下不会显示 `children` 内容
2. 圆点模式下 `size` 属性不生效，始终为固定尺寸
3. 建议在数字徽标中使用简短的文本或数字
4. 自定义样式时注意保持良好的可读性
