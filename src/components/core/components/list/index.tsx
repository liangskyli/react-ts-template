import React, { Fragment, useImperativeHandle, useRef, useState } from 'react';
import { cn } from '@/components/core/class-config';
import classConfig from '@/components/core/components/list/class-config.ts';
import type { InfiniteScrollProps } from '@/components/core/components/list/infinite-scroll.tsx';
import InfiniteScroll from '@/components/core/components/list/infinite-scroll.tsx';
import { ListItem } from '@/components/core/components/list/item.tsx';
import { flattenChildren } from '@/components/core/components/list/util.ts';
import type {
  CellMeasurerCache,
  VirtualScrollListProps,
  VirtualizedList,
} from '@/components/core/components/list/virtual-scroll.tsx';
import VirtualScrollList from '@/components/core/components/list/virtual-scroll.tsx';

export type ListRef = {
  /** 滚动到指定位置 */
  scrollToPosition: (scrollTop: number) => void;
  /** 滚动到指定索引,虚拟滚动模式下可用 */
  virtualScrollToIndex: (index: number) => void;
};
export type ListProps<T = unknown> = {
  /** 是否启用虚拟滚动,或虚拟滚动配置 */
  virtualScroll?: boolean | VirtualScrollListProps['virtualConfig'];
  /** 无限滚动,分页加载数据,仅list属性配置后有效 */
  infiniteScroll?: Omit<InfiniteScrollProps, 'loadMoreFinally' | 'ref'>;
  /** 自定义类名 */
  className?: string;
  /** 列表内容,函数方式需要配置list属性, ReactNode方式不支持无限滚动 */
  children: ((listData: T[]) => React.ReactNode) | React.ReactNode;
  /** 滚动列表的ref */
  ref?: React.Ref<ListRef>;
  /** 列表数据,仅函数方式需要配置 */
  list?: T[];
} & Pick<VirtualScrollListProps, 'getPositionCache'>;

const List = <T = unknown,>(props: ListProps<T>) => {
  const {
    virtualScroll = false,
    className,
    children,
    infiniteScroll,
    getPositionCache,
    ref,
    list,
  } = props;

  const listRef = useRef<HTMLDivElement>(null);
  const virtualizedListRef = useRef<VirtualizedList>(null);
  const cacheRef = useRef<CellMeasurerCache>(null);
  const [virtualScrollToIndex, setVirtualScrollToIndex] = useState<number>();

  useImperativeHandle<ListRef, ListRef>(ref, () => {
    return {
      scrollToPosition: (scrollTop: number) => {
        if (virtualScroll) {
          virtualizedListRef.current?.scrollToPosition(scrollTop);
        } else {
          // use setTimeout to make sure data is rendered
          setTimeout(() => {
            listRef.current!.scrollTop = scrollTop;
          }, 0);
        }
      },
      virtualScrollToIndex: (index: number) => {
        if (virtualScroll) {
          setVirtualScrollToIndex(index);
        }
      },
    };
  }, [virtualScroll]);

  let childrenArray: React.ReactNode[] = [];
  if (typeof children === 'function') {
    if (list) {
      const childrenNode = children(list);
      // 将children转换为数组，以便在rowRenderer中使用
      childrenArray = flattenChildren(childrenNode);
      if (infiniteScroll && list.length > 0) {
        const { children: infiniteScrollChildren, ...otherProps } =
          infiniteScroll;
        childrenArray.push(
          <InfiniteScroll
            {...otherProps}
            loadMoreFinally={() => {
              cacheRef.current?.clear(childrenArray.length - 1, 0);
            }}
          >
            {infiniteScrollChildren}
          </InfiniteScroll>,
        );
      }
    }
  } else {
    childrenArray = flattenChildren(children);
  }

  const onDivListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.target as HTMLDivElement;
    if (!virtualScroll) {
      getPositionCache?.({ scrollTop: scrollTop });
    }
  };

  return (
    <div
      className={cn(
        classConfig.listConfig({
          defaultScrollHeight: Boolean(virtualScroll) || !!infiniteScroll,
          isScroll: !virtualScroll && !!infiniteScroll,
        }),
        className,
      )}
      onScroll={onDivListScroll}
      role="list"
      ref={listRef}
    >
      {virtualScroll ? (
        <VirtualScrollList
          ref={virtualizedListRef}
          cacheRef={cacheRef}
          virtualConfig={virtualScroll === true ? undefined : virtualScroll}
          childrenArray={childrenArray}
          virtualScrollToIndex={virtualScrollToIndex}
          getPositionCache={getPositionCache}
        />
      ) : (
        <>
          {childrenArray.map((child, index) => {
            return (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <Fragment key={(child as any).key ?? index}>{child}</Fragment>
            );
          })}
        </>
      )}
    </div>
  );
};

List.Item = ListItem;
export default List;
