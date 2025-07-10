import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  GridCellRenderer,
  GridProps,
  ScrollParams,
} from 'react-virtualized';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  Grid,
} from 'react-virtualized';
import type { SectionRenderedParams } from 'react-virtualized/dist/es/Grid';
import type { MultiGridProps as RVMultiGridProps } from 'react-virtualized/dist/es/MultiGrid';
import CellMeasurerCacheDecorator from '@/components/core/components/virtual-grid/cell-measurer-cache-decorator.ts';

/* eslint-disable react/prop-types */

export type MultiGrid2Ref = {
  /** 滚动到指定行 */
  scrollToRow: (rowIndex: number) => void;
  /** 滚动到指定列 */
  scrollToColumn: (columnIndex: number) => void;
  /** 重新计算网格大小 */
  recomputeGridSize: () => void;
  /** 缓存测量数据 */
  cacheRef: () => CellMeasurerCache;
};
type PositionCacheData = {
  params: ScrollParams;
  virtualScrollInfo: SectionRenderedParams;
};
export type MultiGrid2Props = {
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
  ref?: React.Ref<MultiGrid2Ref>;
  /** 行高函数*/
  rowHeight?:
    | number
    | ((params: { index: number; gridHeight: number }) => number);
  /** 列宽函数 */
  columnWidth?:
    | number
    | ((params: { index: number; gridWidth: number }) => number);
  /** 获取滚动位置，可用于缓存 */
  getPositionCache?: (cache: PositionCacheData) => void;
  /** 固定的顶部行数 */
  fixedTopRowCount?: number;
  /** 固定的左侧列数 */
  fixedLeftColumnCount?: number;
  /** 固定的右侧列数 */
  fixedRightColumnCount?: number;
  /** 滚动到指定行 */
  scrollToRow?: number;
  /** 滚动到指定列 */
  scrollToColumn?: number;
  /** 行数 */
  rowCount: number;
  /** 列数 */
  columnCount: number;
  /** 单元格渲染函数 */
  cellRenderer: GridCellRenderer;
};

type Position =
  | 'LeftHeader'
  | 'CenterHeader'
  | 'RightHeader'
  | 'LeftBody'
  | 'CenterBody'
  | 'RightBody';

const MultiGrid2 = (props: MultiGrid2Props) => {
  const {
    defaultWidth,
    minWidth,
    defaultHeight,
    minHeight,
    fixedWidth,
    fixedHeight,
    ref,
    rowHeight,
    columnWidth,
    getPositionCache,
    fixedTopRowCount = 0,
    fixedLeftColumnCount = 0,
    fixedRightColumnCount = 0,
    scrollToRow = -1,
    scrollToColumn = -1,
    rowCount,
    columnCount,
    cellRenderer,
  } = props;

  // head Grid引用
  const leftHeaderGridRef = useRef<Grid>(null);
  const centerHeaderGridRef = useRef<Grid>(null);
  const rightHeaderGridRef = useRef<Grid>(null);

  // body Grid引用
  const leftBodyGridRef = useRef<Grid>(null);
  const centerBodyGridRef = useRef<Grid>(null);
  const rightBodyGridRef = useRef<Grid>(null);

  // 跟踪滚动位置
  const [scrollPositionData, setScrollPositionData] = useState<{
    scrollTop: number;
    scrollLeft: number;
    scrollPosition: Position;
  }>({ scrollTop: 0, scrollLeft: 0, scrollPosition: 'CenterBody' });
  const scrollPositionRef = useRef<{
    scrollTop: number;
    scrollLeft: number;
    scrollPosition: Position;
  }>({ scrollTop: 0, scrollLeft: 0, scrollPosition: 'CenterBody' });

  // 中间区域的列数
  const centerColumnCount = useMemo(() => {
    return Math.max(
      columnCount - fixedLeftColumnCount - fixedRightColumnCount,
      0,
    );
  }, [columnCount, fixedLeftColumnCount, fixedRightColumnCount]);

  /*// 垂直滚动同步处理 - 从中间区域同步到固定列
  const handleCenterVerticalScroll = (params: {
    scrollTop: number;
    scrollLeft?: number;
  }) => {
    const { scrollTop, scrollLeft } = params;
    scrollPositionRef.current.scrollTop = scrollTop;
    if (scrollLeft !== undefined) {
      scrollPositionRef.current.scrollLeft = scrollLeft;
    }

    // 同步所有数据Grid的垂直滚动
    if (leftBodyGridRef.current) {
      leftBodyGridRef.current.scrollToPosition({ scrollLeft: 0, scrollTop });
    }
    if (rightBodyGridRef.current) {
      rightBodyGridRef.current.scrollToPosition({ scrollLeft: 0, scrollTop });
    }
  };*/

  // 垂直滚动同步处理 - 从左侧固定列同步到其他区域
  /*const handleLeftVerticalScroll = (params: { scrollTop: number }) => {
    const { scrollTop } = params;
    scrollPositionRef.current.scrollTop = scrollTop;

    // 同步中间和右侧数据Grid的垂直滚动
    if (centerBodyGridRef.current) {
      centerBodyGridRef.current.scrollToPosition({
        scrollLeft: scrollPositionRef.current.scrollLeft,
        scrollTop,
      });
    }
    if (rightBodyGridRef.current) {
      rightBodyGridRef.current.scrollToPosition({ scrollLeft: 0, scrollTop });
    }
  };

  // 垂直滚动同步处理 - 从右侧固定列同步到其他区域
  const handleRightVerticalScroll = (params: { scrollTop: number }) => {
    const { scrollTop } = params;
    scrollPositionRef.current.scrollTop = scrollTop;

    // 同步中间和左侧数据Grid的垂直滚动
    if (centerBodyGridRef.current) {
      centerBodyGridRef.current.scrollToPosition({
        scrollLeft: scrollPositionRef.current.scrollLeft,
        scrollTop,
      });
    }
    if (leftBodyGridRef.current) {
      leftBodyGridRef.current.scrollToPosition({ scrollLeft: 0, scrollTop });
    }
  };

  // 水平滚动同步处理 - 从中间区域同步到表头
  const handleCenterHorizontalScroll = (params: { scrollLeft: number }) => {
    const { scrollLeft } = params;
    scrollPositionRef.current.scrollLeft = scrollLeft;

    // 同步表头的水平滚动
    if (centerHeaderGridRef.current) {
      centerHeaderGridRef.current.scrollToPosition({
        scrollLeft,
        scrollTop: 0,
      });
    }
  };

  // 水平滚动同步处理 - 从表头同步到数据区域
  const handleHeaderHorizontalScroll = (params: { scrollLeft: number }) => {
    const { scrollLeft } = params;
    scrollPositionRef.current.scrollLeft = scrollLeft;

    // 同步数据区域的水平滚动
    if (centerBodyGridRef.current) {
      centerBodyGridRef.current.scrollToPosition({
        scrollLeft,
        scrollTop: scrollPositionRef.current.scrollTop,
      });
    }
  };*/

  const isOneColumn = columnCount === 1;

  // 创建缓存对象
  const gridCache = useRef(
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

  const deferredMeasurementCacheGrid = useCallback(
    (position: Position) => {
      let columnIndexOffset = 0;
      let rowIndexOffset = 0;
      if (position === 'CenterHeader') {
        columnIndexOffset = fixedLeftColumnCount;
      }
      if (position === 'RightHeader') {
        columnIndexOffset = fixedLeftColumnCount + centerColumnCount;
      }
      if (position === 'LeftBody') {
        rowIndexOffset = fixedTopRowCount;
      }
      if (position === 'CenterBody') {
        rowIndexOffset = fixedTopRowCount;
        columnIndexOffset = fixedLeftColumnCount;
      }
      if (position === 'RightBody') {
        rowIndexOffset = fixedTopRowCount;
        columnIndexOffset = fixedLeftColumnCount + centerColumnCount;
      }

      return new CellMeasurerCacheDecorator({
        cellMeasurerCache: gridCache.current,
        columnIndexOffset,
        rowIndexOffset,
      });
    },
    [centerColumnCount, fixedLeftColumnCount, fixedTopRowCount],
  );

  const getGridColumnWidth = useCallback(
    (params: { index: number; gridWidth: number; position: Position }) => {
      const { index, gridWidth, position } = params;
      if (columnWidth) {
        if (typeof columnWidth === 'function') {
          return columnWidth({ index, gridWidth });
        } else {
          return columnWidth;
        }
      }
      return isOneColumn
        ? gridWidth
        : deferredMeasurementCacheGrid(position).columnWidth({ index });
    },
    [columnWidth, deferredMeasurementCacheGrid, isOneColumn],
  );

  const getGridRowHeight = useCallback(
    (params: { index: number; gridHeight: number; position: Position }) => {
      const { index, gridHeight, position } = params;
      if (rowHeight) {
        if (typeof rowHeight === 'function') {
          return rowHeight({ index, gridHeight });
        } else {
          return rowHeight;
        }
      }
      return deferredMeasurementCacheGrid(position).rowHeight({ index });
    },
    [deferredMeasurementCacheGrid, rowHeight],
  );

  const getGridWidth = useCallback(
    (gridWidth: number) => {
      let leftGridWidth = 0;
      let rightGridWidth = 0;
      for (let index = 0; index < fixedLeftColumnCount; index++) {
        leftGridWidth += getGridColumnWidth({
          index,
          gridWidth,
          position: 'LeftHeader',
        });
      }
      for (let index = 0; index < fixedRightColumnCount; index++) {
        rightGridWidth += getGridColumnWidth({
          index,
          gridWidth,
          position: 'RightHeader',
        });
      }

      const centerGridWidth = gridWidth - leftGridWidth - rightGridWidth;

      return { leftGridWidth, centerGridWidth, rightGridWidth };
    },
    [fixedLeftColumnCount, fixedRightColumnCount, getGridColumnWidth],
  );

  const getGridHeight = useCallback(
    (gridHeight: number) => {
      let headerGridHeight = 0;
      for (let index = 0; index < fixedTopRowCount; index++) {
        headerGridHeight += getGridRowHeight({
          index,
          gridHeight,
          position: 'CenterHeader',
        });
      }
      const bodyGridHeight = gridHeight - headerGridHeight;

      return { headerGridHeight, bodyGridHeight };
    },
    [fixedTopRowCount, getGridRowHeight],
  );

  // 创建单元格渲染器
  const getGridCellRenderer = (position: Position) => {
    const customCellRenderer: GridCellRenderer = (props) => {
      const { key, parent, style, isScrolling, isVisible } = props;
      let columnIndex = props.columnIndex;
      let rowIndex = props.rowIndex;
      if (position.startsWith('Center')) {
        columnIndex = columnIndex + fixedLeftColumnCount;
      }
      if (position.startsWith('Right')) {
        columnIndex = columnIndex + fixedLeftColumnCount + centerColumnCount;
      }
      if (position.endsWith('Body')) {
        rowIndex = rowIndex + fixedTopRowCount;
      }
      return (
        <CellMeasurer
          cache={gridCache.current}
          columnIndex={columnIndex}
          key={key}
          parent={parent}
          rowIndex={rowIndex}
        >
          {({ registerChild }) => (
            <div ref={registerChild} style={style}>
              {cellRenderer({
                columnIndex,
                rowIndex,
                style,
                key,
                parent,
                isScrolling,
                isVisible,
              })}
            </div>
          )}
        </CellMeasurer>
      );
    };
    return customCellRenderer;
  };

  const isVirtualizedScrollMounted = useRef(false);
  const [virtualScrollInfo, setVirtualScrollInfo] =
    useState<SectionRenderedParams>();

  const onCenterBodyScroll: GridProps['onScroll'] = (params) => {
    const { scrollTop, scrollLeft } = params;
    console.log('onCenterBodyScroll:', scrollLeft);

    setScrollPositionData({
      scrollTop,
      scrollLeft,
      scrollPosition: 'CenterBody',
    });

    //handleCenterVerticalScroll(params);
    //handleCenterHorizontalScroll(params);
    if (isVirtualizedScrollMounted.current && virtualScrollInfo) {
      // first scroll, not use getCache
      getPositionCache?.({
        params,
        virtualScrollInfo,
      });
      console.log('virtualScrollInfo:', virtualScrollInfo);
    }
    if (virtualScrollInfo) {
      isVirtualizedScrollMounted.current = true;
    }
  };
  const onLeftBodyScroll : GridProps['onScroll'] = (params) => {
    const { scrollTop } = params;
    const scrollLeft = scrollPositionData.scrollLeft;
    setScrollPositionData({
      scrollTop,
      scrollLeft,
      scrollPosition: 'LeftBody',
    });
    //onCenterBodyScroll({ scrollTop, scrollLeft });
  };

  useImperativeHandle<MultiGrid2Ref, MultiGrid2Ref>(
    ref,
    () => ({
      scrollToRow: (rowIndex: number) => {
        centerBodyGridRef.current?.scrollToCell({ rowIndex, columnIndex: 0 });
        leftBodyGridRef.current?.scrollToCell({ rowIndex, columnIndex: 0 });
        rightBodyGridRef.current?.scrollToCell({ rowIndex, columnIndex: 0 });
      },
      scrollToColumn: (columnIndex: number) => {
        centerBodyGridRef.current?.scrollToCell({ rowIndex: 0, columnIndex });
        centerHeaderGridRef.current?.scrollToCell({ rowIndex: 0, columnIndex });
      },
      recomputeGridSize: () => {
        // 清除缓存
        (
          [
            'LeftHeader',
            'CenterHeader',
            'RightHeader',
            'LeftBody',
            'CenterBody',
            'RightBody',
          ] as const
        ).forEach((position) => {
          deferredMeasurementCacheGrid(position).clearAll();
        });

        // 重新计算所有Grid的大小
        leftHeaderGridRef.current?.recomputeGridSize();
        centerHeaderGridRef.current?.recomputeGridSize();
        rightHeaderGridRef.current?.recomputeGridSize();
        leftBodyGridRef.current?.recomputeGridSize();
        centerBodyGridRef.current?.recomputeGridSize();
        rightBodyGridRef.current?.recomputeGridSize();
      },
      cacheRef: () => {
        return gridCache.current;
      },
    }),
    [deferredMeasurementCacheGrid],
  );

  return (
    <AutoSizer>
      {({ width, height }) => {
        return (
          <div className="relative" style={{ width, height }}>
            {/* head区域 */}
            {
              <div
                className="absolute left-0 right-0 top-0 z-0"
                style={{ height: getGridHeight(height).headerGridHeight }}
              >
                {/* 左固定 */}
                {fixedLeftColumnCount > 0 && (
                  <div className="absolute left-0 top-0 z-0">
                    <Grid
                      ref={leftHeaderGridRef}
                      width={getGridWidth(width).leftGridWidth}
                      height={getGridHeight(height).headerGridHeight}
                      columnCount={fixedLeftColumnCount}
                      rowCount={fixedTopRowCount}
                      columnWidth={({ index }) => {
                        return getGridColumnWidth({
                          index,
                          gridWidth: width,
                          position: 'LeftHeader',
                        });
                      }}
                      rowHeight={({ index }) => {
                        return getGridRowHeight({
                          index,
                          gridHeight: height,
                          position: 'LeftHeader',
                        });
                      }}
                      deferredMeasurementCache={deferredMeasurementCacheGrid(
                        'LeftHeader',
                      )}
                      cellRenderer={getGridCellRenderer('LeftHeader')}
                    />
                  </div>
                )}

                {/* 中间 */}
                {centerColumnCount > 0 && (
                  <div
                    className="absolute top-0"
                    style={{
                      left: getGridWidth(width).leftGridWidth,
                      width: getGridWidth(width).centerGridWidth,
                      height: getGridHeight(height).headerGridHeight,
                    }}
                  >
                    <Grid
                      ref={centerHeaderGridRef}
                      width={getGridWidth(width).centerGridWidth}
                      height={getGridHeight(height).headerGridHeight}
                      columnCount={centerColumnCount}
                      rowCount={fixedTopRowCount}
                      columnWidth={({ index }) => {
                        return getGridColumnWidth({
                          index,
                          gridWidth: width,
                          position: 'CenterHeader',
                        });
                      }}
                      rowHeight={({ index }) => {
                        return getGridRowHeight({
                          index,
                          gridHeight: height,
                          position: 'CenterHeader',
                        });
                      }}
                      deferredMeasurementCache={deferredMeasurementCacheGrid(
                        'CenterHeader',
                      )}
                      cellRenderer={getGridCellRenderer('CenterHeader')}
                      /*onScroll={handleHeaderHorizontalScroll}*/
                      scrollLeft={
                        scrollPositionData.scrollPosition === 'CenterHeader'
                          ? undefined
                          : scrollPositionData.scrollLeft
                      }
                    />
                  </div>
                )}

                {/* 右固定 */}
                {fixedRightColumnCount > 0 && (
                  <div
                    className="absolute right-0 top-0 z-0"
                    style={{
                      width: getGridWidth(width).rightGridWidth,
                      height: getGridHeight(height).headerGridHeight,
                    }}
                  >
                    <Grid
                      ref={rightHeaderGridRef}
                      width={getGridWidth(width).rightGridWidth}
                      height={getGridHeight(height).headerGridHeight}
                      columnCount={fixedRightColumnCount}
                      rowCount={fixedTopRowCount}
                      columnWidth={({ index }) => {
                        return getGridColumnWidth({
                          index,
                          gridWidth: width,
                          position: 'RightHeader',
                        });
                      }}
                      rowHeight={({ index }) => {
                        return getGridRowHeight({
                          index,
                          gridHeight: height,
                          position: 'RightHeader',
                        });
                      }}
                      deferredMeasurementCache={deferredMeasurementCacheGrid(
                        'RightHeader',
                      )}
                      cellRenderer={getGridCellRenderer('RightHeader')}
                    />
                  </div>
                )}
              </div>
            }

            {/* body区域 */}
            <div
              className="absolute left-0 right-0 bg-white"
              style={{
                top: getGridHeight(height).headerGridHeight,
                height: getGridHeight(height).bodyGridHeight,
              }}
            >
              {/* 左固定 */}
              {fixedLeftColumnCount > 0 && (
                <div
                  className="absolute left-0 top-0 z-0"
                  style={{
                    width: getGridWidth(width).leftGridWidth,
                    height: getGridHeight(height).bodyGridHeight,
                  }}
                >
                  <Grid
                    ref={leftBodyGridRef}
                    width={getGridWidth(width).leftGridWidth}
                    height={getGridHeight(height).bodyGridHeight}
                    columnCount={fixedLeftColumnCount}
                    rowCount={rowCount - fixedTopRowCount}
                    columnWidth={({ index }) => {
                      return getGridColumnWidth({
                        index,
                        gridWidth: width,
                        position: 'LeftBody',
                      });
                    }}
                    rowHeight={({ index }) => {
                      return getGridRowHeight({
                        index,
                        gridHeight: height,
                        position: 'LeftBody',
                      });
                    }}
                    deferredMeasurementCache={deferredMeasurementCacheGrid(
                      'LeftBody',
                    )}
                    cellRenderer={getGridCellRenderer('LeftBody')}
                    onScroll={onLeftBodyScroll}
                    scrollTop={
                      scrollPositionData.scrollPosition === 'LeftBody'
                        ? undefined
                        : scrollPositionData.scrollTop
                    }
                  />
                </div>
              )}

              {/* 中间 */}
              {centerColumnCount > 0 && (
                <div
                  className="absolute top-0 bg-white"
                  style={{
                    left: getGridWidth(width).leftGridWidth,
                    width: getGridWidth(width).centerGridWidth,
                    height: getGridHeight(height).bodyGridHeight,
                  }}
                >
                  <Grid
                    ref={centerBodyGridRef}
                    width={getGridWidth(width).centerGridWidth}
                    height={getGridHeight(height).bodyGridHeight}
                    columnCount={centerColumnCount}
                    rowCount={rowCount - fixedTopRowCount}
                    columnWidth={({ index }) => {
                      return getGridColumnWidth({
                        index,
                        gridWidth: width,
                        position: 'CenterBody',
                      });
                    }}
                    rowHeight={({ index }) => {
                      return getGridRowHeight({
                        index,
                        gridHeight: height,
                        position: 'CenterBody',
                      });
                    }}
                    deferredMeasurementCache={deferredMeasurementCacheGrid(
                      'CenterBody',
                    )}
                    cellRenderer={getGridCellRenderer('CenterBody')}
                    onScroll={onCenterBodyScroll}
                    scrollTop={
                      scrollPositionData.scrollPosition === 'CenterBody'
                        ? undefined
                        : scrollPositionData.scrollTop
                    }
                    /*scrollTop={500}
                    scrollLeft={200}*/
                    scrollToRow={scrollToRow - fixedTopRowCount}
                    scrollToColumn={scrollToColumn - fixedLeftColumnCount}
                    onSectionRendered={(info) => {
                      setVirtualScrollInfo(info);
                    }}
                  />
                </div>
              )}

              {/* 右固定 */}
              {fixedRightColumnCount > 0 && (
                <div
                  className="absolute right-0 top-0 z-0"
                  style={{
                    width: getGridWidth(width).rightGridWidth,
                    height: getGridHeight(height).bodyGridHeight,
                  }}
                >
                  <Grid
                    ref={rightBodyGridRef}
                    width={getGridWidth(width).rightGridWidth}
                    height={getGridHeight(height).bodyGridHeight}
                    columnCount={fixedRightColumnCount}
                    rowCount={rowCount - fixedTopRowCount}
                    columnWidth={({ index }) => {
                      return getGridColumnWidth({
                        index,
                        gridWidth: width,
                        position: 'RightBody',
                      });
                    }}
                    rowHeight={({ index }) => {
                      return getGridRowHeight({
                        index,
                        gridHeight: height,
                        position: 'RightBody',
                      });
                    }}
                    deferredMeasurementCache={deferredMeasurementCacheGrid(
                      'RightBody',
                    )}
                    cellRenderer={getGridCellRenderer('RightBody')}
                    /*onScroll={handleRightVerticalScroll}*/
                    scrollTop={
                      scrollPositionData.scrollPosition === 'RightBody'
                        ? undefined
                        : scrollPositionData.scrollTop
                    }
                  />
                </div>
              )}
            </div>
          </div>
        );
      }}
    </AutoSizer>
  );
};

export default MultiGrid2;
