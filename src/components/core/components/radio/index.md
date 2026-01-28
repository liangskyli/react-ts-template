# RadioGroup 单选框组

单选框组件，用于在多个选项中选择一个。

## 代码演示

### 基础用法

```tsx
import RadioGroup from '@/components/core/components/radio';

export default () => (
  <RadioGroup>
    <RadioGroup.Radio value="apple">苹果</RadioGroup.Radio>
    <RadioGroup.Radio value="banana">香蕉</RadioGroup.Radio>
    <RadioGroup.Radio value="orange">橙子</RadioGroup.Radio>
  </RadioGroup>
);
```

### 默认选中

```tsx
import RadioGroup from '@/components/core/components/radio';

export default () => (
  <RadioGroup defaultValue="banana">
    <RadioGroup.Radio value="apple">苹果</RadioGroup.Radio>
    <RadioGroup.Radio value="banana">香蕉</RadioGroup.Radio>
    <RadioGroup.Radio value="orange">橙子</RadioGroup.Radio>
  </RadioGroup>
);
```

### 受控组件

```tsx
import { useState } from 'react';
import RadioGroup from '@/components/core/components/radio';

export default () => {
  const [value, setValue] = useState('apple');
  
  return (
    <>
      <RadioGroup value={value} onChange={setValue}>
        <RadioGroup.Radio value="apple">苹果</RadioGroup.Radio>
        <RadioGroup.Radio value="banana">香蕉</RadioGroup.Radio>
        <RadioGroup.Radio value="orange">橙子</RadioGroup.Radio>
      </RadioGroup>
      <div>当前选中: {value}</div>
    </>
  );
};
```

### 支持取消选择

```tsx
import { useState } from 'react';
import RadioGroup from '@/components/core/components/radio';

export default () => {
  const [value, setValue] = useState('apple');
  
  return (
    <>
      <RadioGroup value={value} onChange={setValue} allowDeselect>
        <RadioGroup.Radio value="apple">苹果</RadioGroup.Radio>
        <RadioGroup.Radio value="banana">香蕉</RadioGroup.Radio>
        <RadioGroup.Radio value="orange">橙子</RadioGroup.Radio>
      </RadioGroup>
      <div>当前选中: {value === null ? '无' : value}</div>
    </>
  );
};
```

### 禁用状态

```tsx
import RadioGroup from '@/components/core/components/radio';

export default () => (
  <>
    {/* 整组禁用 */}
    <RadioGroup disabled defaultValue="apple">
      <RadioGroup.Radio value="apple">苹果</RadioGroup.Radio>
      <RadioGroup.Radio value="banana">香蕉</RadioGroup.Radio>
      <RadioGroup.Radio value="orange">橙子</RadioGroup.Radio>
    </RadioGroup>
    
    {/* 单个选项禁用 */}
    <RadioGroup defaultValue="apple">
      <RadioGroup.Radio value="apple">苹果</RadioGroup.Radio>
      <RadioGroup.Radio value="banana" disabled>香蕉</RadioGroup.Radio>
      <RadioGroup.Radio value="orange">橙子</RadioGroup.Radio>
    </RadioGroup>
  </>
);
```

### 不同类型的值

```tsx
import { useState } from 'react';
import RadioGroup from '@/components/core/components/radio';

export default () => {
  const [value, setValue] = useState(1);
  
  return (
    <RadioGroup<number> value={value} onChange={setValue}>
      <RadioGroup.Radio value={1}>选项 1</RadioGroup.Radio>
      <RadioGroup.Radio value={2}>选项 2</RadioGroup.Radio>
      <RadioGroup.Radio value={3}>选项 3</RadioGroup.Radio>
    </RadioGroup>
  );
};
```

### 自定义样式

```tsx
import RadioGroup from '@/components/core/components/radio';

export default () => (
  <RadioGroup defaultValue="A">
    <RadioGroup.Radio
      value="A"
      boxClassName="group-data-[checked]:border-green-600 group-data-[hover]:hover:border-green-500"
      dotClassName="bg-green-600"
      labelClassName="text-green-600"
    >
      绿色选项
    </RadioGroup.Radio>
    <RadioGroup.Radio
      value="B"
      boxClassName="h-6 w-6 group-data-[checked]:border-purple-600"
      dotClassName="bg-purple-600 h-3 w-3"
      labelClassName="text-[20px]"
    >
      大尺寸选项
    </RadioGroup.Radio>
  </RadioGroup>
);
```

## API

### RadioGroup Props

| 属性             | 说明                  | 类型                       | 默认值     |
|----------------|---------------------|--------------------------|---------|
| `value`        | 当前选中的值              | `TType`                  | -       |
| `defaultValue` | 默认选中的值              | `TType`                  | -       |
| `disabled`     | 是否禁用所有单选框           | `boolean`                | `false` |
| `onChange`     | 选项变化时的回调函数          | `(value: TType) => void` | -       |
| `className`    | 自定义类名               | `string`                 | -       |
| `children`     | 子元素                 | `ReactNode`              | -       |
| `formRef`      | react-hook-form ref | `RefCallBack`            | -       |
| `allowDeselect`| 是否允许取消选择            | `boolean`                | `false` |

### RadioGroup.Radio Props

| 属性               | 说明                 | 类型                             | 默认值     |
|------------------|--------------------|---------------------------------|---------|
| `value`          | 单选框的值              | `TType`                         | -       |
| `disabled`       | 是否禁用               | `boolean`                       | `false` |
| `isCustom`       | 是否全部自定义            | `boolean`                       | `false` |
| `children`       | 单选框右侧的内容或全部自定义内容   | `ReactNode`                     | -       |
| `className`      | 自定义类名 或 语义化的类名     | `string \| SemanticClassNames`  | -       |
| `boxClassName`   | 单选框框类名             | `string`                        | -       |
| `dotClassName`   | 单选框选中点类名           | `string`                        | -       |
| `labelClassName` | 单选框文本类名            | `string`                        | -       |

### SemanticClassNames Props

| 属性      | 说明        | 类型       | 默认值 |
|---------|-----------|----------|-----|
| `root`  | 自定义类名     | `string` | -   |
| `box`   | 单选框框类名    | `string` | -   |
| `dot`   | 单选框选中点类名  | `string` | -   |
| `label` | 单选框文本类名   | `string` | -   |
## 样式定制

RadioGroup 使用 Tailwind CSS 进行样式设置，支持以下预设样式：

- 默认状态：白色背景，灰色边框
- 选中状态：蓝色边框，中间有蓝色圆点
- 禁用状态：降低透明度，不可点击
- 悬停状态：边框颜色变浅

可以通过以下类名属性进行样式定制：
- `className`: RadioGroup 容器样式
- `boxClassName`: 单选框框样式，仅isCustom为false有效
- `dotClassName`: 单选框选中点样式，仅isCustom为false有效
- `labelClassName`: 单选框文本样式，仅isCustom为false有效

## 无障碍

- 使用 Headless UI 的 RadioGroup 组件，确保键盘可访问性
- 支持键盘操作（Tab 键聚焦，方向键切换选项）
- 使用 `role="radiogroup"` 和 `role="radio"` 标识组件角色
- 使用 `aria-checked` 标识选中状态
- 使用 `aria-disabled` 标识禁用状态