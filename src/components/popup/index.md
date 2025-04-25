# Popup 弹出层

从屏幕滑出的模态面板或从屏幕中间弹出的模态框。

## 代码演示

### 基础用法

```tsx
import { Popup } from '@/components';

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
| className | 容器类名 | `string` | - |
| bodyClassName | 内容区域类名 | `string` | - |
| closeOnMaskClick | 点击遮罩层是否关闭 | `boolean` | `true` |
| onClose | 关闭时触发 | `() => void` | - |
| afterClose | 完全关闭后触发 | `() => void` | - |
| destroyOnClose | 关闭时是否销毁内容 | `boolean` | `false` |
| getContainer | 指定挂载的节点 | `HTMLElement \| (() => HTMLElement) \| null` | `document.body` |
| disableBodyScroll | 是否在显示弹出层时禁用背景滚动 | `boolean` | `true` |

## 注意事项

1. 弹出层会自动根据 position 属性选择合适的动画效果。
2. 如果设置 `destroyOnClose`，弹出层关闭后会销毁其内容。
3. 可以通过 `getContainer` 指定弹出层挂载的节点，如果为 `null` 则渲染在当前位置。
4. 当 `disableBodyScroll` 为 `true` 时，弹出层显示期间会禁止背景内容滚动。
