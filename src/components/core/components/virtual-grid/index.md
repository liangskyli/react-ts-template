# VirtualGrid 虚拟网格

虚拟网格组件，用于高效渲染大量网格数据。基于 react-virtualized 的 Grid 组件实现，支持动态单元格大小和滚动位置缓存。

## 代码演示

### 基础用法

```tsx
import VirtualGrid from '@/components/core/components/virtual-grid';

export default () => (
  <div style={{ height: '400px' }}>
    <VirtualGrid
      rowCount={100}
      columnCount={100}
      renderItem={({ rowIndex, columnIndex }) => (
        <div>{`单元格 ${rowIndex}-${columnIndex}`}</div>
      )}
    />
  </div>
);
```

### 固定列宽

```tsx
import VirtualGrid from '@/components/core/components/virtual-grid';

export default () => (
  <div style={{ height: '400px' }}>
    <VirtualGrid
      rowCount={100}
      columnCount={1}
      fixedWidth={true}
      defaultWidth={200}
      renderItem={({ rowIndex }) => (
        <div>{`单元格 ${rowIndex}`}</div>
      )}
    />
  </div>
);
```

### 自定义单元格尺寸

```tsx
import VirtualGrid from '@/components/core/components/virtual-grid';

export default () => (
  <div style={{ height: '400px' }}>
    <VirtualGrid
      rowCount={100}
      columnCount={3}
      rowHeight={({ index, gridHeight }) => (index % 2 === 0 ? 60 : 40)}
      columnWidth={({ index, gridWidth }) => gridWidth / 3}
      renderItem={({ rowIndex, columnIndex }) => (
        <div>{`单元格 ${rowIndex}-${columnIndex}`}</div>
      )}
    />
  </div>
);
```

### 滚动位置缓存

```tsx
import { useState } from 'react';
import VirtualGrid from '@/components/core/components/virtual-grid';

export default () => {
  const [scrollCache, setScrollCache] = useState(null);

  return (
    <div style={{ height: '400px' }}>
      <VirtualGrid
        rowCount={100}
        columnCount={100}
        renderItem={({ rowIndex, columnIndex }) => (
          <div>{`单元格 ${rowIndex}-${columnIndex}`}</div>
        )}
        getPositionCache={(cache) => setScrollCache(cache)}
      />
    </div>
  );
};
```

### 使用引用

```tsx
import { useRef } from 'react';
import VirtualGrid from '@/components/core/components/virtual-grid';
import type { Grid, CellMeasurerCache } from 'react-virtualized';

export default () => {
  const gridRef = useRef<Grid>();
  const cacheRef = useRef<CellMeasurerCache>();

  return (
    <div style={{ height: '400px' }}>
      <VirtualGrid
        ref={gridRef}
        cacheRef={cacheRef}
        rowCount={100}
        columnCount={100}
        renderItem={({ rowIndex, columnIndex }) => (
          <div>{`单元格 ${rowIndex}-${columnIndex}`}</div>
        )}
      />
    </div>
  );
};
```

## API

### Props

| 属性 | 说明 | 类型                                                                                                           | 默认值 |
| --- | --- |--------------------------------------------------------------------------------------------------------------| --- |
| `renderItem` | 单元格渲染函数 | `(props: { rowIndex: number; columnIndex: number; isScrolling: boolean; measure: () => void }) => ReactNode` | - |
| `rowCount` | 行数 | `number`                                                                                                     | - |
| `columnCount` | 列数 | `number`                                                                                                     | - |
| `defaultWidth` | 单元格默认宽度 | `number`                                                                                                     | - |
| `minWidth` | 单元格最小宽度 | `number`                                                                                                     | - |
| `defaultHeight` | 单元格默认高度 | `number`                                                                                                     | - |
| `minHeight` | 单元格最小高度 | `number`                                                                                                     | - |
| `fixedWidth` | 是否固定宽度 | `boolean`                                                                                                    | `false` |
| `fixedHeight` | 是否固定高度 | `boolean`                                                                                                    | `false` |
| `ref` | Grid 组件的引用 | `Ref<Grid>`                                                                                                  | - |
| `cacheRef` | 缓存的引用 | `Ref<CellMeasurerCache>`                                                                                     | - |
| `rowHeight` | 行高函数 | `number \| ((params: { index: number; gridHeight: number }) => number)`                                      | - |
| `columnWidth` | 列宽函数 | `number \| ((params: { index: number; gridWidth: number }) => number)`                                       | - |
| `getPositionCache` | 获取滚动位置缓存的回调函数 | `(cache: PositionCacheData) => void`                                                                         | - |
| `scrollToAlignment` | 滚动对齐方式 | `'auto' \| 'start' \| 'center' \| 'end'`                                                                     | - |
| `scrollToRow` | 滚动到指定行 | `number`                                                                                                     | - |
| `scrollToColumn` | 滚动到指定列 | `number`                                                                                                     | - |
| `autoContainerWidth` | 是否自动设置容器宽度 | `boolean`                                                                                                    | - |

此外，组件还支持部分 react-virtualized Grid 组件的属性。

## 性能优化

VirtualGrid 组件使用了以下策略来优化性能：

1. **虚拟滚动**：只渲染可视区域内的单元格，大幅减少 DOM 节点数量
2. **单元格测量缓存**：使用 CellMeasurerCache 缓存单元格尺寸，避免重复测量
3. **滚动位置缓存**：支持缓存滚动位置，便于恢复之前的浏览位置
4. **固定尺寸优化**：当单元格尺寸固定时，可以通过 `fixedWidth` 和 `fixedHeight` 提升性能

## 注意事项

1. 组件必须包裹在具有确定高度的容器中
2. 如果单元格高度不固定，建议提供合适的 `defaultHeight` 和 `minHeight` 值
3. 单列模式下会自动启用 `fixedWidth` 和 `autoContainerWidth`
4. 使用 `getPositionCache` 时，首次滚动不会触发回调，从第二次滚动开始生效
5. 如果需要手动控制网格滚动，可以使用 `ref` 获取 Grid 实例
6. 使用 `measure` 函数可以在动态内容变化时重新测量单元格尺寸 