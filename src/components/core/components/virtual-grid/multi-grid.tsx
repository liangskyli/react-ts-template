import React, { useImperativeHandle, useRef, useState } from 'react';
import type { GridCellProps, ScrollParams } from 'react-virtualized';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  MultiGrid,
} from 'react-virtualized';
import type { CellMeasurerChildProps } from 'react-virtualized/dist/es/CellMeasurer';
import type { SectionRenderedParams } from 'react-virtualized/dist/es/Grid';
import type { MultiGridProps as RVMultiGridProps } from 'react-virtualized/dist/es/MultiGrid';

type PositionCacheData = {
  params: ScrollParams;
  virtualScrollInfo: SectionRenderedParams;
};

export type VirtualMultiGridProps = {
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
  ref?: React.Ref<MultiGrid>;
  /** 缓存的ref引用 */
  cacheRef?: React.Ref<CellMeasurerCache>;
  /** 行高函数, 固定高度时使用*/
  rowHeight?: (params: { index: number; gridHeight: number }) => number;
  /** 列宽函数 */
  columnWidth?: (params: { index: number; gridWidth: number }) => number;
  /** 获取滚动位置，可用于缓存 */
  getPositionCache?: (cache: PositionCacheData) => void;
  /** 固定的顶部行数 */
  fixedRowCount?: number;
  /** 固定的左侧列数 */
  fixedColumnCount?: number;
  /** 是否启用固定列的主动滚动 */
  enableFixedColumnScroll?: boolean;
  /** 是否启用固定行的主动滚动 */
  enableFixedRowScroll?: boolean;
  /** 是否隐藏右上角的滚动条 */
  hideTopRightGridScrollbar?: boolean;
  /** 是否隐藏左下角的滚动条 */
  hideBottomLeftGridScrollbar?: boolean;
} & Pick<
  RVMultiGridProps,
  | 'scrollToAlignment'
  | 'scrollToRow'
  | 'scrollToColumn'
  | 'rowCount'
  | 'columnCount'
  | 'autoContainerWidth'
>;

const VirtualMultiGrid = (props: VirtualMultiGridProps) => {
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
    fixedRowCount = 0,
    fixedColumnCount = 0,
    enableFixedColumnScroll = true,
    enableFixedRowScroll = true,
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
  const onScroll: RVMultiGridProps['onScroll'] = (params) => {
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
        <MultiGrid
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
          onScroll={onScroll}
          onSectionRendered={(info) => {
            setVirtualScrollInfo(info);
          }}
          fixedRowCount={fixedRowCount}
          fixedColumnCount={fixedColumnCount}
          enableFixedColumnScroll={enableFixedColumnScroll}
          enableFixedRowScroll={enableFixedRowScroll}
          {...gridOtherProps}
        />
      )}
    </AutoSizer>
  );
};

export default VirtualMultiGrid;
