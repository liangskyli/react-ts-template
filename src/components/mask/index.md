# Mask 遮罩层组件

遮罩层组件用于创建一个覆盖整个视口的遮罩效果，通常用于模态框、加载状态等场景。

## 代码演示

### 基础用法

```tsx
import { Mask } from '@/components';

export default () => (
  <Mask visible={true}>
    <div>遮罩层内容</div>
  </Mask>
);
```

### 自定义样式

```tsx
import { Mask } from '@/components';

export default () => (
  <Mask 
    visible={true} 
    className="custom-mask bg-black/50"
    onMaskClick={() => console.log('mask clicked')}
  >
    <div>自定义背景色的遮罩层</div>
  </Mask>
);
```

### 指定渲染容器

```tsx
import { Mask } from '@/components';

export default () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <>
      <div ref={containerRef} />
      <Mask 
        visible={true}
        getContainer={() => containerRef.current}
      >
        <div>渲染到指定容器的遮罩层</div>
      </Mask>
    </>
  );
};
```

## API

| 属性                | 说明              | 类型                                                | 默认值         |
|-------------------|-----------------|---------------------------------------------------|-------------|
| visible           | 是否显示遮罩层         | `boolean`                                         | `false`     |
| className         | 自定义类名           | `string`                                          | -           |
| onMaskClick       | 点击遮罩层时的回调函数     | `(event: MouseEvent<HTMLDivElement>) => void`     | -           |
| getContainer      | 指定遮罩层渲染的容器      | `HTMLElement \| (() => HTMLElement) \| undefined` | `undefined` |
| children          | 遮罩层内容           | `ReactNode`                                       | -           |
| destroyOnClose    | 关闭时是否销毁子元素      | `boolean`                                         | `false`     |
| disableBodyScroll | 是否在显示遮罩层时禁用背景滚动 | `boolean`                                         | `true`      |
| afterClose        | 完全关闭后的回调函数      | `() => void`                                     | -           |
