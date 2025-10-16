import React, {
  useCallback,
  useEffect,
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
import { WindowScroller } from 'react-virtualized';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  Grid,
} from 'react-virtualized';
import type {
  GridCellProps,
  SectionRenderedParams,
} from 'react-virtualized/dist/es/Grid';
import type { WindowScrollerChildProps } from 'react-virtualized/dist/es/WindowScroller';
import { cn } from '@/components/core/class-config';
import CellMeasurerCacheDecorator from './cell-measurer-cache-decorator.ts';
import classConfig from './class-config.ts';

export type VirtualGridRef = {
  /** 预先测量网格中的所有列和行 */
  measureAllCells: () => void;
  /** 重新计算网格大小 */
  recomputeGridSize: (params?: {
    columnIndex?: number | undefined;
    rowIndex?: number | undefined;
  }) => void;
  /** 滚动到指定单元格 */
  scrollToCell: (rowIndex: number, columnIndex: number) => void;
  /** 滚动到指定位置 */
  scrollToPosition(params: { scrollLeft: number; scrollTop: number }): void;
  /** 缓存测量数据 */
  getCache: () => CellMeasurerCache;
};
type PositionCacheData = {
  params: Pick<ScrollParams, 'scrollLeft' | 'scrollTop'>;
  virtualScrollInfo: SectionRenderedParams;
};
type IWindowScroller =
  | boolean
  | {
      /** 滚动元素,用于附加滚动事件侦听器的元素。默认为window */
      scrollElement?: typeof window | Element | undefined;
    };
export type VirtualGridProps = {
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
  ref?: React.Ref<VirtualGridRef>;
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
  /** 单元格渲染函数 */
  cellRenderer: (props: GridCellProps, measure: () => void) => React.ReactNode;
  /** 是否隐藏中间表头区域的滚动条 */
  hideCenterHeaderGridScrollbar?: boolean;
  /** 是否隐藏左上角的滚动条 */
  hideLeftBodyGridScrollbar?: boolean;
  /** 是否隐藏右下角的滚动条 */
  hideRightBodyGridScrollbar?: boolean;
  /** 容器的类名 */
  className?: string;
  /** 左上角的表头的类名 */
  leftHeaderClass?: string;
  /** 中间表头的类名 */
  centerHeaderClass?: string;
  /** 右上角的表头的类名 */
  rightHeaderClass?: string;
  /** 左边区域的类名 */
  leftBodyClass?: string;
  /** 中间区域的类名 */
  centerBodyClass?: string;
  /** 右边区域的类名 */
  rightBodyClass?: string;
  /**
   * 是否使用WindowScroller
   * 此组件目前不适用于设置fixed行列
   * 此组件目前不适用于水平滚动网格，因为水平滚动会重置内部滚动顶部
   * */
  windowScroller?: IWindowScroller;
} & Pick<
  GridProps,
  | 'scrollToAlignment'
  | 'scrollToRow'
  | 'scrollToColumn'
  | 'rowCount'
  | 'columnCount'
  | 'autoContainerWidth'
>;

type Position =
  | 'LeftHeader'
  | 'CenterHeader'
  | 'RightHeader'
  | 'LeftBody'
  | 'CenterBody'
  | 'RightBody';

const VirtualGrid = (props: VirtualGridProps) => {
  const {
    defaultWidth,
    minWidth,
    defaultHeight,
    minHeight,
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
    scrollToAlignment = 'end',
    hideCenterHeaderGridScrollbar = false,
    hideLeftBodyGridScrollbar = false,
    hideRightBodyGridScrollbar = false,
    autoContainerWidth,
    className,
    leftHeaderClass,
    centerHeaderClass,
    rightHeaderClass,
    leftBodyClass,
    centerBodyClass,
    rightBodyClass,
  } = props;
  let { windowScroller = false } = props;
  if (
    fixedTopRowCount > 0 ||
    fixedLeftColumnCount > 0 ||
    fixedRightColumnCount > 0
  ) {
    // 设置fixed行列下无效
    windowScroller = false;
  }
  const isWindowScroller = Boolean(windowScroller);
  const isOneColumn = columnCount === 1;
  const fixedWidth = props.fixedWidth ?? isOneColumn;

  // 计算初始滚动位置
  const initialScrollToRow = useMemo(
    () =>
      scrollToRow - fixedTopRowCount < 0
        ? undefined
        : scrollToRow - fixedTopRowCount,
    [fixedTopRowCount, scrollToRow],
  );

  const initialScrollToColumn = useMemo(
    () =>
      scrollToColumn - fixedLeftColumnCount < 0
        ? undefined
        : scrollToColumn - fixedLeftColumnCount,
    [fixedLeftColumnCount, scrollToColumn],
  );

  // 使用 state 管理滚动位置，因为它会在用户交互时被重置
  const [centerBodyScrollToRow, setCenterBodyScrollToRow] = useState<
    number | undefined
  >(initialScrollToRow);
  const [centerBodyScrollToColumn, setCenterBodyScrollToColumn] = useState<
    number | undefined
  >(initialScrollToColumn);

  // 当计算值改变时，同步更新 state（在渲染期间）
  if (centerBodyScrollToRow !== initialScrollToRow) {
    setCenterBodyScrollToRow(initialScrollToRow);
  }
  if (centerBodyScrollToColumn !== initialScrollToColumn) {
    setCenterBodyScrollToColumn(initialScrollToColumn);
  }

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
      /** 是否用户使用滚动条滚动 */
      isUserScroll: boolean;
    }
  >({
    scrollTop: 0,
    scrollLeft: 0,
    scrollPosition: 'CenterBody',
    isUserScroll: false,
  });

  // 中间区域的列数
  const centerColumnCount = useMemo(() => {
    return Math.max(
      0,
      columnCount - fixedLeftColumnCount - fixedRightColumnCount,
    );
  }, [columnCount, fixedLeftColumnCount, fixedRightColumnCount]);

  // 创建缓存对象
  const gridCache = useRef(
    new CellMeasurerCache({
      defaultWidth: defaultWidth,
      minWidth: minWidth,
      defaultHeight: defaultHeight,
      minHeight: minHeight,
      fixedWidth: fixedWidth,
      fixedHeight: fixedHeight,
    }),
  );

  const getMultiGridIndex = useCallback(
    (
      gridIndex: { rowIndex?: number; columnIndex?: number },
      position: Position,
    ) => {
      const { rowIndex = 0, columnIndex = 0 } = gridIndex;
      let multiColumnIndex = columnIndex;
      let multiRowIndex = rowIndex;
      if (position.startsWith('Center')) {
        multiColumnIndex = columnIndex + fixedLeftColumnCount;
      }
      if (position.startsWith('Right')) {
        multiColumnIndex =
          columnIndex + fixedLeftColumnCount + centerColumnCount;
      }
      if (position.endsWith('Body')) {
        multiRowIndex = rowIndex + fixedTopRowCount;
      }
      return { multiColumnIndex, multiRowIndex };
    },
    [centerColumnCount, fixedLeftColumnCount, fixedTopRowCount],
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
          const { multiColumnIndex } = getMultiGridIndex(
            { columnIndex: index },
            position,
          );
          return columnWidth({ index: multiColumnIndex, gridWidth });
        } else {
          return columnWidth;
        }
      }
      return isOneColumn
        ? gridWidth
        : deferredMeasurementCacheGrid(position).columnWidth({ index });
    },
    [columnWidth, deferredMeasurementCacheGrid, getMultiGridIndex, isOneColumn],
  );

  const getGridRowHeight = useCallback(
    (params: { index: number; gridHeight: number; position: Position }) => {
      const { index, gridHeight, position } = params;
      if (rowHeight) {
        if (typeof rowHeight === 'function') {
          const { multiRowIndex } = getMultiGridIndex(
            { rowIndex: index },
            position,
          );
          return rowHeight({ index: multiRowIndex, gridHeight });
        } else {
          return rowHeight;
        }
      }
      return deferredMeasurementCacheGrid(position).rowHeight({ index });
    },
    [deferredMeasurementCacheGrid, getMultiGridIndex, rowHeight],
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
          {({ measure, registerChild }) => (
            <div ref={registerChild} style={style}>
              {cellRenderer(
                {
                  columnIndex,
                  rowIndex,
                  style,
                  key,
                  parent,
                  isScrolling,
                  isVisible,
                },
                measure,
              )}
            </div>
          )}
        </CellMeasurer>
      );
    };
    return customCellRenderer;
  };

  const onScroll = (opts: {
    params: PositionCacheData['params'];
    scrollPosition: Position;
  }) => {
    const { params, scrollPosition } = opts;
    if (scrollPosition !== 'CenterBody') {
      setCenterBodyScrollToRow(undefined);
      setCenterBodyScrollToColumn(undefined);
    }
    let isUserScroll = true;
    if (
      centerBodyScrollToRow !== undefined ||
      centerBodyScrollToColumn !== undefined
    ) {
      isUserScroll = false;
      setCenterBodyScrollToRow(undefined);
      setCenterBodyScrollToColumn(undefined);
    }

    setScrollPositionData({
      ...params,
      scrollPosition,
      isUserScroll,
    });
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

  const measureAllCells = () => {
    leftHeaderGridRef.current?.measureAllCells();
    centerHeaderGridRef.current?.measureAllCells();
    rightHeaderGridRef.current?.measureAllCells();
    leftBodyGridRef.current?.measureAllCells();
    centerBodyGridRef.current?.measureAllCells();
    rightBodyGridRef.current?.measureAllCells();
  };

  const recomputeGridSize = useCallback(
    ({ columnIndex = 0, rowIndex = 0 } = {}) => {
      const centerColumnIndex = Math.max(0, columnIndex - fixedLeftColumnCount);
      const rightColumnIndex = Math.max(
        0,
        columnIndex - fixedLeftColumnCount - centerColumnIndex,
      );
      const bodyRowIndex = Math.max(0, rowIndex - fixedTopRowCount);

      leftHeaderGridRef.current?.recomputeGridSize({
        columnIndex,
        rowIndex,
      });
      centerHeaderGridRef.current?.recomputeGridSize({
        columnIndex: centerColumnIndex,
        rowIndex,
      });
      rightHeaderGridRef.current?.recomputeGridSize({
        columnIndex: rightColumnIndex,
        rowIndex,
      });
      leftBodyGridRef.current?.recomputeGridSize({
        columnIndex,
        rowIndex: bodyRowIndex,
      });
      centerBodyGridRef.current?.recomputeGridSize({
        columnIndex: centerColumnIndex,
        rowIndex: bodyRowIndex,
      });
      rightBodyGridRef.current?.recomputeGridSize({
        columnIndex: rightColumnIndex,
        rowIndex: bodyRowIndex,
      });
    },
    [fixedLeftColumnCount, fixedTopRowCount],
  );
  const scrollToCell = useCallback(
    (rowIndex: number, columnIndex: number) => {
      // 计算实际的行列索引（考虑固定区域的偏移）
      const actualRowIndex = rowIndex - fixedTopRowCount;
      const actualColumnIndex = columnIndex - fixedLeftColumnCount;

      setScrollPositionData({
        ...scrollPositionData,
        scrollPosition: 'CenterBody',
        isUserScroll: false,
      });

      centerBodyGridRef.current?.scrollToCell({
        rowIndex: actualRowIndex,
        columnIndex: actualColumnIndex,
      });
    },
    [fixedLeftColumnCount, fixedTopRowCount, scrollPositionData],
  );

  const scrollToPosition = useCallback(
    (params: { scrollLeft: number; scrollTop: number }) => {
      setScrollPositionData({
        ...params,
        scrollPosition: 'CenterBody',
        isUserScroll: false,
      });
      centerBodyGridRef.current?.scrollToPosition(params);
    },
    [],
  );

  useImperativeHandle<VirtualGridRef, VirtualGridRef>(
    ref,
    () => ({
      measureAllCells,
      recomputeGridSize,
      scrollToCell: scrollToCell,
      scrollToPosition: scrollToPosition,
      getCache: () => {
        return gridCache.current;
      },
    }),
    [recomputeGridSize, scrollToCell, scrollToPosition],
  );

  const [headerGridHeight, setHeaderGridHeight] = useState(0);

  useEffect(() => {
    recomputeGridSize();
  }, [headerGridHeight, recomputeGridSize]);

  const renderLeftHeaderGrid = (opts: { width: number; height: number }) => {
    const { width, height } = opts;
    if (fixedTopRowCount <= 0 || fixedLeftColumnCount <= 0) {
      return null;
    }
    return (
      <div className={cn(classConfig.leftHeaderConfig, leftHeaderClass)}>
        <Grid
          data-testid="leftHeaderGrid"
          ref={leftHeaderGridRef}
          width={getGridWidth(width).leftGridWidth}
          height={
            headerGridHeight > 0
              ? headerGridHeight
              : getGridHeight(height).headerGridHeight
          }
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
          deferredMeasurementCache={deferredMeasurementCacheGrid('LeftHeader')}
          scrollToAlignment={scrollToAlignment}
          cellRenderer={getGridCellRenderer('LeftHeader')}
          onSectionRendered={() => {
            setHeaderGridHeight(getGridHeight(height).headerGridHeight);
          }}
        />
      </div>
    );
  };

  const renderCenterHeaderGrid = (opts: { width: number; height: number }) => {
    const { width, height } = opts;
    if (fixedTopRowCount <= 0 || centerColumnCount === 0) {
      return null;
    }
    return (
      <div
        className={cn(classConfig.centerHeaderConfig, centerHeaderClass)}
        style={{
          left: getGridWidth(width).leftGridWidth,
        }}
      >
        <Grid
          data-testid="centerHeaderGrid"
          ref={centerHeaderGridRef}
          width={getGridWidth(width).centerGridWidth}
          height={
            headerGridHeight > 0
              ? headerGridHeight
              : getGridHeight(height).headerGridHeight
          }
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
          scrollToAlignment={scrollToAlignment}
          cellRenderer={getGridCellRenderer('CenterHeader')}
          onScroll={onCenterHeaderScroll}
          style={
            hideCenterHeaderGridScrollbar ? { overflow: 'hidden' } : undefined
          }
          scrollLeft={scrollPositionData.scrollLeft}
          onSectionRendered={() => {
            setHeaderGridHeight(getGridHeight(height).headerGridHeight);
          }}
        />
      </div>
    );
  };

  const renderRightHeaderGrid = (opts: { width: number; height: number }) => {
    const { width, height } = opts;
    if (fixedTopRowCount <= 0 || fixedRightColumnCount <= 0) {
      return null;
    }
    return (
      <div className={cn(classConfig.rightHeaderConfig, rightHeaderClass)}>
        <Grid
          data-testid="rightHeaderGrid"
          ref={rightHeaderGridRef}
          width={getGridWidth(width).rightGridWidth}
          height={
            headerGridHeight > 0
              ? headerGridHeight
              : getGridHeight(height).headerGridHeight
          }
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
          deferredMeasurementCache={deferredMeasurementCacheGrid('RightHeader')}
          scrollToAlignment={scrollToAlignment}
          cellRenderer={getGridCellRenderer('RightHeader')}
          onSectionRendered={() => {
            setHeaderGridHeight(getGridHeight(height).headerGridHeight);
          }}
        />
      </div>
    );
  };

  const renderLeftBodyGrid = (opts: { width: number; height: number }) => {
    const { width, height } = opts;
    const leftRowCount = Math.max(0, rowCount - fixedTopRowCount);
    if (leftRowCount === 0 || fixedLeftColumnCount <= 0) {
      return null;
    }
    return (
      <div className={cn(classConfig.leftBodyConfig, leftBodyClass)}>
        <Grid
          data-testid="leftBodyGrid"
          ref={leftBodyGridRef}
          width={getGridWidth(width).leftGridWidth}
          height={getGridHeight(height).bodyGridHeight}
          columnCount={fixedLeftColumnCount}
          rowCount={leftRowCount}
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
          deferredMeasurementCache={deferredMeasurementCacheGrid('LeftBody')}
          scrollToAlignment={scrollToAlignment}
          cellRenderer={getGridCellRenderer('LeftBody')}
          onScroll={onLeftBodyScroll}
          style={hideLeftBodyGridScrollbar ? { overflow: 'hidden' } : undefined}
          scrollTop={scrollPositionData.scrollTop}
        />
      </div>
    );
  };

  const renderCenterBodyGrid = (opts: {
    width: number;
    height: number;
    windowScrollerChildProps?: WindowScrollerChildProps;
  }) => {
    const { width, height } = opts;
    const { windowScrollerChildProps } = opts;
    const centerRowCount = Math.max(0, rowCount - fixedTopRowCount);
    if (centerRowCount === 0 || centerColumnCount === 0) {
      return null;
    }

    let innerScrollTop =
      scrollPositionData.scrollPosition === 'CenterBody'
        ? undefined
        : scrollPositionData.scrollTop;
    if (
      windowScrollerChildProps &&
      scrollPositionData.scrollPosition === 'CenterBody' &&
      scrollPositionData.isUserScroll
    ) {
      innerScrollTop = windowScrollerChildProps.scrollTop;
    }

    return (
      <div
        className={cn(classConfig.centerBodyConfig, centerBodyClass)}
        style={{
          left: getGridWidth(width).leftGridWidth,
        }}
      >
        <Grid
          data-testid="centerBodyGrid"
          ref={centerBodyGridRef}
          width={getGridWidth(width).centerGridWidth}
          height={getGridHeight(height).bodyGridHeight}
          autoHeight={isWindowScroller}
          columnCount={centerColumnCount}
          rowCount={centerRowCount}
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
          deferredMeasurementCache={deferredMeasurementCacheGrid('CenterBody')}
          scrollToAlignment={scrollToAlignment}
          cellRenderer={getGridCellRenderer('CenterBody')}
          onScroll={(params) => {
            windowScrollerChildProps?.onChildScroll(params);
            onCenterBodyScroll(params);
          }}
          scrollTop={innerScrollTop}
          scrollLeft={
            scrollPositionData.scrollPosition === 'CenterBody'
              ? undefined
              : scrollPositionData.scrollLeft
          }
          scrollToRow={centerBodyScrollToRow}
          scrollToColumn={centerBodyScrollToColumn}
          onSectionRendered={(info) => {
            getPositionCache?.({
              params: {
                scrollLeft: scrollPositionData.scrollLeft,
                scrollTop: scrollPositionData.scrollTop,
              },
              virtualScrollInfo: info,
            });
            if (
              !(fixedWidth && fixedHeight) &&
              (fixedLeftColumnCount > 0 ||
                fixedRightColumnCount > 0 ||
                fixedTopRowCount > 0)
            ) {
              // 动态高宽，多个grid时，重新计算网格大小
              recomputeGridSize();
            }
          }}
          autoContainerWidth={autoContainerWidth}
        />
      </div>
    );
  };

  const renderRightBodyGrid = (opts: { width: number; height: number }) => {
    const { width, height } = opts;
    const rightRowCount = Math.max(0, rowCount - fixedTopRowCount);
    if (rightRowCount === 0 || fixedRightColumnCount <= 0) {
      return null;
    }
    return (
      <div className={cn(classConfig.rightBodyConfig, rightBodyClass)}>
        <Grid
          data-testid="rightBodyGrid"
          ref={rightBodyGridRef}
          width={getGridWidth(width).rightGridWidth}
          height={getGridHeight(height).bodyGridHeight}
          columnCount={fixedRightColumnCount}
          rowCount={rightRowCount}
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
          deferredMeasurementCache={deferredMeasurementCacheGrid('RightBody')}
          scrollToAlignment={scrollToAlignment}
          cellRenderer={getGridCellRenderer('RightBody')}
          onScroll={onRightBodyScroll}
          style={
            hideRightBodyGridScrollbar ? { overflow: 'hidden' } : undefined
          }
          scrollTop={scrollPositionData.scrollTop}
        />
      </div>
    );
  };

  const renderMain = (windowScrollerChildProps?: WindowScrollerChildProps) => {
    const windowScrollerHeight = windowScrollerChildProps?.height;

    return (
      <div className={className}>
        <AutoSizer disableHeight={isWindowScroller}>
          {({ width, height: autoSizerHeight }) => {
            const height = isWindowScroller
              ? windowScrollerHeight!
              : autoSizerHeight;
            return (
              <div
                className={classConfig.containerConfig}
                style={{ width, height }}
              >
                {/* head区域 */}
                {
                  <div className={classConfig.headerConfig}>
                    {/* 左固定 */}
                    {renderLeftHeaderGrid({ width, height })}

                    {/* 中间 */}
                    {renderCenterHeaderGrid({ width, height })}

                    {/* 右固定 */}
                    {renderRightHeaderGrid({ width, height })}
                  </div>
                }

                {/* body区域 */}
                <div
                  className={classConfig.bodyConfig}
                  style={{
                    top: getGridHeight(height).headerGridHeight,
                  }}
                >
                  {/* 左固定 */}
                  {renderLeftBodyGrid({ width, height })}

                  {/* 中间 */}
                  {renderCenterBodyGrid({
                    width,
                    height,
                    windowScrollerChildProps,
                  })}

                  {/* 右固定 */}
                  {renderRightBodyGrid({ width, height })}
                </div>
              </div>
            );
          }}
        </AutoSizer>
      </div>
    );
  };

  return (
    <>
      {isWindowScroller ? (
        <WindowScroller
          scrollElement={
            typeof windowScroller === 'boolean'
              ? undefined
              : windowScroller.scrollElement
          }
        >
          {(windowScrollerChildProps) => {
            return renderMain(windowScrollerChildProps);
          }}
        </WindowScroller>
      ) : (
        renderMain()
      )}
    </>
  );
};

export default VirtualGrid;
