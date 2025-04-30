# Switch 开关

开关组件，用于表示两种状态之间的切换。

## 代码演示

### 基础用法

```tsx
import { Switch } from '@/components';

export default () => (
  <Switch />
);
```

### 默认选中

```tsx
import { Switch } from '@/components';

export default () => (
  <Switch defaultChecked />
);
```

### 受控组件

```tsx
import { useState } from 'react';
import { Switch } from '@/components';

export default () => {
  const [checked, setChecked] = useState(false);
  
  return (
    <>
      <Switch checked={checked} onChange={setChecked} />
      <div>当前状态: {checked ? '开' : '关'}</div>
    </>
  );
};
```

### 禁用状态

```tsx
import { Switch } from '@/components';

export default () => (
  <>
    <Switch disabled />
    <Switch disabled defaultChecked />
  </>
);
```

### 加载状态

```tsx
import { Switch } from '@/components';

export default () => (
  <>
    <Switch loading />
    <Switch loading defaultChecked />
  </>
);
```

### 带文字描述

```tsx
import { Switch } from '@/components';

export default () => (
  <Switch>开启飞行模式</Switch>
);
```

### 开关内文字

```tsx
import { Switch } from '@/components';

export default () => (
  <Switch checkedText="开" uncheckedText="关" />
);
```

### 自定义样式

```tsx
import { Switch } from '@/components';

export default () => (
  <Switch
    trackClassName="data-[checked]:bg-green-600 data-[checked]:border-green-600"
    thumbClassName="data-[checked]:bg-white"
  />
);
```

## API

### 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `checked` | 指定当前是否选中 | `boolean` | - |
| `defaultChecked` | 初始是否选中 | `boolean` | `false` |
| `onChange` | 变化时的回调函数 | `(checked: boolean) => void` | - |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `loading` | 加载中状态 | `boolean` | `false` |
| `className` | 自定义类名 | `string` | - |
| `trackClassName` | 开关轨道类名 | `string` | - |
| `thumbClassName` | 开关滑块类名 | `string` | - |
| `children` | 开关右侧的内容 | `ReactNode` | - |
| `checkedText` | 选中时的文本 | `ReactNode` | - |
| `uncheckedText` | 非选中时的文本 | `ReactNode` | - |
| `checkedTextClassName` | 选中时的文本类名 | `string` | - |
| `uncheckedTextClassName` | 非选中时的文本类名 | `string` | - |

此外，组件还支持所有原生 button 元素的属性（如 `id`、`aria-*` 等）。

## 样式定制

Switch 使用 Tailwind CSS 进行样式设置，支持以下预设样式：

- 默认状态：灰色背景
- 选中状态：蓝色背景
- 禁用状态：降低透明度，不可点击
- 加载状态：滑块中显示加载图标

可以通过以下类名属性进行样式定制：
- `className`: 容器样式
- `trackClassName`: 开关轨道样式
- `thumbClassName`: 开关滑块样式
- `checkedTextClassName`: 选中时文本样式
- `uncheckedTextClassName`: 非选中时文本样式

## 无障碍

- 使用 Headless UI 的 Switch 组件作为基础，确保良好的无障碍性支持
- 支持键盘操作（Tab 键聚焦，空格键切换状态）
- 使用 `role="switch"` 标识组件角色
- 使用 `aria-checked` 标识选中状态
- 使用 `aria-disabled` 标识禁用状态