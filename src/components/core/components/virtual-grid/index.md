# VirtualGrid 虚拟网格

虚拟网格组件，用于高效渲染大量网格数据。基于 react-virtualized 的 Grid 组件实现，支持动态单元格大小和滚动位置缓存。

## 代码演示

### 基础用法

```tsx
import VirtualGrid from '@/components/core/components/virtual-grid';

export default () => (
  <VirtualGrid
    className="h-[400px]"
    rowCount={100}
    columnCount={100}
    cellRenderer={({ rowIndex, columnIndex }) => (
      <div>{`单元格 ${rowIndex}-${columnIndex}`}</div>
    )}
  />
);
```

### 固定列宽

```tsx
import VirtualGrid from '@/components/core/components/virtual-grid';

export default () => (
  <VirtualGrid
    className="h-[400px]"
    rowCount={100}
    columnCount={1}
    fixedWidth={true}
    defaultWidth={200}
    cellRenderer={({ rowIndex }) => (
      <div>{`单元格 ${rowIndex}`}</div>
    )}
  />
);
```

### 自定义单元格尺寸

```tsx
import VirtualGrid from '@/components/core/components/virtual-grid';

export default () => (
  <VirtualGrid
    className="h-[400px]"
    rowCount={100}
    columnCount={3}
    rowHeight={({ index, gridHeight }) => (index % 2 === 0 ? 60 : 40)}
    columnWidth={({ index, gridWidth }) => gridWidth / 3}
    cellRenderer={({ rowIndex, columnIndex }) => (
      <div>{`单元格 ${rowIndex}-${columnIndex}`}</div>
    )}
  />
);
```

### 滚动位置缓存

```tsx
import { useState } from 'react';
import VirtualGrid from '@/components/core/components/virtual-grid';

export default () => {
  const [scrollCache, setScrollCache] = useState(null);

  return (
    <VirtualGrid
      className="h-[400px]"
      rowCount={100}
      columnCount={100}
      cellRenderer={({ rowIndex, columnIndex }) => (
        <div>{`单元格 ${rowIndex}-${columnIndex}`}</div>
      )}
      getPositionCache={(cache) => setScrollCache(cache)}
    />
  );
};
```

### 固定行列

```tsx
import VirtualGrid from '@/components/core/components/virtual-grid';

export default () => (
  <VirtualGrid
    className="h-[400px]"
    rowCount={100}
    columnCount={100}
    cellRenderer={({ rowIndex, columnIndex }) => (
      <div style={{
        backgroundColor: rowIndex < 2 || columnIndex < 2 ? '#f0f0f0' : 'white',
        border: '1px solid #ddd',
        padding: '8px'
      }}>
        {`单元格 ${rowIndex}-${columnIndex}`}
      </div>
    )}
    fixedTopRowCount={2}
    fixedLeftColumnCount={2}
    fixedRightColumnCount={1}
  />
);
```

### 使用引用

```tsx
import { useRef } from 'react';
import VirtualGrid from '@/components/core/components/virtual-grid';
import type { VirtualGridRef } from '@/components/core/components/virtual-grid';

export default () => {
  const gridRef = useRef<VirtualGridRef>();

  const handleScrollToCell = () => {
    gridRef.current?.scrollToCell(50, 50);
  };

  return (
    <div>
      <button onClick={handleScrollToCell}>滚动到单元格 (50, 50)</button>
      <VirtualGrid
        className="h-[400px]"
        ref={gridRef}
        rowCount={100}
        columnCount={100}
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div>{`单元格 ${rowIndex}-${columnIndex}`}</div>
        )}
      />
    </div>
  );
};
```

## API

### Props

| 属性                              | 说明                                                    | 类型                                                                      | 默认值      |
|---------------------------------|-------------------------------------------------------|-------------------------------------------------------------------------|----------|
| `cellRenderer`                  | 单元格渲染函数                                               | `(props: GridCellProps, measure: () => void) => React.ReactNode`        | -        |
| `rowCount`                      | 行数                                                    | `number`                                                                | -        |
| `columnCount`                   | 列数                                                    | `number`                                                                | -        |
| `defaultWidth`                  | 单元格默认宽度                                               | `number`                                                                | `100`    |
| `minWidth`                      | 单元格最小宽度                                               | `number`                                                                | -        |
| `defaultHeight`                 | 单元格默认高度                                               | `number`                                                                | `30`     |
| `minHeight`                     | 单元格最小高度                                               | `number`                                                                | -        |
| `fixedWidth`                    | 是否固定宽度                                                | `boolean`                                                               | `false`  |
| `fixedHeight`                   | 是否固定高度                                                | `boolean`                                                               | `false`  |
| `ref`                           | VirtualGrid 组件的引用                                     | `Ref<VirtualGridRef>`                                                   | -        |
| `rowHeight`                     | 行高函数                                                  | `number \| ((params: { index: number; gridHeight: number }) => number)` | -        |
| `columnWidth`                   | 列宽函数                                                  | `number \| ((params: { index: number; gridWidth: number }) => number)`  | -        |
| `getPositionCache`              | 获取滚动位置缓存的回调函数                                         | `(cache: PositionCacheData) => void`                                    | -        |
| `fixedTopRowCount`              | 固定的顶部行数                                               | `number`                                                                | `0`      |
| `fixedLeftColumnCount`          | 固定的左侧列数                                               | `number`                                                                | `0`      |
| `fixedRightColumnCount`         | 固定的右侧列数                                               | `number`                                                                | `0`      |
| `hideCenterHeaderGridScrollbar` | 是否隐藏中间表头区域的滚动条                                        | `boolean`                                                               | `false`  |
| `hideLeftBodyGridScrollbar`     | 是否隐藏左侧区域的滚动条                                          | `boolean`                                                               | `false`  |
| `hideRightBodyGridScrollbar`    | 是否隐藏右侧区域的滚动条                                          | `boolean`                                                               | `false`  |
| `className`                     | 容器的类名                                                 | `string`                                                                | -        |
| `leftHeaderClass`               | 左上角表头的类名                                              | `string`                                                                | -        |
| `centerHeaderClass`             | 中间表头的类名                                               | `string`                                                                | -        |
| `rightHeaderClass`              | 右上角表头的类名                                              | `string`                                                                | -        |
| `leftBodyClass`                 | 左边区域的类名                                               | `string`                                                                | -        |
| `centerBodyClass`               | 中间区域的类名                                               | `string`                                                                | -        |
| `rightBodyClass`                | 右边区域的类名                                               | `string`                                                                | -        |
| `scrollToAlignment`             | 滚动对齐方式                                                | `'auto' \| 'start' \| 'center' \| 'end'`                                | `'end'`  |
| `scrollToRow`                   | 滚动到指定行                                                | `number`                                                                | `-1`     |
| `scrollToColumn`                | 滚动到指定列                                                | `number`                                                                | `-1`     |
| `autoContainerWidth`            | 是否自动设置容器宽度                                            | `boolean`                                                               | -        |
| `windowScroller`                | 是否使用WindowScroller,此组件目前不适用于设置fixed行列,此组件目前不适用于水平滚动网格 | `IWindowScroller`                                                       | `window` |

### VirtualGridRef 方法

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| `measureAllCells` | 预先测量网格中的所有列和行 | `() => void` |
| `recomputeGridSize` | 重新计算网格大小 | `(params?: { columnIndex?: number; rowIndex?: number }) => void` |
| `scrollToCell` | 滚动到指定单元格 | `(rowIndex: number, columnIndex: number) => void` |
| `scrollToPosition` | 滚动到指定位置 | `(params: { scrollLeft: number; scrollTop: number }) => void` |
| `getCache` | 获取缓存测量数据 | `() => CellMeasurerCache` |

### windowScroller 类型

- 此组件目前不适用于设置fixed行列
- 此组件目前不适用于水平滚动网格，因为水平滚动会重置内部滚动顶部

```ts
type IWindowScroller =
  | boolean
  | {
      /** 滚动元素,用于附加滚动事件侦听器的元素。默认为window */
      scrollElement?: typeof window | Element | undefined;
    };
```

此外，组件还支持部分 react-virtualized Grid 组件的属性。

## 性能优化

VirtualGrid 组件使用了以下策略来优化性能：

1. **虚拟滚动**：只渲染可视区域内的单元格，大幅减少 DOM 节点数量
2. **单元格测量缓存**：使用 CellMeasurerCache 缓存单元格尺寸，避免重复测量
3. **滚动位置缓存**：支持缓存滚动位置，便于恢复之前的浏览位置
4. **固定尺寸优化**：当单元格尺寸固定时，可以通过 `fixedWidth` 和 `fixedHeight` 提升性能

## 注意事项

1. 组件必须使用ClassName设置高度
2. 如果单元格高度不固定，建议提供合适的 `defaultHeight` 和 `minHeight` 值
3. 单列模式下会自动启用 `fixedWidth` 和 `autoContainerWidth`
4. 如果需要手动控制网格滚动，可以使用 `ref` 获取 Grid 实例
5. 使用 `measure` 函数可以在动态内容变化时重新测量单元格尺寸