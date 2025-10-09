# Typewriter 打字机效果

基于 typeit-react 封装的打字机效果组件，支持文本逐字显示动画。

## 代码演示

### 基础用法

```tsx
import Typewriter from '@/components/core/components/typewriter';

export default () => (
  <Typewriter>This will be typed in a `span` element!</Typewriter>
);
```

### 不显示光标

```tsx
import Typewriter from '@/components/core/components/typewriter';

export default () => (
  <Typewriter
    className="before:!content-none"
    options={{ cursor: false }}
  >
    This will be typed without a cursor!
  </Typewriter>
);
```

### 多行内容

```tsx
import Typewriter from '@/components/core/components/typewriter';

export default () => (
  <Typewriter options={{ cursor: false }}>
    <div>
      This will be typed in a `div`
      <span className="text-green-500">element</span>!
    </div>
    <div>
      This will be typed in a `div`
      <span className="text-red-600">element</span>!
    </div>
  </Typewriter>
);
```

### 使用 Hook 动态控制

```tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import Button from '@/components/core/components/button';
import { useTypewriterText } from '@/components/core/components/typewriter';

export default () => {
  const [dataIndex, setDataIndex] = useState(1);
  const { text: typewriterText, instance } = useTypewriterText({
    children: '开始演示：',
    options: { cursor: false },
  });

  const getStreamData = () => {
    if (instance) {
      // 创建要显示的内容
      const div = document.createElement('div');
      const root = createRoot(div);
      flushSync(() => {
        root.render(
          <div>
            {dataIndex} 获取到的数据：这是动态添加的内容
          </div>
        );
      });
      const html = div.innerHTML;
      root.unmount();

      // 使用 instance 动态添加内容
      instance.type(html).flush(() => {
        console.log('打字完成');
      });

      setDataIndex(dataIndex + 1);
    }
  };

  return (
    <div>
      <div>{typewriterText}</div>
      <Button onClick={getStreamData}>获取数据</Button>
    </div>
  );
};
```

### 自定义打字速度

```tsx
import Typewriter from '@/components/core/components/typewriter';

export default () => (
  <Typewriter
    options={{
      speed: 50, // 打字速度（毫秒）
      cursor: true,
    }}
  >
    This will be typed slowly!
  </Typewriter>
);
```

### 循环播放

```tsx
import Typewriter from '@/components/core/components/typewriter';

export default () => (
  <Typewriter
    options={{
      loop: true,
      loopDelay: 1000, // 循环延迟（毫秒）
    }}
  >
    This will loop forever!
  </Typewriter>
);
```

## API

### Typewriter 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `className` | 自定义类名 | `string` | - |
| `children` | 要显示的内容 | `ReactNode` | - |
| `options` | TypeIt 配置选项 | `TypeItOptions` | - |
| `getBeforeInit` | 初始化前的回调 | `(instance: TypeItCore) => TypeItCore` | - |
| `getAfterInit` | 初始化后的回调 | `(instance: TypeItCore) => TypeItCore` | - |

### useTypewriterText Hook

用于动态控制打字机效果的 Hook。

**参数：**

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `opts` | 配置选项，同 Typewriter 组件属性 | `TypewriterProps` | `{}` |

**返回值：**

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| `text` | 打字机组件实例 | `ReactElement` |
| `instance` | TypeIt 实例，用于动态控制 | `TypeItCore \| null` |

### TypeItOptions 常用配置

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `speed` | 打字速度（毫秒） | `number` | `100` |
| `cursor` | 是否显示光标 | `boolean` | `true` |
| `cursorChar` | 光标字符 | `string` | `'\|'` |
| `loop` | 是否循环播放 | `boolean` | `false` |
| `loopDelay` | 循环延迟（毫秒） | `number` | `750` |
| `startDelay` | 开始延迟（毫秒） | `number` | `250` |
| `breakLines` | 是否换行 | `boolean` | `true` |
| `waitUntilVisible` | 是否等待元素可见后再开始 | `boolean` | `false` |
| `lifeLike` | 是否模拟真实打字（速度有随机变化） | `boolean` | `true` |

### TypeItCore 实例方法

通过 `useTypewriterText` Hook 返回的 `instance` 可以调用以下方法：

| 方法 | 说明 | 参数 |
| --- | --- | --- |
| `type(string)` | 添加要打字的文本 | `string` |
| `delete(count)` | 删除字符 | `number \| null` |
| `pause(delay)` | 暂停 | `number` |
| `move(steps)` | 移动光标 | `number \| null` |
| `flush(callback)` | 执行队列并在完成后调用回调 | `() => void` |
| `reset()` | 重置实例 | - |
| `destroy()` | 销毁实例 | - |

## 样式定制

Typewriter 使用 Tailwind CSS 进行样式设置。默认情况下，光标使用 `::before` 伪元素实现。

### 隐藏光标

可以通过以下两种方式隐藏光标：

1. 使用 `options.cursor` 配置：
```tsx
<Typewriter options={{ cursor: false }}>
  Content
</Typewriter>
```

2. 使用 CSS 类名：
```tsx
<Typewriter className="before:!content-none">
  Content
</Typewriter>
```

### 自定义样式

```tsx
<Typewriter className="text-blue-600 text-lg font-bold">
  Styled content
</Typewriter>
```

## 使用场景

1. **欢迎页面**：展示欢迎信息或介绍文字
2. **聊天机器人**：模拟 AI 回复的打字效果
3. **流式数据展示**：配合 `useTypewriterText` Hook 动态展示流式数据
4. **产品介绍**：逐步展示产品特性
5. **代码演示**：模拟代码输入过程

## 注意事项

1. 组件基于 `typeit-react` 库封装，更多高级用法请参考 [TypeIt 官方文档](https://www.typeitjs.com/)
2. 使用 `useTypewriterText` Hook 时，需要通过 `instance` 来动态控制内容，确保在 `instance` 不为 `null` 时再调用其方法
3. 动态添加 HTML 内容时，建议使用 `createRoot` 和 `flushSync` 来确保内容正确渲染
4. 光标样式通过 `::before` 伪元素实现，如需完全自定义光标，可以设置 `cursor: false` 并自行实现
5. 当内容较多时，建议设置合适的 `speed` 值以优化用户体验
6. 使用 `loop` 选项时注意性能影响，避免在大量组件中同时使用循环动画

## 无障碍

- 打字机效果是纯视觉效果，屏幕阅读器会读取完整内容
- 对于重要信息，建议提供跳过动画的选项
- 避免在关键操作提示中使用打字机效果，以免影响用户操作效率

