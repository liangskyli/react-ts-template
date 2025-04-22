# Toast 轻提示

轻提示组件，用于页面中展示重要的提示信息。

## 代码演示

### 基础用法

```tsx
import { Toast } from '@/components/toast';

// 显示一个简单的提示
Toast.show('这是一条提示消息');

// 使用自定义配置
Toast.show('提示消息', {
  duration: 2000,
  position: 'center'
});
```

### 自定义持续时间

```tsx
// 设置显示时间为 5 秒
Toast.show('较长的提示消息', { duration: 5000 });

// 设置为 0，需要手动关闭
Toast.show('需要手动关闭的消息', { duration: 0 });
```

### 不同位置

```tsx
// 顶部显示
Toast.show('顶部提示', { position: 'top' });

// 底部显示
Toast.show('底部提示', { position: 'bottom' });

// 中间显示（默认）
Toast.show('中间提示', { position: 'center' });
```

### 手动关闭

```tsx
// 获取关闭函数
const close = Toast.show('点击按钮关闭此提示');

// 在需要时调用关闭
close();

// 或者使用 clear 方法关闭所有提示
Toast.clear();
```

### 使用回调函数

```tsx
Toast.show('提示消息', {
  afterClose: () => {
    console.log('Toast已关闭');
  }
});
```

### 使用 React 元素作为内容

```tsx
Toast.show(
  <div className="flex items-center">
    <Icon name="success" />
    <span>操作成功</span>
  </div>
);
```

## API

### Toast.show

```ts
Toast.show(
  message: ReactNode,
  options?: ToastOptions
) => () => void
```

### Options

| 参数            | 说明                       | 类型                              | 默认值        |
|---------------|--------------------------|---------------------------------|------------|
| duration      | 提示持续时间（毫秒），设置为 0 则不会自动关闭 | `number`                        | `3000`     |
| position      | 提示显示位置                   | `'top' \| 'bottom' \| 'center'` | `'center'` |
| afterClose    | 完全关闭后的回调函数               | `() => void`                    | -          |
| maskClickable | 是否允许背景点击                 | `boolean`                       | `false`    |

### Toast.clear

```ts
Toast.clear()
```

清除所有显示中的轻提示。

## 注意事项

1. Toast 默认采用单例模式，同一时间只会显示一个 Toast。
2. 当设置 `duration` 为 0 时，Toast 不会自动关闭，需要手动调用返回的关闭函数或 `Toast.clear()` 来关闭。
3. Toast 组件会自动创建一个新的 DOM 节点挂载到 body 上，并在关闭时隐藏，调用Toast.clear才清理。