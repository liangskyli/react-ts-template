# List 列表

用于展示长列表数据，支持虚拟滚动以提高性能。

## 代码演示

### 基础用法

```tsx
import { List } from '@/components';

export default () => (
  <List>
    <List.Item title="标题文本" description="描述文本" />
    <List.Item title="标题文本" description="描述文本" />
    <List.Item title="标题文本" description="描述文本" />
  </List>
);
```

### 可点击列表项

```tsx
import { List } from '@/components';

export default () => (
  <List>
    <List.Item 
      title="点击项" 
      description="点击查看详情" 
      clickable 
      onClick={() => console.log('点击了')}
    />
    <List.Item 
      title="禁用项" 
      description="不可点击" 
      clickable 
      disabled
    />
  </List>
);
```

### 前缀和后缀

```tsx
import { List } from '@/components';
import { Icon } from '@/components';

export default () => (
  <List>
    <List.Item 
      title="设置" 
      prefix={<Icon name="settings" />}
      suffix={<Icon name="chevron-right" />}
      clickable
    />
    <List.Item 
      title="消息" 
      prefix={<Icon name="message" />}
      suffix={<div className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">5</div>}
      clickable
    />
  </List>
);
```

### 自定义内容

```tsx
import { List } from '@/components';

export default () => (
  <List>
    <List.Item>
      <div className="flex flex-col">
        <span className="text-lg font-medium">自定义标题</span>
        <span className="text-sm text-gray-500">自定义描述</span>
        <div className="mt-2 flex items-center">
          <span className="text-xs text-blue-500">详细信息</span>
          <span className="ml-2 text-xs text-gray-400">2023-05-20</span>
        </div>
      </div>
    </List.Item>
  </List>
);
```

### 虚拟滚动

适用于大量数据渲染场景，提高性能。

```tsx
import { List } from '@/components';

export default () => {
  // 生成大量数据
  const items = Array.from({ length: 1000 }, (_, index) => ({
    id: index,
    title: `标题 ${index}`,
    description: `这是第 ${index} 项的描述`
  }));

  return (
    <List 
      virtualScroll
      className="border border-gray-200 rounded-md h-[216px]"
    >
      {items.map(item => (
        <List.Item 
          key={item.id}
          title={item.title} 
          description={item.description}
          clickable
        />
      ))}
    </List>
  );
};
```

## API

### List

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `virtualScroll` | 是否启用虚拟滚动 | `boolean` | `false` |
| `virtualConfig` | 虚拟滚动配置 | `VirtualConfig` | - |
| `className` | 自定义类名 | `string` | - |
| `children` | 列表内容 | `ReactNode` | - |

#### VirtualConfig

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `defaultHeight` | 每项默认高度 | `number` | `60` |
| `minHeight` | 每项最小高度 | `number` | `60` |

### List.Item

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 列表项标题 | `ReactNode` | - |
| `description` | 列表项描述 | `ReactNode` | - |
| `prefix` | 列表项前缀 | `ReactNode` | - |
| `suffix` | 列表项后缀 | `ReactNode` | - |
| `clickable` | 是否可点击 | `boolean` | `false` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `className` | 自定义类名 | `string` | - |
| `onClick` | 点击事件 | `(e: React.MouseEvent) => void` | - |
| `children` | 列表项内容 | `ReactNode` | - |

## 样式定制

List 使用 Tailwind CSS 进行样式设置，支持以下预设样式：

- 默认样式：白色背景，灰色边框分隔线
- 可点击项：鼠标悬停和点击时有背景色变化
- 禁用项：降低透明度，不可点击

可以通过 `className` 属性进行样式覆盖：

```tsx
<List className="shadow-md">
  <List.Item className="hover:bg-blue-50" />
</List>
```

## 虚拟滚动说明

当列表项数量较多时，建议启用虚拟滚动以提高性能。虚拟滚动的工作原理是只渲染可视区域内的列表项，从而减少DOM节点数量。

使用虚拟滚动时，需要注意：

1. 列表项高度必须固定，不能根据内容自动调整,可以用List的className设置高度
2. 可以设置 `defaultHeight` 和 `minHeight` 来优化渲染性能

## 无障碍

- 禁用状态有明确的视觉提示
- 可点击项有明确的视觉反馈

## 注意事项

1. 当使用虚拟滚动时，确保为每个列表项提供唯一的 `key` 属性
2. 虚拟滚动模式下，列表项高度会根据内容自动调整，但初始渲染时会使用 `defaultHeight`
3. 如果列表项高度变化频繁，可能会影响滚动体验，建议设置合适的 `defaultHeight` 值
