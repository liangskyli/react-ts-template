
# Popover 气泡卡片

用于在元素周围弹出气泡式的浮层，可以展示更多内容。

## 代码演示

### 基础用法

```tsx
import Popover from '@/components/core/components/popover';
import Button from '@/components/core/components/button';

export default () => (
  <Popover content="这是一个简单的气泡内容">
    <Button>点击查看</Button>
  </Popover>
);
```



### 不同位置

```tsx
import Popover from '@/components/core/components/popover';
import Button from '@/components/core/components/button';

export default () => (
  <div className="space-x-4">
    <Popover content="顶部气泡" placement="top">
      <Button>上</Button>
    </Popover>
    <Popover content="底部气泡" placement="bottom">
      <Button>下</Button>
    </Popover>
    <Popover content="左侧气泡" placement="left">
      <Button>左</Button>
    </Popover>
    <Popover content="右侧气泡" placement="right">
      <Button>右</Button>
    </Popover>
  </div>
);
```


### 自定义内容

```tsx
import Popover from '@/components/core/components/popover';
import Button from '@/components/core/components/button';

export default () => (
  <Popover
    content={
      <div className="w-[200px]">
        <h3 className="mb-2 font-medium">标题</h3>
        <p className="text-gray-600">这是一个自定义内容的气泡卡片，支持任意 React 元素。</p>
      </div>
    }
  >
    <Button>自定义内容</Button>
  </Popover>
);
```


### 受控关闭

```tsx
import Popover from '@/components/core/components/popover';
import Button from '@/components/core/components/button';

export default () => (
  <Popover
    content={(setOpen) => (
      <div className="w-[200px]">
        <p className="mb-2">这是一个可以通过内部控制关闭的气泡卡片</p>
        <Button onClick={() => setOpen(false)}>点击关闭</Button>
      </div>
    )}
  >
    <Button>点击打开</Button>
  </Popover>
);
```


### 禁用状态

```tsx
import Popover from '@/components/core/components/popover';
import Button from '@/components/core/components/button';

export default () => (
  <Popover content="禁用状态下不会显示" disabled>
    <Button disabled>禁用状态</Button>
  </Popover>
);
```


### 自定义箭头样式

```tsx
import Popover from '@/components/core/components/popover';
import Button from '@/components/core/components/button';

export default () => (
  <Popover
    content="自定义箭头样式"
    contentClassName="bg-black/75 text-white"
    arrow={{
      bgColor: 'rgba(0,0,0,0.75)',
      className: 'custom-arrow',
    }}
  >
    <Button>自定义箭头</Button>
  </Popover>
);
```


## API

### Popover Props

| 属性                    | 说明                                                                                                           | 类型                                                                                                                                                                   | 默认值                                                 |
|-----------------------|--------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------|
| `children`            | 触发 Popover 的元素                                                                                               | `ReactNode`                                                                                                                                                          | -                                                   |
| `content`             | 弹出内容                                                                                                         | `ReactNode \| ((setOpen: React.Dispatch<React.SetStateAction<boolean>>) => ReactNode)`                                                                               | -                                                   |
| `placement`           | 气泡框位置                                                                                                        | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'top'`                                             |
| `defaultVisible`      | 默认是否显示                                                                                                       | `boolean`                                                                                                                                                            | `false`                                             |
| `disabled`            | 是否禁用                                                                                                         | `boolean`                                                                                                                                                            | `false`                                             |
| `maskClickable`       | 是否允许背景点击                                                                                                     | `boolean`                                                                                                                                                            | `true`                                              |
| `closeOnOutsideClick` | 点击外部是否关闭                                                                                                     | `boolean`                                                                                                                                                            | `true`                                              |
| `className`           | 触发元素容器类名 或 语义化的类名                                                                                            | `string \| SemanticClassNames`                                                                                                                                       | -                                                   |
| `bubbleClassName`     | 气泡框类名                                                                                                        | `string`                                                                                                                                                             | -                                                   |
| `contentClassName`    | 气泡框内容类名                                                                                                      | `string`                                                                                                                                                             | -                                                   |
| `offset`              | 气泡框偏移量                                                                                                       | `OffsetOptions`                                                                                                                                                      | `2`                                                 |
| `arrow`               | 箭头配置                                                                                                         | `{ className?: string; bgColor?: string }`                                                                                                                           | -                                                   |
| `getContainer`        | 指定挂载的节点                                                                                                      | `HTMLElement \| (() => HTMLElement) \| null`                                                                                                                         | `document.body`                                     |
| `disableBodyScroll`   | 是否禁用 body 滚动                                                                                                 | `boolean`                                                                                                                                                            | `false`                                             |
| `shiftOptions`        | 配置组件在视口范围内的位置调整行为。<br/>`mainAxis`: 是否允许在主轴上调整位置<br/>`crossAxis`: 是否允许在交叉轴上调整位置<br/>`padding`: 与视口边缘的最小距离（像素） | `{ mainAxis?: boolean; crossAxis?: boolean; padding?: number }`                                                                                                      | `{ padding: 4, mainAxis: false, crossAxis: false }` |

### SemanticClassNames Props

| 属性        | 说明        | 类型       | 默认值 |
|-----------|-----------|----------|-----|
| `root`    | 触发元素容器类名  | `string` | -   |
| `bubble`  | 气泡框类名     | `string` | -   |
| `content` | 气泡框内容类名   | `string` | -   |
| `arrow`   | 气泡框箭头类名   | `string` | -   |
## 样式定制

Popover 组件使用 Tailwind CSS 进行样式设置，支持以下样式定制：

- `className`: 触发元素容器样式
- `bubbleClassName`: 气泡框外层容器样式
- `contentClassName`: 气泡框内容区域样式
- `arrow.className`: 箭头样式

默认样式特点：
- 气泡框：圆角、白色背景、阴影效果
- 箭头：与气泡框颜色一致，位置自动调整
- 动画：平滑的显示/隐藏过渡效果

## 无障碍

该组件已考虑以下无障碍性设计：
- 点击外部区域可关闭（可配置）
