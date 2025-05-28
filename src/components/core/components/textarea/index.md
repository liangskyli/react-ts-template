# TextArea 文本域

多行文本输入框组件，用于收集用户多行文本输入。

## 代码演示

### 基础用法

```tsx
import TextArea from '@/components/core/components/textarea';

export default () => (
  <TextArea placeholder="请输入内容" />
);
```

### 受控组件

```tsx
import { useState } from 'react';
import TextArea from '@/components/core/components/textarea';

export default () => {
  const [value, setValue] = useState('初始内容');
  
  return (
    <TextArea 
      value={value} 
      onChange={setValue} 
      placeholder="请输入内容"
    />
  );
};
```

### 显示字数统计

```tsx
import TextArea from '@/components/core/components/textarea';

export default () => (
  <TextArea 
    placeholder="请输入内容" 
    showCount 
    maxLength={100}
  />
);
```

### 自动高度调整

```tsx
import TextArea from '@/components/core/components/textarea';

export default () => (
  <>
    <TextArea 
      placeholder="自动高度" 
      autoSize 
    />
    
    <TextArea 
      placeholder="限制行数" 
      autoSize={{ minRows: 3, maxRows: 5 }}
    />
  </>
);
```

### 禁用和只读状态

```tsx
import TextArea from '@/components/core/components/textarea';

export default () => (
  <>
    <TextArea 
      placeholder="禁用状态" 
      disabled 
      defaultValue="禁用文本域"
    />
    
    <TextArea 
      placeholder="只读状态" 
      readOnly 
      defaultValue="只读文本域"
    />
  </>
);
```

## API

| 属性                  | 说明         | 类型                                                  | 默认值     |
|---------------------|------------|-----------------------------------------------------|---------|
| `value`             | 输入框的值      | `string`                                            | -       |
| `defaultValue`      | 输入框默认值     | `string`                                            | -       |
| `disabled`          | 是否禁用       | `boolean`                                           | `false` |
| `readOnly`          | 是否只读       | `boolean`                                           | `false` |
| `maxLength`         | 最大长度       | `number`                                            | -       |
| `showCount`         | 是否显示字数统计   | `boolean`                                           | `false` |
| `autoSize`          | 自动高度       | `boolean \| { minRows?: number; maxRows?: number }` | `false` |
| `className`         | 自定义类名      | `string`                                            | -       |
| `textareaClassName` | 输入框类名      | `string`                                            | -       |
| `countClassName`    | 字数统计类名     | `string`                                            | -       |
| `onChange`          | 值变化时的回调函数  | `(value: string) => void`                           | -       |

此外，组件还支持所有原生 textarea 元素的属性（如 `rows`、`cols` 等）。

## 样式定制

TextArea 使用 Tailwind CSS 进行样式设置，支持以下预设样式：

- 默认状态：白色背景，灰色边框
- 聚焦状态：蓝色边框和轮廓（只读状态下不显示）
- 禁用状态：灰色背景，降低透明度
- 只读状态：浅灰色背景

可以通过以下类名属性进行样式定制：
- `className`: 容器样式
- `textareaClassName`: 文本域样式
- `countClassName`: 字数统计样式

## 无障碍

- 支持键盘操作
- 支持屏幕阅读器
- 禁用状态下会设置 `disabled` 属性，确保无法交互
- 只读状态下可以聚焦但不能编辑，便于屏幕阅读器用户访问内容
