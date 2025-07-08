import React, { useImperativeHandle, useRef } from 'react';
import type { GridCellProps, GridProps } from 'react-virtualized';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  Grid,
} from 'react-virtualized';
import type { CellMeasurerChildProps } from 'react-virtualized/dist/es/CellMeasurer';

export type VirtualGridProps = {
  /** 单元格渲染函数 */
  renderItem: (props: {
    rowIndex: number;
    columnIndex: number;
    measure: CellMeasurerChildProps['measure'];
  }) => React.ReactNode;
  /** 单元格默认宽度 */
  defaultWidth?: number;
  /** 单元格最小宽度 */
  minWidth?: number;
  /** 单元格默认高度 */
  defaultHeight?: number;
  /** 单元格最小高度 */
  minHeight?: number;
  /** 是否固定宽度 */
  fixedWidth?: boolean;
  /** 是否固定高度 */
  fixedHeight?: boolean;
  /** grid的ref引用 */
  ref?: React.Ref<Grid>;
  /** 缓存的ref引用 */
  cacheRef?: React.Ref<CellMeasurerCache>;
  /** 行高函数 */
  rowHeight?: (params: { index: number; gridHeight: number }) => number;
  /** 列宽函数 */
  columnWidth?: (params: { index: number; gridWidth: number }) => number;
} & Pick<
  GridProps,
  | 'onScroll'
  | 'onSectionRendered'
  | 'scrollToAlignment'
  | 'scrollToRow'
  | 'scrollToColumn'
  | 'rowCount'
  | 'columnCount'
  | 'autoContainerWidth'
>;

const VirtualGrid = (props: VirtualGridProps) => {
  const {
    renderItem,
    defaultWidth,
    minWidth,
    defaultHeight,
    minHeight,
    fixedWidth,
    fixedHeight,
    ref,
    cacheRef,
    columnCount,
    autoContainerWidth,
    rowHeight,
    columnWidth,
    ...gridOtherProps
  } = props;

  const isOneColumn = columnCount === 1;

  // 创建测量缓存
  const cache = useRef(
    new CellMeasurerCache({
      defaultWidth: defaultWidth,
      minWidth: minWidth,
      defaultHeight: defaultHeight,
      minHeight: minHeight,
      fixedWidth: fixedWidth ?? isOneColumn,
      fixedHeight: fixedHeight,
      keyMapper: (rowIndex, columnIndex) => `${rowIndex}-${columnIndex}`,
    }),
  );

  useImperativeHandle<CellMeasurerCache, CellMeasurerCache>(cacheRef, () => {
    return cache.current;
  });

  // 包装单元格渲染函数
  const cellRenderer = (props: GridCellProps) => {
    const { columnIndex, key, rowIndex, parent, style } = props;
    const itemRender = (opts: CellMeasurerChildProps) => {
      const { registerChild, measure } = opts;
      return (
        <div ref={registerChild} style={style}>
          {renderItem({ rowIndex, columnIndex, measure })}
        </div>
      );
    };
    return (
      <CellMeasurer
        cache={cache.current}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
        {(cellMeasurerChildProps) => itemRender(cellMeasurerChildProps)}
      </CellMeasurer>
    );
  };

  return (
    <AutoSizer>
      {({ width, height }) => (
        <Grid
          ref={ref}
          cellRenderer={cellRenderer}
          width={width}
          height={height}
          rowHeight={({ index }) => {
            if (rowHeight) {
              return rowHeight({ index, gridHeight: height });
            }
            return cache.current.rowHeight({ index });
          }}
          columnWidth={({ index }) => {
            if (columnWidth) {
              return columnWidth({ index, gridWidth: width });
            }
            return isOneColumn ? width : cache.current.columnWidth({ index });
          }}
          columnCount={columnCount}
          autoContainerWidth={autoContainerWidth ?? isOneColumn}
          deferredMeasurementCache={cache.current}
          {...gridOtherProps}
        />
      )}
    </AutoSizer>
  );
};

export default VirtualGrid;
