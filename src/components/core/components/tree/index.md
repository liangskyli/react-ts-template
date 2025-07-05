# Tree 树形控件

基于 List 组件实现的树形控件，支持虚拟滚动、等高级功能，用于展示有层级关系的数据。提供三种使用方式：

- `Tree` - 基础树形控件，仅展示数据，不包含选择功能
- `Tree.Radio` - 单选树形控件，使用 RadioGroup 组件实现单选功能
- `Tree.Checkbox` - 多选树形控件，使用 Checkbox 组件实现多选功能，支持父子联动

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

export default () => (
  <Tree
    treeData={treeData}
    defaultExpandedKeys={['1', '2']}
  />
);
```

### 受控展开

```tsx
import { useState } from 'react';
import Tree from '@/components/core/components/tree';

export default () => {
  const [expandedKeys, setExpandedKeys] = useState(['1']);

  return (
    <Tree
      treeData={treeData}
      expandedKeys={expandedKeys}
      onExpand={(keys) => setExpandedKeys(keys)}
    />
  );
};
```

### 自定义图标

```tsx
import Tree from '@/components/core/components/tree';

export default () => (
  <Tree
    treeData={treeData}
    expandIcon={<span>+</span>}
    collapseIcon={<span>-</span>}
    defaultExpandedKeys={['1']}
  />
);
```

### 隐藏图标

```tsx
import Tree from '@/components/core/components/tree';

export default () => (
  <Tree
    treeData={treeData}
    showIcon={false}
  />
);
```

### 自定义缩进

```tsx
import Tree from '@/components/core/components/tree';

export default () => (
  <Tree
    treeData={treeData}
    indentWidth={48}
    defaultExpandedKeys={['1']}
  />
);
```

### 自定义渲染

```tsx
import Tree from '@/components/core/components/tree';

export default () => (
  <Tree
    treeData={treeData}
    renderNode={(node) => (
      <div className="flex items-center">
        <span className="mr-2">🌳</span>
        {node.title}
      </div>
    )}
    defaultExpandedKeys={['1']}
  />
);
```

### 虚拟滚动

```tsx
import Tree from '@/components/core/components/tree';

export default () => (
  <Tree
    treeData={largeTreeData}
    virtualScroll={true}
    defaultExpandedKeys={['1', '2']}
  />
);
```

## Tree.Radio 单选树形控件

### 基础单选

```tsx
import Tree from '@/components/core/components/tree';

export default () => (
  <Tree.Radio
    treeData={treeData}
    defaultExpandedKeys={['1', '2']}
    defaultSelectedKey={'1-1'}
    onSelect={(selectedKey, info) => {
      console.log('选中的节点:', selectedKey, info);
    }}
  />
);
```

### 允许取消选择

```tsx
import Tree from '@/components/core/components/tree';

export default () => (
  <Tree.Radio
    treeData={treeData}
    defaultExpandedKeys={['1', '2']}
    allowDeselect={true}
    onSelect={(selectedKey, info) => {
      console.log('选中的节点:', selectedKey, info);
    }}
  />
);
```

### 只有叶子节点可选择

```tsx
import Tree from '@/components/core/components/tree';

export default () => (
  <Tree.Radio
    treeData={treeData}
    defaultExpandedKeys={['1', '2']}
    onlyLeafSelectable={true}
    onSelect={(selectedKey, info) => {
      console.log('叶子节点选择:', selectedKey, info);
    }}
  />
);
```

### 受控模式

```tsx
import { useState } from 'react';
import Tree from '@/components/core/components/tree';

export default () => {
  const [selectedKey, setSelectedKey] = useState('1-1');

  return (
    <Tree.Radio
      treeData={treeData}
      defaultExpandedKeys={['1', '2']}
      selectedKey={selectedKey}
      onSelect={(key) => setSelectedKey(key)}
    />
  );
};
```

## Tree.Checkbox 多选树形控件

### 基础多选（父子联动）

```tsx
import Tree from '@/components/core/components/tree';

export default () => (
  <Tree.Checkbox
    treeData={treeData}
    defaultExpandedKeys={['1', '2']}
    defaultSelectedKeys={['1-1']} // 只选中一个子节点，父节点显示半选状态
    onSelect={(selectedKeys, info) => {
      console.log('选中的节点:', selectedKeys);
      console.log('完全选中的节点:', info.checkedKeys);
      console.log('半选状态的节点:', info.halfCheckedKeys);
      console.log('叶子节点:', info.leafKeys);
      console.log('非叶子节点:', info.nonLeafKeys);
    }}
  />
);
```

### 严格模式（父子不联动）

```tsx
import Tree from '@/components/core/components/tree';

export default () => (
  <Tree.Checkbox
    treeData={treeData}
    checkStrictly={true} // 严格模式，父子节点选择互不影响
    defaultExpandedKeys={['1', '2']}
    defaultSelectedKeys={['1-1', '2-1']}
    onSelect={(selectedKeys, info) => {
      console.log('严格模式多选:', selectedKeys, info);
    }}
  />
);
```

### 只有叶子节点可选择

```tsx
import Tree from '@/components/core/components/tree';

export default () => (
  <Tree.Checkbox
    treeData={treeData}
    onlyLeafSelectable={true} // 只有叶子节点可以选择
    defaultExpandedKeys={['1', '2']}
    onSelect={(selectedKeys, info) => {
      console.log('叶子节点选择:', selectedKeys, info);
    }}
  />
);
```

### 限制选择数量

```tsx
import Tree from '@/components/core/components/tree';

export default () => (
  <Tree.Checkbox
    treeData={treeData}
    defaultExpandedKeys={['1', '2']}
    maxSelectCount={3} // 最多选择3个节点
    onSelect={(selectedKeys, info) => {
      console.log('选中的节点:', selectedKeys, info);
    }}
    onMaxSelectReached={(maxCount) => {
      console.log(`已达到最大选择数量: ${maxCount}`);
    }}
  />
);
```

### 受控模式

```tsx
import { useState } from 'react';
import Tree from '@/components/core/components/tree';

export default () => {
  const [selectedKeys, setSelectedKeys] = useState(['1-1']);

  return (
    <Tree.Checkbox
      treeData={treeData}
      defaultExpandedKeys={['1', '2']}
      selectedKeys={selectedKeys}
      onSelect={(keys) => setSelectedKeys(keys)}
    />
  );
};
```

## API

### Tree Props

| 参数                        | 说明          | 类型                                                                            | 默认值     |
|---------------------------|-------------|-------------------------------------------------------------------------------|---------|
| treeData                  | 树形数据        | `TreeNode[]`                                                                  | `[]`    |
| expandedKeys              | 受控展开的节点key  | `K[]`                                                                         | -       |
| defaultExpandedKeys       | 默认展开的节点key  | `K[]`                                                                         | `[]`    |
| showIcon                  | 是否显示展开/收起图标 | `boolean`                                                                     | `true`  |
| expandIcon                | 自定义展开图标     | `ReactNode`                                                                   | -       |
| collapseIcon              | 自定义收起图标     | `ReactNode`                                                                   | -       |
| indentWidth               | 缩进宽度        | `number`                                                                      | `24`    |
| onExpand                  | 展开/收起回调     | `(expandedKeys: K[], info: { expanded: boolean; node: FlattenNode }) => void` | -       |
| renderNode                | 自定义渲染节点     | `(node: FlattenNode, nodesData: NodesData) => ReactNode`                      | -       |
| className                 | 自定义类名       | `string`                                                                      | -       |
| nodeClassName             | 节点类名        | `string`                                                                      | -       |
| indentClassName           | 缩进类名        | `string`                                                                      | -       |
| switcherClassName         | 展开/收起区域类名   | `string`                                                                      | -       |
| nodeTitleContentClassName | 节点文本内容类名    | `string`                                                                      | -       |
| virtualScroll             | 是否启用虚拟滚动    | `boolean`                                                                     | `false` |

### Tree.Radio Props

继承 Tree 的所有属性(className替换treeClassName)，额外支持：

| 参数                 | 说明           | 类型                                                            | 默认值     |
|--------------------|--------------|---------------------------------------------------------------|---------|
| onlyLeafSelectable | 是否只有叶子节点可以选择 | `boolean`                                                     | `false` |
| selectedKey        | 受控选中的节点key   | `K \| null`                                                   | -       |
| defaultSelectedKey | 默认选中的节点key   | `K`                                                           | -       |
| onSelect           | 节点选择回调       | `(selectedKey: K \| null, info: { node?: TreeNode }) => void` | -       |
| allowDeselect      | 是否允许取消选择     | `boolean`                                                     | `false` |
| className          | 自定义类名        | `string`                                                      | -       |
| treeClassName      | 树的类名         | `string`                                                      | -       |

### Tree.Checkbox Props

继承 Tree 的所有属性，额外支持：

| 参数                  | 说明               | 类型                                              | 默认值     |
|---------------------|------------------|-------------------------------------------------|---------|
| checkStrictly       | 是否启用严格模式（禁用父子联动） | `boolean`                                       | `false` |
| onlyLeafSelectable  | 是否只有叶子节点可以选择     | `boolean`                                       | `false` |
| maxSelectCount      | 最大选择数量，0表示不限制    | `number`                                        | `0`     |
| selectedKeys        | 受控选中的节点keys      | `K[]`                                           | -       |
| defaultSelectedKeys | 默认选中的节点keys      | `K[]`                                           | `[]`    |
| onSelect            | 节点选择回调           | `(selectedKeys: K[], info: SelectInfo) => void` | -       |
| onMaxSelectReached  | 多选达到上限时的回调       | `(maxCount: number) => void`                    | -       |
| className           | 自定义类名            | `string`                                        | -       |

### TreeNode

```tsx
type TreeNode<K = string, T = Record<string, unknown>> = {
  /** 节点的唯一标识 */
  key: K;
  /** 节点标题 */
  title: ReactNode;
  /** 子节点 */
  children?: TreeNode<K, T>[];
  /** 是否默认展开 */
  defaultExpanded?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否可选择 */
  selectable?: boolean;
} & T;
```

### SelectInfo (Tree.Checkbox)

```tsx
type SelectInfo<K = string> = {
  /** 所有有效选中的节点keys（包括半选状态） */
  allEffectivelySelectedKeys: K[];
  /** 完全选中的节点keys */
  checkedKeys: K[];
  /** 半选状态的节点keys */
  halfCheckedKeys: K[];
  /** 叶子节点keys */
  leafKeys: K[];
  /** 非叶子节点keys */
  nonLeafKeys: K[];
};
```

### TreeRef

```tsx
type TreeRef<K = string, T = Record<string, unknown>> = {
  /** 获取扁平化的节点列表 */
  getFlattenNodes: () => FlattenNode<K, T>[];
  /** 获取所有扁平化节点映射 */
  getAllFlattenNodeMap: () => Map<K, FlattenNode<K, T>>;
  /** 获取节点映射数据 */
  getNodeMap: () => NodeMap<K, T>;
};
```

## 特性说明

### 父子联动机制

Tree.Checkbox 组件默认支持父子联动：

- **选中父节点**：自动选中所有子节点（除非子节点被禁用）
- **取消父节点**：自动取消所有子节点的选中状态
- **部分子节点选中**：父节点显示半选状态（indeterminate）
- **所有子节点选中**：父节点显示完全选中状态

### 严格模式

当 `checkStrictly={true}` 时：

- 父子节点选择互不影响
- 不会出现半选状态
- 每个节点的选中状态完全独立

### 叶子节点选择模式

当 `onlyLeafSelectable={true}` 时：

- 只有叶子节点（没有子节点的节点）可以选择
- 非叶子节点不显示选择控件，但仍可展开/收起
- 适用于只需要选择最终项目的场景

### 选择数量限制

Tree.Checkbox 支持通过 `maxSelectCount` 限制最大选择数量：

- 当达到限制时，未选中的节点会被禁用
- 触发 `onMaxSelectReached` 回调
- 已选中的节点仍可取消选择

### 虚拟滚动

支持大数据量的树形结构：

- 设置 `virtualScroll={true}` 启用
- 基于 List 组件的虚拟滚动能力
- 提升大量节点时的渲染性能

## 最佳实践

1. **数据结构设计**：确保每个节点的 `key` 唯一
2. **性能优化**：大数据量时启用虚拟滚动
3. **用户体验**：合理使用默认展开，避免层级过深
4. **状态管理**：根据需要选择受控或非受控模式
5. **样式定制**：通过 className 属性自定义样式
