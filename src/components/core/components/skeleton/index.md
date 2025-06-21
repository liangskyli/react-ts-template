# Skeleton 骨架屏

在内容加载完成前，用于显示页面结构的占位符组件。

## 属性

| 属性          | 说明               | 类型                                    | 默认值           |
|-------------|------------------|---------------------------------------|---------------|
| `animation` | 是否显示动画           | `boolean`                             | `true`        |
| `className` | 自定义 CSS 类名       | `string`                              | -             |


## Skeleton.circular 骨架屏
- 属性 同Skeleton

## Skeleton.Paragraph 骨架屏

### 属性

| 属性              | 说明         | 类型        | 默认值    |
|-----------------|------------|-----------|--------|
| `animation`     | 是否显示动画     | `boolean` | `true` |
| `className`     | 自定义 CSS 类名 | `string`  | -      |
| `lineCount`     | 段落行数       | `number`  | `3`    |
| `lineClassName` | 每行的类名      | `string`  | -      |


## 示例

### 基础用法

```tsx
import Skeleton from '@/components/core/components/skeleton'

export default () => (
  <div className="space-y-4">
    <Skeleton />
  </div>
)
```

### 不同变体

```tsx
export default () => (
  <div className="space-y-4">
    {/* 矩形骨架屏 */}
    <Skeleton />
    
    {/* 圆形骨架屏 */}
    <Skeleton.circular />
    
    {/* 段落骨架屏 */}
    <Skeleton.Paragraph />
  </div>
)
```

### 不同大小的文本骨架屏

```tsx
export default () => (
  <div className="space-y-2">
    <Skeleton />
    <Skeleton className="h-[24px]" />
    <Skeleton className="h-[80px]" />
  </div>
)
```

### 复杂布局骨架屏

```tsx
export default () => (
  <div className="flex space-x-4">
    {/* 头像 */}
    <Skeleton.circular className="size-[48px]" />

    {/* 内容区域 */}
    <Skeleton.Paragraph className="flex-1" />
  </div>
)
```

### 卡片骨架屏

```tsx
export default () => (
  <div className="space-y-4 rounded-lg border p-4">
    {/* 图片区域 */}
    <Skeleton.circular className="size-[48px]" />

    {/* 标题和描述 */}
    <Skeleton.Paragraph lineClassName="first:w-[80%]" />

    {/* 按钮区域 */}
    <div className="flex space-x-2">
      <Skeleton className="w-[80px] h-[32px]" />
      <Skeleton className="w-[80px] h-[32px]" />
    </div>
  </div>
)
```

### 列表骨架屏

```tsx
export default () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="flex space-x-4">
        <Skeleton.circular className="size-[48px]" />
        <Skeleton.Paragraph className="flex-1" lineCount={2} lineClassName="w-[40%] last:w-[80%]" />
      </div>
    ))}
  </div>
)
```

### 禁用动画

```tsx
export default () => (
  <div className="space-y-4">
    <Skeleton animation={false} />
    <Skeleton.circular
      animation={false}
    />
  </div>
)
```

## 样式定制

骨架屏使用 Tailwind CSS 进行样式设置，支持以下预设样式：

- 默认状态：渐变背景，shimmer 动画（antd-mobile 风格）
- 圆形：圆角为宽度的一半
- 段落：多行矩形，最后一行为 60% 宽度

### 动画效果

组件采用了 antd-mobile 风格的 shimmer 动画效果：
- 使用渐变背景从左到右的光泽扫过效果
- 动画时长为 1.4 秒，使用 ease 缓动函数
- 提供更加流畅和现代的加载体验

可以通过 `className` 属性进行样式覆盖：

```tsx
<Skeleton className="w-[80px] h-[32px]" />
```

## 最佳实践

1. **保持布局一致性**: 骨架屏的尺寸应该与实际内容尺寸保持一致
2. **合理使用动画**: 在性能敏感的场景下可以禁用动画
3. **组合使用**: 通过组合不同变体的骨架屏来模拟复杂的页面结构
4. **响应式设计**: 使用百分比宽度来适应不同屏幕尺寸

## 注意事项

1. 骨架屏应该在内容加载完成后及时移除
2. 避免骨架屏显示时间过长，可能会影响用户体验
