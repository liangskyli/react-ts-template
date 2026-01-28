# loading加载 组件
> loading使用。

## 属性

| 属性                   | 说明                | 类型                            | 默认值 |
|----------------------|-------------------|-------------------------------|-----|
| visible              | 是否显示              | `boolean`                     | -   |
| className            | 遮罩层自定义类名 或 语义化的类名 | `string \|SemanticClassNames` | -   |
| bodyClassName        | 内容区域自定义类名         | `string`                      | -   |
| textClassName        | 文本区域自定义类名         | `string`                      | -   |
| loadingIconClassName | loading图标自定义类名    | `string`                      | -   |

### SemanticClassNames Props

| 属性            | 说明             | 类型       | 默认值 |
|---------------|----------------|----------|-----|
| `root`        | 遮罩层自定义类名       | `string` | -   |
| `body`        | 内容区域自定义类名      | `string` | -   |
| `text`        | 文本区域自定义类名      | `string` | -   |
| `loadingIcon` | loading图标自定义类名 | `string` | -   |

## 代码示例
### 基础用法

``` tsx
import Loading from '@/components/core/components/loading';

const Demo = () => {
  return (
    <Loading visible={true} />
  );
};
```
### 自定义样式
``` tsx
import Loading from '@/components/core/components/loading';

const Demo = () => {
  return (
    <Loading 
      visible={true}
      className="custom-mask"
      bodyClassName="custom-body"
      textClassName="custom-text"
      loadingIconClassName="custom-icon"
    />
  );
};
```
### 动态控制显示
``` tsx
import { useState } from 'react';
import Loading from '@/components/core/components/loading';

const Demo = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClick = () => {
    setIsLoading(true);
    // 模拟异步操作
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <>
      <button onClick={handleClick}>开始加载</button>
      <Loading visible={isLoading} />
    </>
  );
};
```

