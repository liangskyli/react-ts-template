# Checkbox 复选框

基础复选框组件，支持单独使用和组合使用。

## 代码演示

### 基础用法

```tsx
import { Checkbox } from '@/components/checkbox';

export default () => (
  <Checkbox>复选框</Checkbox>
);
```

### 默认选中

```tsx
<Checkbox defaultChecked>默认选中</Checkbox>
```

### 禁用状态

```tsx
<>
  <Checkbox disabled>禁用</Checkbox>
  <Checkbox disabled checked>选中禁用</Checkbox>
</>
```

### 半选状态

```tsx
<Checkbox indeterminate>半选状态</Checkbox>
```

### 自定义图标

```tsx
<Checkbox 
  checkedIcon={<CustomIcon />}
  indeterminateIcon={<CustomIndeterminateIcon />}
>
  自定义图标
</Checkbox>
```

### 组合使用

```tsx
import { useState } from 'react';

export default () => {
  const [value, setValue] = useState(['1']);
  
  return (
    <Checkbox.Group value={value} onChange={setValue}>
      <Checkbox value="1">选项1</Checkbox>
      <Checkbox value="2">选项2</Checkbox>
      <Checkbox value="3">选项3</Checkbox>
    </Checkbox.Group>
  );
};
```

## API

### Checkbox Props

| 属性                  | 说明        | 类型                           | 默认值                            |
|---------------------|-----------|------------------------------|--------------------------------|
| `value`             | 复选框的值     | `string \| number`           | -                              |
| `checked`           | 指定当前是否选中  | `boolean`                    | -                              |
| `defaultChecked`    | 初始是否选中    | `boolean`                    | `false`                        |
| `disabled`          | 禁用状态      | `boolean`                    | `false`                        |
| `indeterminate`     | 半选状态      | `boolean`                    | `false`                        |
| `onChange`          | 变化时的回调函数  | `(checked: boolean) => void` | -                              |
| `children`          | 复选框右侧的内容  | `ReactNode`                  | -                              |
| `className`         | 自定义类名     | `string`                     | -                              |
| `boxClassName`      | 复选框框类名    | `string`                     | -                              |
| `checkClassName`    | 复选框勾选图标类名 | `string`                     | -                              |
| `labelClassName`    | 复选框文本类名   | `string`                     | -                              |
| `checkedIcon`       | 自定义勾选图标   | `ReactNode`                  | `<DefaultCheckedIcon />`       |
| `indeterminateIcon` | 自定义半选图标   | `ReactNode`                  | `<DefaultIndeterminateIcon />` |

### Checkbox.Group Props

| 属性             | 说明                  | 类型                                      | 默认值     |
|----------------|---------------------|-----------------------------------------|---------|
| `value`        | 指定选中的选项             | `(string \| number)[]`                  | -       |
| `defaultValue` | 默认选中的选项             | `(string \| number)[]`                  | `[]`    |
| `disabled`     | 整组禁用                | `boolean`                               | `false` |
| `onChange`     | 变化时的回调函数            | `(value: (string \| number)[]) => void` | -       |
| `children`     | 复选框组的内容             | `ReactNode`                             | -       |
| `className`    | 自定义类名               | `string`                                | -       |
| `formRef`      | react-hook-form ref | `RefCallBack`                           | -       |

## 样式定制

组件使用 Tailwind CSS 进行样式设置，支持以下预设样式：

- 默认状态：白色背景，灰色边框
- 选中状态：蓝色背景和边框
- 禁用状态：降低透明度，不可点击
- 半选状态：显示横线图标

可以通过以下类名属性进行样式定制：
- `className`: 容器样式
- `boxClassName`: 复选框框样式
- `checkClassName`: 勾选图标样式
- `labelClassName`: 文本样式

## 无障碍

- 支持键盘操作（空格键切换选中状态）
- 使用 `aria-checked` 标识选中状态
- 使用 `aria-disabled` 标识禁用状态