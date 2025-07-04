# Toast 轻提示

轻提示组件，用于页面中展示重要的提示信息。基于 Popup 组件实现。

## 代码演示

### 基础用法

```tsx
import Toast from '@/components/core/components/toast';

// 显示一个简单的提示
Toast.show('这是一条提示消息');

// 使用自定义配置
Toast.show('提示消息', {
  duration: 2000,
  position: 'center'
});
```

### 全局配置

```tsx
// 设置全局默认配置
Toast.config({
  duration: 2000,
  position: 'top',
  maskClickable: true,
});

// 使用默认配置显示
Toast.show('使用默认配置');

// 单次调用时可以覆盖默认配置
Toast.show('覆盖配置', { position: 'bottom' });
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

### 自定义挂载节点

```tsx
// 指定挂载到某个DOM节点
const container = document.querySelector('#custom-container');
Toast.show('自定义容器中的提示', { getContainer: container });

// 使用函数返回挂载节点
Toast.show('动态容器中的提示', {
  getContainer: () => document.querySelector('#dynamic-container')
});
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

### Toast.config

```ts
Toast.config(options: ToastOptions)
```

全局配置 Toast 的默认属性。

### Toast.show

```ts
Toast.show(
  message: ReactNode,
  options?: ToastOptions
) => () => void
```

### Toast.clear

```ts
Toast.clear()
```

清除所有显示中的轻提示。

### Options

| 参数             | 说明                       | 类型                                   | 默认值             |
|----------------|--------------------------|--------------------------------------|-----------------|
| duration       | 提示持续时间（毫秒），设置为 0 则不会自动关闭 | `number`                             | `3000`          |
| position       | 提示显示位置                   | `'top' \| 'bottom' \| 'center'`      | `'center'`      |
| afterClose     | 完全关闭后的回调函数               | `() => void`                         | -               |
| maskClickable  | 是否允许背景点击                 | `boolean`                            | `false`         |
| getContainer   | 自定义轻提示的挂载节点              | `HTMLElement \| (() => HTMLElement)` | `document.body` |
| maskClassName  | 遮罩类名                     | `string`                             | -               |
| className      | 容器类名                     | `string`                             | -               |
| bodyClassName  | 内容区域类名                   | `string`                             | -               |

## 注意事项

1. Toast 采用单例模式，同一时间只会显示一个 Toast。新的 Toast 会替换当前显示的 Toast。
2. 当设置 `duration` 为 0 时，Toast 不会自动关闭，需要手动调用返回的关闭函数或 `Toast.clear()` 来关闭。
3. `afterClose` 回调会在 Toast 完全关闭后立即执行。
4. Toast 组件基于 Popup 组件实现，继承了 Popup 的部分特性。
5. 支持连续多次调用，但只会显示最后一次调用的内容。
6. 通过 `Toast.config()` 设置的全局配置可以被单次调用的配置覆盖。
