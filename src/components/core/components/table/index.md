# Table 组件实现总结

## 概述

基于 react-virtualized 实现的高性能表格组件，支持虚拟滚动、列固定等功能，适用于大数据量展示场景。

## 核心特性

### ✅ 已实现功能

1. **虚拟滚动**
   - 基于 react-virtualized 的 MultiGrid 组件
   - 支持大数据量渲染（测试支持 1000+ 行数据）
   - 自动计算行高和列宽

2. **列固定**
   - 支持左侧固定列（`fixed: 'left'`）
   - 支持右侧固定列（`fixed: 'right'`）
   - 固定列独立滚动，性能优化

3. **表头支持**
   - 可配置是否显示表头（`showHeader`）
   - 支持自定义表头高度（`headerHeight`）
   - 表头与数据行分离渲染

4. **自定义渲染**
   - 支持列自定义渲染函数（`render`）
   - 支持数据字段映射（`dataIndex`）
   - 支持列对齐方式配置

5. **行交互**
   - 行点击事件（`onRowClick`）
   - 行双击事件（`onRowDoubleClick`）
   - 行选择功能（`rowSelection`）

6. **样式定制**
   - 基于 TailwindCSS 的样式系统
   - 支持自定义类名（`className`）
   - 响应式设计

## 文件结构

```
src/components/core/components/table/
├── index.tsx              # 主组件入口
├── virtual-table.tsx      # 虚拟表格核心实现
├── class-config.ts        # 样式配置
├── index.md              # 组件文档
└── README.md             # 实现总结
```

## 技术实现

### 核心依赖
- `react-virtualized`: 虚拟滚动核心库
- `class-variance-authority`: 样式变体管理
- `tailwind-merge`: TailwindCSS 类名合并

### 关键组件
- **MultiGrid**: react-virtualized 的多网格组件，支持固定行列
- **AutoSizer**: 自动计算容器尺寸
- **CellRenderer**: 单元格渲染函数

### 性能优化
1. **虚拟滚动**: 只渲染可视区域内的单元格
2. **固定列优化**: 固定列独立渲染，避免全表重绘
3. **缓存机制**: 使用 useCallback 缓存渲染函数
4. **样式优化**: 使用 CSS-in-JS 避免样式重复计算

## 使用示例

### 基础用法
```tsx
import Table from '@/components/core/components/table';

const columns = [
  { key: 'name', title: '姓名', dataIndex: 'name', width: 120 },
  { key: 'age', title: '年龄', dataIndex: 'age', width: 80 },
];

const dataSource = [
  { key: '1', name: '张三', age: 32 },
  { key: '2', name: '李四', age: 28 },
];

<Table columns={columns} dataSource={dataSource} />
```

### 固定列
```tsx
const columns = [
  { key: 'name', title: '姓名', dataIndex: 'name', width: 120, fixed: 'left' },
  { key: 'action', title: '操作', width: 100, fixed: 'right' },
];
```

### 大数据量
```tsx
const dataSource = Array.from({ length: 10000 }, (_, i) => ({ key: i, name: `用户${i}` }));

<Table 
  columns={columns} 
  dataSource={dataSource}
  className="h-[500px]"
/>
```

## 测试覆盖

- ✅ 基础渲染测试
- ✅ 表头渲染测试
- ✅ 数据渲染测试
- ✅ 自定义渲染测试
- ✅ 固定列测试
- ✅ 空数据处理测试
- ✅ 自定义样式测试

## 访问演示

开发服务器启动后，访问：`http://localhost:5174/sub/test/table`

## 后续优化建议

1. **行选择功能增强**
   - 支持全选/反选
   - 支持复选框列
   - 支持选择状态持久化

2. **排序功能**
   - 列头点击排序
   - 多列排序支持
   - 自定义排序函数

3. **筛选功能**
   - 列筛选器
   - 搜索功能
   - 高级筛选

4. **导出功能**
   - CSV 导出
   - Excel 导出
   - 打印支持

5. **可编辑表格**
   - 单元格编辑
   - 行编辑模式
   - 表单验证

## 注意事项

1. 使用虚拟滚动时，必须为每列设置固定的 `width`
2. 表格容器需要有明确的高度
3. 固定列会影响水平滚动体验，建议合理设置固定列数量
4. 大数据量场景下，避免在 `render` 函数中进行复杂计算
