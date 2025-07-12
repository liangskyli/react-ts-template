import React, { useImperativeHandle, useRef, useState } from 'react';
import type { GridCellProps, GridProps, ScrollParams} from 'react-virtualized';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  Grid,
} from 'react-virtualized';
import type { CellMeasurerChildProps } from 'react-virtualized/dist/es/CellMeasurer';
import type { SectionRenderedParams } from 'react-virtualized/dist/es/Grid';

type PositionCacheData = {
  params: ScrollParams;
  virtualScrollInfo: SectionRenderedParams;
};
export type VirtualGridProps = {
  /** 单元格渲染函数 */
  renderItem: (
    props: Pick<GridCellProps, 'rowIndex' | 'columnIndex' | 'isScrolling'> & {
      measure: CellMeasurerChildProps['measure'];
    },
  ) => React.ReactNode;
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
  /** 行高函数*/
  rowHeight?: number | ((params: { index: number; gridHeight: number }) => number);
  /** 列宽函数 */
  columnWidth?: number | ((params: { index: number; gridWidth: number }) => number);
  /** 获取滚动位置，可用于缓存 */
  getPositionCache?: (cache: PositionCacheData) => void;
} & Pick<
  GridProps,
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
    getPositionCache,
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
    const { columnIndex, key, rowIndex, parent, style, isScrolling } = props;
    const itemRender = (opts: CellMeasurerChildProps) => {
      const { registerChild, measure } = opts;
      return (
        <div ref={registerChild} style={style}>
          {renderItem({ rowIndex, columnIndex, isScrolling, measure })}
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

  const isVirtualizedScrollMounted = useRef(false);
  const [virtualScrollInfo, setVirtualScrollInfo] =
    useState<SectionRenderedParams>();
  const onScroll: GridProps['onScroll'] = (params) => {
    if (isVirtualizedScrollMounted.current && virtualScrollInfo) {
      // first scroll, not use getCache
      getPositionCache?.({
        params,
        virtualScrollInfo,
      });
    }
    if (virtualScrollInfo) {
      isVirtualizedScrollMounted.current = true;
    }
  };

  return (
    <AutoSizer>
      {({ width, height }) => (
        <Grid
          {...gridOtherProps}
          ref={ref}
          cellRenderer={cellRenderer}
          width={width}
          height={height}
          rowHeight={({ index }) => {
            if (rowHeight) {
              if(typeof rowHeight === 'function') {
                return rowHeight({ index, gridHeight: height });
              } else {
                return rowHeight;
              }
            }
            return cache.current.rowHeight({ index });
          }}
          columnWidth={({ index }) => {
            if (columnWidth) {
              if(typeof columnWidth === 'function') {
                return columnWidth({ index, gridWidth: width });
              } else {
                return columnWidth;
              }
            }
            return isOneColumn ? width : cache.current.columnWidth({ index });
          }}
          columnCount={columnCount}
          autoContainerWidth={autoContainerWidth ?? isOneColumn}
          deferredMeasurementCache={cache.current}
          onScroll={onScroll}
          onSectionRendered={(info) => {
            setVirtualScrollInfo(info);
          }}
        />
      )}
    </AutoSizer>
  );
};

export default VirtualGrid;
