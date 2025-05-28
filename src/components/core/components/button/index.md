# Button 按钮

基础按钮组件，支持多种样式变体和状态。

## 属性

| 属性          | 说明               | 类型                                                | 默认值         |
|-------------|------------------|---------------------------------------------------|-------------|
| `variant`   | 按钮样式变体           | `'primary' \| 'secondary' \| 'danger' \| 'ghost'` | `'primary'` |
| `loading`   | 加载状态             | `boolean`                                         | `false`     |
| `loadingIcon` | 自定义加载图标         | `ReactNode`                                       | `<LoadingSpinner />` |
| `disabled`  | 禁用状态             | `boolean`                                         | `false`     |
| `block`     | 是否为块级按钮（宽度100%）  | `boolean`                                         | `false`     |
| `className` | 自定义 CSS 类名       | `string`                                          | -           |
| `as`        | 渲染为其他 HTML 元素或组件 | `ElementType`                                     | `'button'`  |
| `children`  | 按钮内容             | `ReactNode`                                       | -           |

此外，组件还支持所有原生 button 元素的属性（如 `onClick`、`type` 等）。

## 示例

### 基础用法

```tsx
import Button from '@/components/core/components/button'

export default () => (
  <Button>默认按钮</Button>
)
```

### 不同样式变体

```tsx
export default () => (
  <>
    <Button variant="primary">主要按钮</Button>
    <Button variant="secondary">次要按钮</Button>
    <Button variant="danger">危险按钮</Button>
    <Button variant="ghost">幽灵按钮</Button>
  </>
)
```

### 加载状态

```tsx
export default () => (
  <>
    <Button loading>加载中</Button>
    <Button loading loadingIcon={<CustomSpinner />}>自定义加载图标</Button>
  </>
)
```

### 禁用状态

```tsx
export default () => (
  <Button disabled>禁用按钮</Button>
)
```

### 块级按钮

```tsx
export default () => (
  <Button block>块级按钮</Button>
)
```

### 自定义元素

```tsx
export default () => (
  <Button as="a" href="/home">链接按钮</Button>
)
```

## 样式定制

按钮使用 Tailwind CSS 进行样式设置，支持以下预设样式：

- `primary`: 蓝色背景，白色文字
- `secondary`: 浅蓝色背景，蓝色文字
- `danger`: 红色背景，白色文字
- `ghost`: 白色背景，灰色边框

可以通过 `className` 属性进行样式覆盖：

```tsx
<Button className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400">
  自定义样式按钮
</Button>
```

## 无障碍

- 在加载状态下会自动禁用按钮，防止重复点击
- 支持键盘操作
- 使用 HeadlessUI 的 Button 组件作为基础，确保良好的无障碍性支持

## 注意事项

1. 当使用 `as` 属性渲染为其他元素时（如 `<a>`），确保提供适当的属性（如 `href`）
2. `loading` 状态会自动禁用按钮，无需额外设置 `disabled`
3. 自定义样式时建议保持与默认样式的一致性，特别是在交互状态（hover、active 等）下的表现