# Popup 弹出层

从屏幕滑出的模态面板或从屏幕中间弹出的模态框。

## 代码演示

### 基础用法

可以通过组件方式使用：

```tsx
import Popup from '@/components/core/components/popup';

export default () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button onClick={() => setVisible(true)}>显示弹出层</Button>
      <Popup
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <div className="p-4">
          这里是弹出层内容
        </div>
      </Popup>
    </>
  );
};
```

也可以通过命令式方式调用：

```tsx
import Popup from '@/components/core/components/popup';

// 显示弹出层
Popup.show('这是弹出层内容');

// 使用配置选项
Popup.show(
  <div className="p-4">自定义内容</div>,
  {
    position: 'center',
    maskClassName: 'custom-mask',
    afterClose: () => console.log('弹出层已关闭'),
    duration: 3000 // 3秒后自动关闭
  }
);

// 手动关闭
const close = Popup.show('点击按钮关闭').close;
close(); // 调用返回的函数关闭弹出层
```

### 自动关闭

```tsx
// 3秒后自动关闭
<Popup
  visible={visible}
  duration={3000}
  onClose={() => setVisible(false)}
>
  3秒后自动关闭
</Popup>
```

### 全局配置

```tsx
Popup.config({
  position: 'bottom',
  destroyOnClose: true,
});
```

### 清除所有弹出层

```tsx
Popup.clear();
```

### 弹出位置

支持从上、下、左、右、中间五个方向弹出

```tsx
<Popup position="bottom">从底部弹出</Popup>
<Popup position="top">从顶部弹出</Popup>
<Popup position="left">从左侧弹出</Popup>
<Popup position="right">从右侧弹出</Popup>
<Popup position="center">从中间弹出</Popup>
```

### 自定义样式

```tsx
<Popup
  visible={visible}
  onClose={() => setVisible(false)}
  className="bg-gray-100 p-6"
>
  自定义样式的内容
</Popup>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible | 是否显示 | `boolean` | `false` |
| position | 弹出位置 | `'bottom' \| 'top' \| 'left' \| 'right' \| 'center'` | `'bottom'` |
| children | 内容 | `ReactNode` | - |
| maskClassName | 遮罩类名 | `string` | - |
| className | 容器类名 或 语义化的类名 | `string \| SemanticClassNames` | - |
| bodyClassName | 内容区域类名 | `string` | - |
| closeOnMaskClick | 点击遮罩层是否关闭 | `boolean` | `true` |
| onClose | 关闭时触发 | `() => void` | - |
| afterClose | 完全关闭后触发 | `() => void` | - |
| destroyOnClose | 关闭时是否销毁内容 | `boolean` | `false` |
| getContainer | 指定挂载的节点,如果为 null 的话，会渲染到当前节点 | `HTMLElement \| (() => HTMLElement) \| null` | `document.body` |
| disableBodyScroll | 是否在显示弹出层时禁用背景滚动 | `boolean` | `true` |
| duration | 显示持续时间(毫秒)，设置为 0 则不会自动关闭 | `number` | `0` |
| popupId | 弹出层的唯一标识符，一般不需要手动设置 | `string` | - |

### SemanticClassNames Props

| 属性   | 说明      | 类型       | 默认值 |
|------|---------|----------|-----|
| `root` | 容器类名    | `string` | -   |
| `mask` | 遮罩类名    | `string` | -   |
| `body` | 内容区域类名  | `string` | -   |

## 注意事项

1. 弹出层会自动根据 position 属性选择合适的动画效果。
2. 如果设置 `destroyOnClose`，弹出层关闭后会销毁其内容。
3. 可以通过 `getContainer` 指定弹出层挂载的节点，如果为 `null` 则渲染在当前位置。
4. 当 `disableBodyScroll` 为 `true` 时，弹出层显示期间会禁止背景内容滚动。
5. 设置 `duration` 大于 0 时，弹出层会在指定时间后自动关闭。
6. `popupId` 主要用于内部实现，一般情况下不需要手动设置。
