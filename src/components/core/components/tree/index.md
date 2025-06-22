# Tree 树形控件

基于 List 组件实现的树形控件，支持虚拟滚动、无限滚动等高级功能，用于展示有层级关系的数据。使用 RadioGroup 组件实现单选，使用 Checkbox 组件实现多选。

## 代码演示

### 基础用法

```tsx
import Tree from '@/components/core/components/tree';

const treeData = [
  {
    key: '1',
    title: '父节点1',
    children: [
      {
        key: '1-1',
        title: '子节点1-1',
      },
      {
        key: '1-2',
        title: '子节点1-2',
        children: [
          {
            key: '1-2-1',
            title: '子节点1-2-1',
          },
        ],
      },
    ],
  },
  {
    key: '2',
    title: '父节点2',
    children: [
      {
        key: '2-1',
        title: '子节点2-1',
      },
    ],
  },
];

export default () => (
  <Tree treeData={treeData} />
);
```

### 默认展开

```tsx
import Tree from '@/components/core/components/tree';

const treeData = [
  {
    key: '1',
    title: '父节点1',
    children: [
      {
        key: '1-1',
        title: '子节点1-1',
      },
      {
        key: '1-2',
        title: '子节点1-2',
      },
    ],
  },
  {
    key: '2',
    title: '父节点2',
    children: [
      {
        key: '2-1',
        title: '子节点2-1',
      },
    ],
  },
];

export default () => (
  <Tree 
    treeData={treeData} 
    defaultExpandedKeys={['1', '2']}
  />
);
```

### 可选择（单选）

```tsx
import Tree from '@/components/core/components/tree';

const treeData = [
  {
    key: '1',
    title: '父节点1',
    children: [
      {
        key: '1-1',
        title: '子节点1-1',
      },
      {
        key: '1-2',
        title: '子节点1-2',
      },
    ],
  },
  {
    key: '2',
    title: '父节点2',
    children: [
      {
        key: '2-1',
        title: '子节点2-1',
      },
    ],
  },
];

export default () => (
  <Tree
    treeData={treeData}
    defaultSelectedKey={'1-1'}
    onSelect={(selectedKey, info) => {
      console.log('选中的节点:', selectedKey, info);
    }}
  />
);
```

### 多选（父子联动）

```tsx
import Tree from '@/components/core/components/tree';

const treeData = [
  {
    key: '1',
    title: '父节点1',
    children: [
      {
        key: '1-1',
        title: '子节点1-1',
      },
      {
        key: '1-2',
        title: '子节点1-2',
      },
    ],
  },
  {
    key: '2',
    title: '父节点2',
    children: [
      {
        key: '2-1',
        title: '子节点2-1',
      },
    ],
  },
];

export default () => (
  <Tree
    treeData={treeData}
    multiple
    defaultSelectedKeys={['1-1']} // 只选中一个子节点，父节点显示半选状态
    onMultipleSelect={(selectedKeys, info) => {
      console.log('选中的节点:', selectedKeys);
      console.log('完全选中的节点:', info.checkedKeys);
      console.log('半选状态的节点:', info.halfCheckedKeys);
    }}
  />
);
```

### 多选（严格模式）

```tsx
import Tree from '@/components/core/components/tree';

export default () => (
  <Tree
    treeData={treeData}
    multiple
    checkStrictly={true} // 严格模式，父子节点选择互不影响
    defaultExpandedKeys={['1', '2']}
    defaultSelectedKeys={['1-1', '2-1']}
    onMultipleSelect={(selectedKeys, info) => {
      console.log('严格模式多选:', selectedKeys, info);
    }}
  />
);
```

### 禁用节点

```tsx
import Tree from '@/components/core/components/tree';

const treeData = [
  {
    key: '1',
    title: '父节点1',
    children: [
      {
        key: '1-1',
        title: '子节点1-1',
      },
      {
        key: '1-2',
        title: '子节点1-2（禁用）',
        disabled: true,
      },
    ],
  },
  {
    key: '2',
    title: '父节点2（禁用）',
    disabled: true,
    children: [
      {
        key: '2-1',
        title: '子节点2-1',
      },
    ],
  },
];

export default () => (
  <Tree 
    treeData={treeData}
    defaultExpandedKeys={['1', '2']}
  />
);
```

### 自定义图标

```tsx
import Tree from '@/components/core/components/tree';
import Icon from '@/components/core/components/icon';

const treeData = [
  {
    key: '1',
    title: '文件夹1',
    children: [
      {
        key: '1-1',
        title: '文件1.txt',
      },
      {
        key: '1-2',
        title: '文件2.txt',
      },
    ],
  },
];

export default () => (
  <Tree 
    treeData={treeData}
    expandIcon={<Icon name="folder" className="h-4 w-4" />}
    collapseIcon={<Icon name="folder-open" className="h-4 w-4" />}
  />
);
```

### 虚拟滚动

适用于大量数据渲染场景，提高性能。

```tsx
import Tree from '@/components/core/components/tree';

// 生成大量数据
const generateTreeData = (level = 0, parentKey = '') => {
  if (level > 3) return [];
  
  return Array.from({ length: 100 }, (_, index) => {
    const key = parentKey ? `${parentKey}-${index}` : `${index}`;
    return {
      key,
      title: `节点 ${key}`,
      children: level < 2 ? generateTreeData(level + 1, key) : undefined,
    };
  });
};

const treeData = generateTreeData();

export default () => (
  <Tree 
    treeData={treeData}
    virtualScroll
    className="h-[400px] border border-gray-200 rounded-md"
  />
);
```

### 受控模式

```tsx
import { useState } from 'react';
import Tree from '@/components/core/components/tree';

const treeData = [
  {
    key: '1',
    title: '父节点1',
    children: [
      {
        key: '1-1',
        title: '子节点1-1',
      },
      {
        key: '1-2',
        title: '子节点1-2',
      },
    ],
  },
  {
    key: '2',
    title: '父节点2',
    children: [
      {
        key: '2-1',
        title: '子节点2-1',
      },
    ],
  },
];

export default () => {
  const [selectedKey, setSelectedKey] = useState('1-1');
  const [expandedKeys, setExpandedKeys] = useState(['1']);

  return (
    <div>
      <div className="mb-4">
        <p>选中的节点: {selectedKey}</p>
        <p>展开的节点: {expandedKeys.join(', ')}</p>
      </div>
      <Tree
        treeData={treeData}
        selectedKey={selectedKey}
        expandedKeys={expandedKeys}
        onSelect={(key) => setSelectedKey(key)}
        onExpand={(keys) => setExpandedKeys(keys)}
      />
    </div>
  );
};
```

## API

### Tree

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|-------|
| `treeData` | 树形数据 | `TreeNode[]` | - |
| `multiple` | 是否支持多选 | `boolean` | `false` |
| `selectable` | 是否可选择 | `boolean` | `true` |
| `checkStrictly` | 是否启用父子节点联动（仅多选模式有效） | `boolean` | `false` |
| `selectedKey` | 选中的节点key（单选模式，受控） | `string \| number` | - |
| `selectedKeys` | 选中的节点key（多选模式，受控） | `(string \| number)[]` | - |
| `expandedKeys` | 展开的节点key（受控） | `(string \| number)[]` | - |
| `defaultExpandedKeys` | 默认展开的节点key | `(string \| number)[]` | `[]` |
| `defaultSelectedKey` | 默认选中的节点key（单选模式） | `string \| number` | - |
| `defaultSelectedKeys` | 默认选中的节点key（多选模式） | `(string \| number)[]` | `[]` |
| `showIcon` | 是否显示展开/收起图标 | `boolean` | `true` |
| `expandIcon` | 自定义展开图标 | `ReactNode` | - |
| `collapseIcon` | 自定义收起图标 | `ReactNode` | - |
| `onSelect` | 节点选择回调（单选模式） | `(selectedKey, info) => void` | - |
| `onMultipleSelect` | 节点选择回调（多选模式） | `(selectedKeys, info) => void` | - |
| `onExpand` | 展开/收起回调 | `(expandedKeys, info) => void` | - |
| `className` | 自定义类名 | `string` | - |
| `virtualScroll` | 是否启用虚拟滚动 | `boolean \| VirtualScrollConfig` | `false` |
| `infiniteScroll` | 无限滚动配置 | `InfiniteScrollConfig` | - |
| `getPositionCache` | 获取滚动位置缓存 | `(cache) => void` | - |
| `ref` | 组件引用 | `React.Ref<TreeRef>` | - |

### TreeNode

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|-------|
| `key` | 节点的唯一标识 | `string \| number` | - |
| `title` | 节点标题 | `ReactNode` | - |
| `children` | 子节点 | `TreeNode[]` | - |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `selectable` | 是否可选择 | `boolean` | `true` |
| `defaultExpanded` | 是否默认展开 | `boolean` | `false` |

### TreeRef

继承自 `ListRef`，包含以下方法：

| 方法 | 说明 | 类型 |
|------|------|------|
| `scrollToPosition` | 滚动到指定位置 | `(scrollTop: number) => void` |
| `virtualScrollToIndex` | 滚动到指定索引（虚拟滚动模式） | `(index: number) => void` |

## 样式定制

Tree 使用 Tailwind CSS 进行样式设置，支持以下预设样式：

- 节点样式：支持选中、禁用、悬停状态
- 缩进样式：根据层级自动缩进
- 图标样式：展开/收起图标的过渡动画

可以通过 `className` 属性进行样式覆盖：

```tsx
<Tree 
  className="border border-gray-300 rounded-lg"
  treeData={treeData}
/>
```

## 注意事项

1. 每个节点必须有唯一的 `key` 属性
2. 使用虚拟滚动时，建议设置固定的容器高度
3. 大量数据时建议启用虚拟滚动以提高性能
4. 单选模式使用 RadioGroup 组件，多选模式使用 Checkbox 组件
5. 受控模式下，单选使用 `selectedKey` 和 `onSelect`，多选使用 `selectedKeys` 和 `onMultipleSelect`
6. 设置 `selectable={false}` 可以禁用选择功能，仅用于展示
7. 多选模式下默认启用父子节点联动，设置 `checkStrictly={true}` 可禁用联动
8. 父子联动模式下，选中父节点会自动选中所有子节点，部分子节点选中时父节点显示半选状态
9. `onMultipleSelect` 回调中的 `info` 参数包含 `checkedKeys`（完全选中）和 `halfCheckedKeys`（半选状态）
