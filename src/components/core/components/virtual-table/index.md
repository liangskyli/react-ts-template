# VirtualTable 虚拟表格

一个基于虚拟滚动的表格组件，用于高效渲染大量数据。

## 特性

- 支持固定列（左侧和右侧）
- 支持自定义单元格渲染
- 支持表头配置（高度、显示/隐藏、对齐方式）
- 基于虚拟滚动，性能优异

## API

### VirtualTable

| 参数               | 说明        | 类型                              | 默认值  |
|------------------|-----------|---------------------------------|------|
| columns          | 表格列的配置描述  | [ColumnConfig](#columnconfig)[] | -    |
| dataSource       | 数据数组      | Record<string, any>[]           | -    |
| headerHeight     | 表头高度      | number                          | 40   |
| showHeader       | 是否显示表头    | boolean                         | true |
| headerCellClass  | 表头单元格的类名  | string                          | -    |
| bodyCellClass    | 表体单元格的类名  | string                          | -    |

- 还支持[VirtualGrid](../virtual-grid/index.md#api)的以下属性
  - className
  - rightHeaderClass
  - rightBodyClass
  - leftHeaderClass
  - centerHeaderClass
  - leftBodyClass
  - centerBodyClass
  - hideCenterHeaderGridScrollbar
  - hideLeftBodyGridScrollbar
  - hideRightBodyGridScrollbar
  - ref
  - windowScroller

### ColumnConfig

| 参数          | 说明      | 类型                                        | 默认值 |
|-------------|---------|-------------------------------------------|-----|
| title       | 列标题     | React.ReactNode                           | -   |
| width       | 列宽度     | number                                    | -   |
| fixed       | 列是否固定   | 'left' \| 'right'                         | -   |
| render      | 自定义渲染函数 | (value, record, index) => React.ReactNode | -   |
| dataIndex   | 数据字段名   | string                                    | -   |
| align       | 数据列对齐方式 | 'left' \| 'center' \| 'right'             | -   |
| headerAlign | 列头对齐方式  | 'left' \| 'center' \| 'right'             | -   |

## 示例

```tsx
import VirtualTable from '@/components/core/components/virtual-table';

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    width: 100,
    fixed: 'left',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    width: 80,
    align: 'center',
  },
  {
    title: '操作',
    width: 100,
    fixed: 'right',
    render: (_, record) => (
      <button onClick={() => console.log(record)}>查看</button>
    ),
  },
];

const dataSource = [
  { name: '张三', age: 25 },
  { name: '李四', age: 30 },
  // ... 更多数据
];

export default () => (
  <VirtualTable
    className="h-[400px]"
    columns={columns}
    dataSource={dataSource}
    headerHeight={50}
  />
);
``` 

## 注意事项

1. 组件必须使用ClassName设置高度
2. columns 必须配置固定宽度值
