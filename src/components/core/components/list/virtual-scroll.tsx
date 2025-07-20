import React from 'react';
import classConfig from '@/components/core/components/list/class-config.ts';
import type { VirtualGridProps } from '@/components/core/components/virtual-grid';
import VirtualGrid from '@/components/core/components/virtual-grid';

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
  virtualConfig?: Pick<
    VirtualGridProps,
    | 'scrollToAlignment'
    | 'defaultHeight'
    | 'minHeight'
    | 'fixedHeight'
    | 'rowHeight'
    | 'windowScroller'
  >;
  /** 列表项总数 */
  rowCount: number;
  /** 渲染单个列表项的函数 */
  renderItem: (index: number) => React.ReactNode;
  /** 获取滚动位置，可用于缓存 */
  getPositionCache?: (cache: PositionCacheData) => void;
  /** 滚动到指定索引 */
  virtualScrollToIndex?: number;
  /** 虚拟滚动列表的ref引用 */
  ref?: VirtualGridProps['ref'];
};
const VirtualScrollList = (props: VirtualScrollListProps) => {
  const {
    virtualConfig = {},
    rowCount,
    renderItem,
    getPositionCache,
    virtualScrollToIndex,
    ref,
  } = props;

  return (
    <VirtualGrid
      className={classConfig.virtualGridConfig.className}
      ref={ref}
      columnCount={1}
      rowCount={rowCount}
      cellRenderer={({ rowIndex }) => renderItem(rowIndex)}
      getPositionCache={(cache) => {
        getPositionCache?.({
          scrollTop: cache.params.scrollTop,
          startIndex: cache.virtualScrollInfo.rowStartIndex,
          stopIndex: cache.virtualScrollInfo.rowStopIndex,
        });
      }}
      scrollToRow={virtualScrollToIndex}
      {...virtualConfig}
    />
  );
};
export default VirtualScrollList;
