# Input 输入框

基础输入框组件，支持多种输入类型和格式控制。

## 代码演示

### 基础用法

```tsx
import Input from '@/components/core/components/input';

export default () => (
  <Input placeholder="请输入内容" />
);
```

### 受控组件

```tsx
import { useState } from 'react';
import Input from '@/components/core/components/input';

export default () => {
  const [value, setValue] = useState('初始内容');
  
  return (
    <Input 
      value={value} 
      onChange={setValue} 
      placeholder="请输入内容"
    />
  );
};
```

### 不同类型

```tsx
import Input from '@/components/core/components/input';

export default () => (
  <>
    <Input type="text" placeholder="文本输入" />
    <Input type="password" placeholder="密码输入" />
    <Input type="email" placeholder="邮箱输入" />
    <Input type="url" placeholder="URL输入" />
    <Input type="tel" placeholder="电话号码输入" />
  </>
);
```

### 数字输入

```tsx
import Input from '@/components/core/components/input';

export default () => (
  <>
    <Input 
      inputMode="decimal" 
      placeholder="小数输入" 
      decimalPlaces={2}
      min={0}
      max={100}
    />
    <Input 
      inputMode="decimal" 
      placeholder="整数输入" 
      decimalPlaces={0}
    />
  </>
);
```

### 只读和禁用状态

```tsx
import Input from '@/components/core/components/input';

export default () => (
  <>
    <Input 
      value="只读内容" 
      readOnly 
    />
    <Input 
      value="禁用状态" 
      disabled 
    />
  </>
);
```

## API

### 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `value` | 输入框的值 | `string` | - |
| `defaultValue` | 输入框默认值 | `string` | - |
| `type` | 输入框类型 | `'text' \| 'password' \| 'number' \| 'tel' \| 'email' \| 'url'` | `'text'` |
| `className` | 自定义类名 | `string` | - |
| `onChange` | 值变化时的回调函数 | `(value: string) => void` | - |
| `decimalPlaces` | 小数位数，只支持整数值 | `number` | `2` |
| `min` | 最小值，小数位数不大于decimalPlaces位 | `number` | `0` |
| `max` | 最大值，小数位数不大于decimalPlaces位 | `number` | - |
| `readOnly` | 是否只读 | `boolean` | `false` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `maxLength` | 最大输入长度 | `number` | - |
| `inputMode` | 输入模式 | `'none' \| 'text' \| 'decimal' \| 'numeric' \| 'tel' \| 'search' \| 'email' \| 'url'` | - |

此外，组件还支持所有原生 input 元素的属性（如 `placeholder`、`autoFocus` 等）。

## 样式定制

Input 使用 Tailwind CSS 进行样式设置，支持以下预设样式：

- 默认状态：白色背景，灰色边框
- 聚焦状态：蓝色边框，蓝色轮廓
- 只读状态：浅灰色背景
- 禁用状态：灰色背景，降低透明度，不可点击

可以通过 `className` 属性进行样式覆盖：

```tsx
<Input className="border-purple-500 focus:border-purple-700 focus:ring-purple-700" />
```

## 数字输入特性

当 `inputMode="decimal"` 时，组件提供以下特性：

1. 自动过滤非数字和小数点字符
2. 通过 `decimalPlaces` 控制小数位数（设为 0 时只允许整数）
3. 支持 `min` 和 `max` 限制输入范围（失焦时生效）
4. 自动处理前导零和尾随小数点
5. 失焦时自动格式化数值

## 无障碍

- 使用 Headless UI 的 Input 组件作为基础，确保良好的无障碍性支持
- 支持键盘操作
- 适当的 ARIA 属性支持

## 注意事项

1. 当使用 `inputMode="decimal"` 时，组件会自动处理数字格式，但不会改变输入的类型（仍为字符串）
2. 数值范围限制（`min` 和 `max`）仅在失焦时生效
3. 当组件为受控组件时（提供了 `value` 属性），内部状态会跟随外部 `value` 变化