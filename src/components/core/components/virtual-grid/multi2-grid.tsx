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
import CellMeasurerCacheDecorator from '@/components/core/components/virtual-grid/cell-measurer-cache-decorator.ts';

/* eslint-disable react/prop-types */

export type MultiGrid2Ref = {
  /** 滚动到指定行 */
  scrollToRow: (rowIndex: number) => void;
  /** 滚动到指定列 */
  scrollToColumn: (columnIndex: number) => void;
  /** 滚动到指定单元格 */
  scrollToCell: (rowIndex: number,columnIndex: number) => void;
  /** 重新计算网格大小 */
  recomputeGridSize: () => void;
  /** 缓存测量数据 */
  cacheRef: () => CellMeasurerCache;
};
type PositionCacheData = {
  params: Pick<ScrollParams, 'scrollLeft' | 'scrollTop'>;
  virtualScrollInfo: SectionRenderedParams;
};
export type MultiGrid2Props = {
  /** 单元格默认宽度, 默认100 */
  defaultWidth?: number;
  /** 单元格最小宽度 */
  minWidth?: number;
  /** 单元格默认高度， 默认30 */
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
  /** 滚动到指定行, 存在固定行或列使用scrollToCell方法 */
  scrollToRow?: number;
  /** 滚动到指定列, 存在固定行或列使用scrollToCell方法 */
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
  const [scrollPositionData, setScrollPositionData] = useState<
    PositionCacheData['params'] & {
      scrollPosition: Position;
    }
  >({ scrollTop: 0, scrollLeft: 0, scrollPosition: 'CenterBody' });

  // 中间区域的列数
  const centerColumnCount = useMemo(() => {
    return Math.max(
      columnCount - fixedLeftColumnCount - fixedRightColumnCount,
      0,
    );
  }, [columnCount, fixedLeftColumnCount, fixedRightColumnCount]);

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

  const onScroll = (opts: {
    params: PositionCacheData['params'];
    scrollPosition: Position;
  }) => {
    const { params, scrollPosition = 'CenterBody' } = opts;
    console.log('onCenterBodyScroll:', params);

    setScrollPositionData({
      ...params,
      scrollPosition,
    });

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

  const onCenterBodyScroll: GridProps['onScroll'] = (params) => {
    onScroll({
      params,
      scrollPosition: 'CenterBody',
    });
  };
  const onCenterHeaderScroll: GridProps['onScroll'] = (params) => {
    const { scrollLeft } = params;
    const scrollTop = scrollPositionData.scrollTop;
    onScroll({
      params: {
        scrollTop,
        scrollLeft,
      },
      scrollPosition: 'CenterHeader',
    });
  };
  const onLeftBodyScroll: GridProps['onScroll'] = (params) => {
    const { scrollTop } = params;
    const scrollLeft = scrollPositionData.scrollLeft;
    onScroll({
      params: {
        scrollTop,
        scrollLeft,
      },
      scrollPosition: 'LeftBody',
    });
  };
  const onRightBodyScroll: GridProps['onScroll'] = (params) => {
    const { scrollTop } = params;
    const scrollLeft = scrollPositionData.scrollLeft;
    onScroll({
      params: {
        scrollTop,
        scrollLeft,
      },
      scrollPosition: 'RightBody',
    });
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
      scrollToCell: (rowIndex: number,columnIndex: number) => {
        console.log('scrollToCell:',rowIndex,columnIndex);
        setTimeout(()=>{
          centerBodyGridRef.current!.scrollToCell({ rowIndex, columnIndex });

        },50);

        //centerHeaderGridRef.current!.scrollToCell({ rowIndex: 0, columnIndex });
        //leftBodyGridRef.current!.scrollToCell({ rowIndex, columnIndex: 0 });
        //rightBodyGridRef.current!.scrollToCell({ rowIndex, columnIndex: 0 });
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
              <div className="absolute left-0 right-0 top-0 z-0">
                {/* 左固定 */}
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

                {/* 中间 */}
                <div
                  className="absolute top-0"
                  style={{
                    left: getGridWidth(width).leftGridWidth,
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
                    onScroll={onCenterHeaderScroll}
                    scrollLeft={
                      scrollPositionData.scrollPosition === 'CenterHeader'
                        ? undefined
                        : scrollPositionData.scrollLeft
                    }
                    scrollToRow={scrollToRow - fixedTopRowCount}
                    scrollToColumn={scrollToColumn - fixedLeftColumnCount}
                  />
                </div>

                {/* 右固定 */}
                <div className="absolute right-0 top-0 z-0">
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
              </div>
            }

            {/* body区域 */}
            <div
              className="absolute left-0 right-0 bg-white"
              style={{
                top: getGridHeight(height).headerGridHeight,
              }}
            >
              {/* 左固定 */}
              <div className="absolute left-0 top-0 z-0">
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
                  scrollToRow={scrollToRow - fixedTopRowCount}
                  scrollToColumn={scrollToColumn - fixedLeftColumnCount}
                />
              </div>

              {/* 中间 */}
              <div
                className="absolute top-0 bg-white"
                style={{
                  left: getGridWidth(width).leftGridWidth,
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
                    scrollLeft={
                      scrollPositionData.scrollPosition === 'CenterBody'
                        ? undefined
                        : scrollPositionData.scrollLeft
                    }
                  scrollToRow={scrollToRow - fixedTopRowCount}
                  scrollToColumn={scrollToColumn - fixedLeftColumnCount}
                  onSectionRendered={(info) => {
                    setVirtualScrollInfo(info);
                  }}
                />
              </div>

              {/* 右固定 */}
              <div className="absolute right-0 top-0 z-0">
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
                  onScroll={onRightBodyScroll}
                  scrollTop={
                    scrollPositionData.scrollPosition === 'RightBody'
                      ? undefined
                      : scrollPositionData.scrollTop
                  }
                  scrollToRow={scrollToRow - fixedTopRowCount}
                  scrollToColumn={scrollToColumn - fixedLeftColumnCount}
                />
              </div>
            </div>
          </div>
        );
      }}
    </AutoSizer>
  );
};

export default MultiGrid2;
