import React, { useImperativeHandle, useRef, useState } from 'react';
import type {
  ListRowRenderer,
  ListProps as VirtualizedListProps,
} from 'react-virtualized';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List as VirtualizedList,
} from 'react-virtualized';
import type { CellMeasurerChildProps } from 'react-virtualized/dist/es/CellMeasurer';
import type { RenderedRows } from 'react-virtualized/dist/es/List';

export type { VirtualizedList, CellMeasurerCache };

type PositionCacheData = {
  /** 滚动条顶部位置 */
  scrollTop: number;
  /** 虚拟滚动的可视区域起始索引 */
  startIndex?: number;
  /** 虚拟滚动的可视区域结束索引 */
  stopIndex?: number;
};
export type VirtualScrollListProps = {
  /** 虚拟滚动配置 */
  virtualConfig?: {
    /** 每项默认高度 */
    defaultHeight?: number;
    /** 每项最小高度 */
    minHeight?: number;
  } & Pick<VirtualizedListProps, 'scrollToAlignment'>;
  /** 列表项内容 */
  childrenArray: React.ReactNode[];
  /** 获取滚动位置，可用于缓存 */
  getPositionCache?: (cache: PositionCacheData) => void;
  /** 滚动到指定索引 */
  virtualScrollToIndex?: number;
  /** 虚拟滚动列表的ref引用 */
  ref?: React.Ref<VirtualizedList>;
  /** 缓存的ref引用 */
  cacheRef?: React.Ref<CellMeasurerCache>;
};
const VirtualScrollList = (props: VirtualScrollListProps) => {
  const {
    virtualConfig = {},
    childrenArray,
    getPositionCache,
    virtualScrollToIndex,
    ref,
    cacheRef,
  } = props;

  const { defaultHeight, minHeight, scrollToAlignment } = virtualConfig;
  const isVirtualizedListScrollMounted = useRef(false);
  const [virtualScrollInfo, setVirtualScrollInfo] = useState<RenderedRows>();

  const [cache] = useState(
    new CellMeasurerCache({
      defaultHeight: defaultHeight,
      minHeight: minHeight,
      fixedWidth: true,
    }),
  );

  useImperativeHandle<CellMeasurerCache, CellMeasurerCache>(cacheRef, () => {
    return cache;
  });

  const rowRenderer: ListRowRenderer = (props) => {
    // eslint-disable-next-line react/prop-types
    const { key, index, style, parent } = props;
    const child = childrenArray[index];
    const itemRender = (opts: {
      registerChild: CellMeasurerChildProps['registerChild'];
    }) => {
      const { registerChild } = opts;
      return (
        <div ref={registerChild} style={style}>
          {child}
        </div>
      );
    };
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {({ registerChild }) => itemRender({ registerChild })}
      </CellMeasurer>
    );
  };

  const onVirtualizedListScroll: VirtualizedListProps['onScroll'] = (
    params,
  ) => {
    const { scrollTop } = params;
    if (isVirtualizedListScrollMounted.current && virtualScrollInfo) {
      // first scroll, not use getCache
      getPositionCache?.({
        scrollTop,
        startIndex: virtualScrollInfo.startIndex,
        stopIndex: virtualScrollInfo.stopIndex,
      });
    }
    if (virtualScrollInfo) {
      isVirtualizedListScrollMounted.current = true;
    }
  };

  return (
    <AutoSizer>
      {(opts) => {
        const { width, height } = opts;
        return (
          <VirtualizedList
            width={width}
            height={height}
            rowCount={childrenArray.length}
            deferredMeasurementCache={cache}
            rowHeight={cache.rowHeight}
            rowRenderer={rowRenderer}
            onRowsRendered={(info) => {
              setVirtualScrollInfo(info);
            }}
            scrollToAlignment={scrollToAlignment}
            scrollToIndex={virtualScrollToIndex}
            onScroll={onVirtualizedListScroll}
            ref={ref}
          />
        );
      }}
    </AutoSizer>
  );
};
export default VirtualScrollList;
